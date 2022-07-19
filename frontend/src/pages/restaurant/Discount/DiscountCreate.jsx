import React, { useCallback, useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import ClearIcon from '@material-ui/icons/Clear'
import { createDiscount, getDiscount, updateDiscount } from '../../../apis/discount'
import CustomTabs from '../../../components/CustomTabs/CustomTabs'
import TabPanel from '../../../components/CustomTabs/TabPanel'
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { getGoods } from '../../../apis/good'
import DiscountContraints from './DiscountConstraints'
import CustomAccordion from '../../../components/CustomAccordion/CustomAccordion'
// import './DiscountCreate.css'

const defaultValues = {
  name: '',
  type: 'invoice',
  method: 'invoice-discount',
  status: null,
  description: '',
  isAppliedDirectly: false,
  customerGroups: [],
  fromDate: null,
  toDate: null,
  hours: [],
  constraints: [],
}

function DiscountCreate({ discountId, isModalVisible, handleCloseModal }) {
  const [discountData, setDiscountData] = useState(defaultValues)
  const [discountMethodOptions, setDiscountMethodOptions] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [goodOptions, setGoodOptions] = useState([])
  const [isSaveDiscountSuccessful, setSaveDiscountSuccessful] = useState(false)

  const fetchdiscountData = async (discountId) => {
    const discount = (await getDiscount(discountId)).data
    if (discount) {
      setDiscountData({
        name: discount.name,
        type: discount.type,
        method: discount.method,
        status: discount.status,
        description: discount.description,
        isAppliedDirectly: discount.is_auto_applied === 1,
        customerGroups: [],
        fromDate: discount.start_date,
        toDate: discount.end_date,
        constraints: discount.constraints,
        hours: [],
      })
    }
  }

  const handleSearchGoodOptions = async (keyword) => {
    const res = await getGoods()
    setGoodOptions(res.data)
  }

  const handleAddConstraintInput = useCallback(() => {
    let newConstraint
    if (discountData.type === 'invoice') {
      newConstraint =
        discountData.method === 'invoice-discount' ? { min_invoice_value: null, discount_amount: null, discount_unit: null } : {}
    } else {
      newConstraint = discountData.method === 'good-discount' ? { discount_option: 'sale_price' } : {}
    }
    setDiscountData({ ...discountData, constraints: [...discountData.constraints, newConstraint] })
  }, [discountData])

  const handleChangeConstraintRow = useCallback(
    (idx, field, newVal) => {
      setDiscountData({
        ...discountData,
        constraints: discountData.constraints.map((constraint, index) => (index === idx ? { ...constraint, [field]: newVal } : constraint)),
      })
    },
    [discountData]
  )

  const handleDeleteConstraint = useCallback(
    (idx) => {
      setDiscountData({ ...discountData, constraints: discountData.constraints.filter((constraint, index) => index !== idx) })
    },
    [discountData]
  )
  const handleSaveDiscount = useCallback(async () => {
    console.log('discount data: ', discountData)
    const postData = {
      name: discountData.name,
      description: discountData.description,
      status: discountData.status,
      type: discountData.type,
      method: discountData.method,
      constraints: discountData.constraints,
      start_date: discountData.fromDate,
      end_date: discountData.toDate,
      is_auto_applied: discountData.isAppliedDirectly,
      hours: discountData.hours,
    }
    console.log('post data: ', postData)
    if (discountId) {
      await updateDiscount(discountId, postData)
    } else {
      await createDiscount(postData)
    }
    handleCloseModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountId, discountData])

  const handleAddTimeRange = useCallback(() => {
    setDiscountData({ ...discountData, hours: [...discountData.hours, { fromHour: null, toHour: null }] })
  }, [discountData])

  const handleUpdateTimeRange = useCallback(
    (selectedIndex, key, val) => {
      setDiscountData({
        ...discountData,
        hours: discountData.hours.map((timeRange, index) => (index === selectedIndex ? { ...timeRange, [key]: val } : timeRange)),
      })
    },
    [discountData]
  )

  const handleRemoveTimeRange = useCallback(
    (idx) => {
      setDiscountData({
        ...discountData,
        hours: discountData.hours.filter((_, index) => index !== idx),
      })
    },
    [discountData]
  )

  useEffect(() => {
    if (discountId) {
      console.log('discount id: ', discountId)
      fetchdiscountData(discountId)
    } else {
      setDiscountData(defaultValues)
    }
  }, [discountId])

  useEffect(() => {
    if (discountData.type === 'invoice') {
      setDiscountMethodOptions([
        {
          name: 'Giảm giá đơn hàng',
          value: 'invoice-discount',
        },
        {
          name: 'Tặng món/quà',
          value: 'invoice-giveaway',
        },
      ])
    } else {
      setDiscountMethodOptions([
        {
          name: 'Mua hàng khuyến mại hàng',
          value: 'good-giveaway',
        },
        {
          name: 'Giảm giá/ Đồng giá (theo SL mua)',
          value: 'good-discount',
        },
      ])
    }
  }, [discountData.type])

  useEffect(() => {
    if (discountMethodOptions.length) {
      setDiscountData({ ...discountData, method: discountMethodOptions[0].value })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountMethodOptions])

  useEffect(() => {
    console.log('discount data: ', discountData)
  }, [discountData])

  return (
    <Modal isModalVisible={isModalVisible} handleClose={handleCloseModal} title='Thêm chương trình khuyến mãi'>
      <CustomTabs
        labels={['Thông tin chung', 'Điều kiện áp dụng', 'Áp dụng khuyến mại']}
        activeTab={activeTab}
        onChangeActiveTab={(val) => setActiveTab(val)}
      >
        <TabPanel value={activeTab} index={0}>
          <div>
            <TextField
              label='Mã chương trình'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22,
                },
              }}
            />
            <TextField
              label='Tên chương trình'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22,
                },
              }}
              required
              value={discountData.name}
              onChange={(e) => setDiscountData({ ...discountData, name: e.target.value })}
            />
            <FormControl margin='normal'>
              <FormLabel id='demo-radio-buttons-group-label'>Trạng thái</FormLabel>
              <RadioGroup
                row
                aria-labelledby='demo-radio-buttons-group-label'
                value={discountData.status || 'activated'}
                name='radio-buttons-group'
              >
                <FormControlLabel value='activated' control={<Radio />} label='Kích hoạt' />
                <FormControlLabel value='inactivated' control={<Radio />} label='Chưa áp dụng' />
              </RadioGroup>
            </FormControl>
            <CustomAccordion title='Mô tả'>
              <div style={{ flex: 1 }}>
                <TextField
                  label='Ghi chú'
                  fullWidth
                  multiline
                  rows={3}
                  variant='outlined'
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 22,
                    },
                  }}
                  value={discountData.description}
                  onChange={(e) => setDiscountData({ ...discountData, description: e.target.value })}
                />
              </div>
            </CustomAccordion>
          </div>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <div>
            <TextField
              label='Khuyến mại theo'
              margin='normal'
              fullWidth
              select
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22,
                },
              }}
              value={discountData.type}
              onChange={(e) => setDiscountData({ ...discountData, type: e.target.value })}
            >
              <option value='invoice'>Hóa đơn</option>
              <option value='good'>Hàng hóa</option>
            </TextField>
            <TextField
              label='Hình thức'
              margin='normal'
              fullWidth
              select
              SelectProps={{ native: true }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22,
                },
              }}
              value={discountData.method}
              onChange={(e) => setDiscountData({ ...discountData, method: e.target.value })}
            >
              {discountMethodOptions.map((option) => (
                <option value={option.value}>{option.name}</option>
              ))}
            </TextField>
            <FormControlLabel control={<Checkbox />} label='Tự động áp dụng khuyến mại này khi tạo đơn' />
            <DiscountContraints
              constraints={discountData.constraints}
              type={discountData.type}
              method={discountData.method}
              discountId={discountId}
              handleAddConstraintInput={handleAddConstraintInput}
              handleChangeConstraintRow={handleChangeConstraintRow}
              handleDeleteConstraint={handleDeleteConstraint}
            />
          </div>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <div>
            <Card>
              <CardHeader title='Thời gian áp dụng' titleTypographyProps={{ style: { fontSize: 18 } }} />
              <CardContent>
                <div style={{ display: 'flex' }}>
                  <TextField
                    label='Hiệu lực từ'
                    margin='normal'
                    type='date'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 22,
                      },
                    }}
                    required
                    fullWidth
                    style={{ marginRight: '2rem' }}
                    value={discountData.fromDate}
                    onChange={(e) => setDiscountData({ ...discountData, fromDate: e.target.value })}
                  />
                  <TextField
                    label='Hiệu lực đến'
                    margin='normal'
                    type='date'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 22,
                      },
                    }}
                    required
                    fullWidth
                    onChange={(e) => setDiscountData({ ...discountData, toDate: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card style={{ marginTop: '2rem' }}>
              <CardHeader title='Khung giờ áp dụng khuyến mại' titleTypographyProps={{ style: { fontSize: 18 } }} />
              <CardContent>
                <Button variant='contained' onClick={handleAddTimeRange}>
                  Thêm khung giờ
                </Button>
                {discountData.hours.length > 0 && (
                  <div>
                    {discountData.hours.map((timeRange, idx) => (
                      <div style={{ display: 'flex', marginBottom: 10 }}>
                        <TextField
                          label='Từ giờ'
                          margin='normal'
                          type='time'
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              fontSize: 22,
                            },
                          }}
                          style={{ marginRight: '2rem' }}
                          value={timeRange.fromHour}
                          onChange={(e) => handleUpdateTimeRange(idx, 'fromHour', e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label='Đến giờ'
                          type='time'
                          margin='normal'
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              fontSize: 22,
                            },
                          }}
                          fullWidth
                          value={timeRange.toHour}
                          onChange={(e) => handleUpdateTimeRange(idx, 'toHour', e.target.value)}
                        />
                        <IconButton style={{ marginLeft: '1rem' }} onClick={() => handleRemoveTimeRange(idx)}>
                          <ClearIcon />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabPanel>
      </CustomTabs>
      <div style={{ display: 'flex', float: 'right', marginTop: 2 }}>
        <Button variant='contained' color='primary' onClick={handleSaveDiscount}>
          Luu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Huy bo
        </Button>
      </div>
    </Modal>
  )
}

export default DiscountCreate


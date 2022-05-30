import React, { useCallback, useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import {
  Button,
  ButtonGroup,
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
import { createDiscount, getDiscount, updateDiscount } from '../../../apis/discount'
import CustomTabs from '../../../components/CustomTabs/CustomTabs'
import TabPanel from '../../../components/CustomTabs/TabPanel'
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { getGoods } from '../../../apis/good'
import DiscountContraints from './DiscountConstraints'
// import './DiscountCreate.css'

const tabLabels = ['Hình thức khuyến mại', 'Thời gian áp dụng', 'Phạm vi áp dụng']

const defaultValues = {
  name: '',
  type: 'invoice',
  method: 'invoice-discount',
  status: null,
  isAppliedToAllCustomers: false,
  isAppliedDirectly: false,
  customerGroups: [],
  fromDate: null,
  toDate: null,
  fromDay: null,
  toDay: null,
  hours: [],
  constraints: [],
}

function DiscountCreate({ discountId, isModalVisible, handleCloseModal }) {
  const [discountData, setDiscountData] = useState(defaultValues)
  const [discountMethodOptions, setDiscountMethodOptions] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [goodOptions, setGoodOptions] = useState([])

  const fetchdiscountData = async (discountId) => {
    const res = await getDiscount(discountId)
    const { name, type } = res.data
    setDiscountData({
      name,
      type,
    })
  }

  const handleSearchGoodOptions = async (keyword) => {
    const res = await getGoods()
    setGoodOptions(res.data)
  }

  const handleAddConstraintInput = useCallback(() => {
    let newConstraint
    if (discountData.type === 'invoice') {
      newConstraint = discountData.method === 'invoice-discount' ? {} : {}
    } else {
      newConstraint = discountData.method === 'good-discount' ? {} : {}
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
      console.log('index: ', idx)
      setDiscountData({ ...discountData, constraints: discountData.constraints.filter((constraint, index) => index !== idx) })
    },
    [discountData]
  )
  const handleSaveDiscount = useCallback(async () => {
    if (discountId) {
      console.log(discountData)
      await updateDiscount(discountId, discountData)
    } else {
      await createDiscount(discountData)
    }
    handleCloseModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountId, discountData])

  useEffect(() => {
    if (discountId) {
      fetchdiscountData(discountId)
    } else {
      setDiscountData(defaultValues)
    }
  }, [discountId])

  useEffect(() => {
    console.log('data: ', discountData)
  }, [discountData])

  useEffect(() => {
    if (discountData.type === 'invoice') {
      setDiscountMethodOptions([
        {
          name: 'Giảm giá đơn hàng',
          value: 'invoice-discount',
        },
        {
          name: 'Tặng món/quà',
          value: 'invoice-good-giveaway',
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

  return (
    <Modal isModalVisible={isModalVisible} handleClose={handleCloseModal} title='Thêm chương trình khuyến mãi'>
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
        />
        <FormControl margin='normal'>
          <FormLabel id='demo-radio-buttons-group-label'>Trạng thái</FormLabel>
          <RadioGroup row aria-labelledby='demo-radio-buttons-group-label' defaultValue='male' name='radio-buttons-group'>
            <FormControlLabel value='activated' control={<Radio />} label='Kích hoạt' />
            <FormControlLabel value='inactivated' control={<Radio />} label='Chưa áp dụng' />
          </RadioGroup>
        </FormControl>
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
        />
      </div>
      <Divider />
      <CustomTabs labels={tabLabels} activeTab={activeTab} onChangeActiveTab={(val) => setActiveTab(val)}>
        <TabPanel value={activeTab} index={0}>
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
        <TabPanel value={activeTab} index={1}>
          <div>
            <div>
              <TextField
                label='Hiệu lực từ'
                margin='normal'
                type='datetime-local'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22,
                  },
                }}
              />
              <TextField
                label='Hiệu lực đến'
                margin='normal'
                type='datetime-local'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22,
                  },
                }}
              />
            </div>

            <TextField
              label='Theo tháng'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22,
                },
              }}
              fullWidth
            />
            <TextField
              label='Theo ngày'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22,
                },
              }}
              fullWidth
            />
            <TextField
              label='Theo giờ'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22,
                },
              }}
              fullWidth
            />
          </div>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <div>
            <FormControl>
              <FormLabel id='demo-radio-buttons-group-label'>Đối tượng áp dụng</FormLabel>
              <RadioGroup aria-labelledby='demo-radio-buttons-group-label' defaultValue='all' name='radio-buttons-group'>
                <FormControlLabel value='all' control={<Radio />} label='Toàn bộ khách hàng' />
                <FormControlLabel value='groups' control={<Radio />} label='Nhóm khách hàng' />
              </RadioGroup>
            </FormControl>
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


import React, { useCallback, useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { Button, IconButton, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core'
import CameraAltIcon from '@material-ui/icons/CameraAlt'
import DeleteIcon from '@material-ui/icons/Delete'
import CustomTabs from '../../../components/CustomTabs/CustomTabs'
import { Autocomplete } from '@material-ui/lab'
import TabPanel from '../../../components/CustomTabs/TabPanel'
import pick from '../../../utils/pick'
import { createGood, getGood, getGoods, updateGood } from '../../../apis/good'
import CustomAccordion from '../../../components/CustomAccordion/CustomAccordion'
// import './GoodCreate.css'

const defaultGoodData = {
  name: '',
  menuId: null,
  goodGroupId: null,
  importPrice: null,
  salePrice: null,
  quantity: null,
  minQuantity: null,
  maxQuantity: null,
  description: '',
  attributes: [],
  units: [],
  components: []
}

function GoodAttributeCreate(props) {
  const { attribute, handleChange, handleDelete } = props

  return (
    <div style={{ display: 'flex', marginBottom: 10 }}>
      <TextField
        label='Tên thuộc tính'
        InputLabelProps={{
          shrink: true,
          style: {
            fontSize: 22
          }
        }}
        style={{
          justifyContent: 'flex-end'
        }}
        value={attribute.name}
        onChange={(e) => handleChange({ ...attribute, name: e.target.value })}
      />
      <Autocomplete
        className='navbar__searchBar__container'
        freeSolo
        id='free-solo-2-demo'
        multiple
        options={[]}
        // getOptionLabel={(option) => option.userName && option.fullName}
        filterOptions={(options, state) => options}
        onChange={(e, options) => {
          handleChange({ ...attribute, values: options })
        }}
        style={{ flex: 1, marginLeft: 10 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Giá trị'
            fullWidth
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 22
              }
            }}
          />
        )}
      />
      <IconButton onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}

function GoodUnitCreate(props) {
  const { unit, handleChange, handleDelete } = props

  return (
    <div style={{ display: 'flex', marginBottom: 10 }}>
      <TextField
        label='Tên thuộc tính'
        InputLabelProps={{
          shrink: true,
          style: {
            fontSize: 22
          }
        }}
        value={unit.name}
        onChange={(e) => handleChange({ ...unit, name: e.target.value })}
      />
      <Autocomplete
        className='navbar__searchBar__container'
        freeSolo
        id='free-solo-2-demo'
        multiple
        options={[]}
        // getOptionLabel={(option) => option.userName && option.fullName}
        filterOptions={(options, state) => options}
        onChange={(e, options) => {
          handleChange({ ...unit, values: options })
        }}
        style={{ flex: 1, marginLeft: 10 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Giá trị'
            fullWidth
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 22
              }
            }}
          />
        )}
      />
      <IconButton onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}

function GoodComponents({ components, onChangeComponentQuantity, onDeleteComponent }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Tên hàng thành phần</TableCell>
            <TableCell>Số lượng</TableCell>
            <TableCell>Giá vốn</TableCell>
            <TableCell>Thành tiền</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {components.map((component, idx) => (
            <TableRow key={component.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{component.name}</TableCell>
              <TableCell>
                <TextField type='number' InputProps={{ inputProps: { min: 1 } }} value={component.quantity} onChange={(e) => onChangeComponentQuantity(component.id, e.target.value)} />
              </TableCell>
              <TableCell>{component.import_price}</TableCell>
              <TableCell>{component.import_price * (component.quantity || 1)}</TableCell>
              <TableCell>
                <IconButton onClick={() => onDeleteComponent(component.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function GoodCreate({ goodId, isModalVisible, handleCloseModal }) {
  const [goodData, setGoodData] = useState(defaultGoodData)
  const [goodOptions, setGoodOptions] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [componentKeyword, setComponentKeyword] = useState('')

  const fetchGoodData = async (goodId) => {
    const res = await getGood(goodId)
    console.log(res)
  }

  const handleSelectImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    setSelectedFile(e.target.files[0])
  }

  const handleSearchGoodOptions = async (keyword) => {
    const res = await getGoods()
    setGoodOptions(res.data.map((option) => pick(option, ['id', 'name', 'import_price'])))
  }

  const handleComponentSearchInputChange = useCallback(
    (e, val, reason) => {
      if (reason === 'select-option') {
        const isAlreadySelected = goodData.components.findIndex((comp) => comp.id === val.id) !== -1
        if (!isAlreadySelected) {
          setGoodData({
            ...goodData,
            components: [...goodData.components, { ...val, quantity: 1 }]
          })
        }
        setComponentKeyword('')
      }
    },
    [goodData]
  )

  const handleChangeComponentQuantity = useCallback(
    (componentId, quantity) => {
      setGoodData({
        ...goodData,
        components: goodData.components.map((comp) => (comp.id === componentId ? { ...comp, quantity } : comp))
      })
    },
    [goodData]
  )

  const handleDeleteComponent = useCallback(
    (componentId) => {
      setGoodData({
        ...goodData,
        components: goodData.components.filter((comp) => comp.id !== componentId)
      })
    },
    [goodData]
  )

  useEffect(() => {
    if (!selectedFile) {
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setProfilePreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  useEffect(() => {
    handleSearchGoodOptions(componentKeyword)
  }, [componentKeyword])

  const handleSaveGood = useCallback(async () => {
    const uploadData = {
      name: goodData.name,
      description: goodData.description,
      quantity: goodData.quantity,
      import_price: goodData.importPrice,
      sale_price: goodData.salePrice,
      min_quantity_threshold: goodData.minQuantity,
      max_quantity_threshold: goodData.maxQuantity,
      is_sold_directly: false,
      is_topping: false
    }
    if (goodId) {
      await updateGood(goodId, uploadData)
    } else {
      await createGood(uploadData)
    }
    handleCloseModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodId, goodData])

  useEffect(() => {
    if (goodId) {
      fetchGoodData(goodId)
    }
  }, [goodId])

  return (
    <div className='good__create__container'>
      <Modal isModalVisible={isModalVisible} handleClose={handleCloseModal} title='Thêm hàng hóa'>
        <CustomTabs labels={['Thông tin chung', 'Thành phần']} activeTab={activeTab} onChangeActiveTab={(val) => setActiveTab(val)}>
          <TabPanel value={activeTab} index={0}>
            <div>
              <TextField
                label='Tên hàng hóa'
                fullWidth
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22
                  }
                }}
                value={goodData.name}
                onChange={(e) => setGoodData({ ...goodData, name: e.target.value })}
              />

              <TextField
                select
                margin='normal'
                label='Nhóm hàng'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22
                  }
                }}
                SelectProps={{
                  native: true
                }}
                fullWidth
              ></TextField>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  label='Giá vốn'
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 22
                    }
                  }}
                  style={{ marginRight: 10 }}
                  type='number'
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>đ</InputAdornment>
                  }}
                  value={goodData.importPrice}
                  onChange={(e) => setGoodData({ ...goodData, importPrice: e.target.value })}
                />
                <TextField
                  label='Giá bán'
                  margin='normal'
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 22
                    }
                  }}
                  style={{ marginRight: 10 }}
                  value={goodData.salePrice}
                  onChange={(e) => setGoodData({ ...goodData, salePrice: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>đ</InputAdornment>
                  }}
                />
                <TextField
                  label='Tồn kho'
                  margin='normal'
                  type='number'
                  value={goodData.quantity}
                  onChange={(e) => setGoodData({ ...goodData, quantity: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 22
                    }
                  }}
                />
              </div>

              <TextField
                id='standard-multiline-static'
                variant='outlined'
                fullWidth
                label='Mô tả'
                multiline
                margin='normal'
                rows={5}
                value={goodData.description}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22
                  }
                }}
                onChange={(e) => setGoodData({ ...goodData, description: e.target.value })}
              />

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                <div style={{ border: '1px dashed', minHeight: 200, marginBottom: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  {selectedFile ? (
                    <img src={profilePreview} alt='profile-preview' style={{ maxWidth: 150, minHeight: 150, maxHeight: 300 }} />
                  ) : (
                    <>
                      <IconButton size='medium'>
                        <CameraAltIcon />
                      </IconButton>
                      <Typography>Tải ảnh lên</Typography>
                    </>
                  )}
                </div>
                {selectedFile ? (
                  <Button variant='contained' color='secondary' onClick={() => setSelectedFile(null)}>
                    Xóa ảnh
                  </Button>
                ) : (
                  <Button variant='contained' component='label'>
                    <Typography>Chọn ảnh</Typography>
                    <input type='file' name='profile' onChange={handleSelectImage} hidden />
                  </Button>
                )}
              </div>

              <CustomAccordion title='Định mức tồn kho'>
                <div style={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label='Ít nhất'
                    margin='normal'
                    type='number'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 22
                      }
                    }}
                    value={goodData.minQuantity}
                    onChange={(e) => setGoodData({ ...goodData, minQuantity: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    label='Nhiều nhất'
                    type='number'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 22
                      }
                    }}
                    value={goodData.maxQuantity}
                    onChange={(e) => setGoodData({ ...goodData, maxQuantity: e.target.value })}
                  />
                </div>
              </CustomAccordion>
              <CustomAccordion title='Thuộc tính (Màu sắc, kích thước)'>
                <div style={{ flex: 1 }}>
                  <div>
                    <Button
                      variant='contained'
                      onClick={() =>
                        setGoodData({
                          ...goodData,
                          attributes: [
                            {
                              name: '',
                              values: []
                            },
                            ...goodData.attributes
                          ]
                        })
                      }
                    >
                      Thêm thuộc tính
                    </Button>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    {goodData.attributes.map((attribute, index) => (
                      <GoodAttributeCreate
                        attribute={attribute}
                        handleChange={(newAttribute) =>
                          setGoodData({
                            ...goodData,
                            attributes: goodData.attributes.map((attr, idx) => (idx === index ? newAttribute : attr))
                          })
                        }
                        handleDelete={() => setGoodData({ ...goodData, attributes: goodData.attributes.filter((attr, idx) => idx !== index) })}
                      />
                    ))}
                  </div>
                </div>
              </CustomAccordion>

              <CustomAccordion title='Đơn vị tính'>
                <div style={{ flex: 1 }}>
                  <TextField
                    margin='normal'
                    label='Đơn vị cơ bản'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 22
                      }
                    }}
                  />
                  <div>
                    <Button variant='contained'>Thêm đơn vị tính</Button>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    {goodData.attributes.map((attribute, index) => (
                      <GoodAttributeCreate
                        attribute={attribute}
                        handleChange={(newAttribute) =>
                          setGoodData({
                            ...goodData,
                            attributes: goodData.attributes.map((attr, idx) => (idx === index ? newAttribute : attr))
                          })
                        }
                        handleDelete={() => setGoodData({ ...goodData, attributes: goodData.attributes.filter((attr, idx) => idx !== index) })}
                      />
                    ))}
                  </div>
                </div>
              </CustomAccordion>
            </div>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <Autocomplete
              className='navbar__searchBar__container'
              id='free-solo-2-demo'
              options={goodOptions}
              inputValue={componentKeyword}
              value={null}
              onInputChange={(e, val) => setComponentKeyword(val)}
              getOptionLabel={(option) => option.name}
              filterOptions={(options, state) => options}
              onChange={handleComponentSearchInputChange}
              renderInput={(params) => (
                <TextField
                  label='Hàng hóa thành phần'
                  {...params}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 22
                    }
                  }}
                />
              )}
            />
            {goodData.components.length > 0 && (
              <div>
                <GoodComponents components={goodData.components} onChangeComponentQuantity={handleChangeComponentQuantity} onDeleteComponent={handleDeleteComponent} />
              </div>
            )}
          </TabPanel>
        </CustomTabs>
        <div style={{ display: 'flex', float: 'right', marginTop: 2 }}>
          <Button variant='contained' color='primary' onClick={handleSaveGood}>
            Luu
          </Button>
          <Button variant='contained' onClick={handleCloseModal}>
            Huy bo
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default GoodCreate
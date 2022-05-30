import React, { useCallback, useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import {
  Button,
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
import CustomTable from '../../../components/Table/CustomTable'
import CustomTabs from '../../../components/CustomTabs/CustomTabs'
import TabPanel from '../../../components/CustomTabs/TabPanel'
import { createMenu, getMenu, getMenuCategory, updateMenu } from '../../../apis/menu'
import { Autocomplete } from '@material-ui/lab'
import DeleteIcon from '@material-ui/icons/Delete'
import CustomAccordion from '../../../components/CustomAccordion/CustomAccordion'
import { getGoods } from '../../../apis/good'
import pick from '../../../utils/pick'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
// import './MenuCreate.css'

const defaultMenuData = {
  name: '',
  type: '',
  categories: [],
  status: null,
}

const categoryCols = [{ id: 'name', label: 'Tên hạng mục', isSortable: true }]

function CategoryCreateModal(props) {
  const { menuId, categoryId, isModalVisible, handleCloseModal, handleCreateCategory } = props
  const [categoryData, setCategoryData] = useState({
    name: '',
    items: [],
  })
  const [goodOptions, setGoodOptions] = useState([])
  const [componentKeyword, setComponentKeyword] = useState('')

  const fetchCategoryData = async (menuId, categoryId) => {
    const res = await getMenuCategory(menuId, categoryId)
    console.log(res.data)
  }

  const handleComponentSearchInputChange = useCallback(
    (e, val, reason) => {
      if (reason === 'select-option') {
        const isAlreadySelected = categoryData.items.findIndex((item) => item.id === val.id) !== -1
        if (!isAlreadySelected) {
          setCategoryData({
            ...categoryData,
            items: [...categoryData.items, val],
          })
        }
        setComponentKeyword('')
      }
    },
    [categoryData]
  )

  const handleSearchGoodOptions = async (keyword) => {
    const res = await getGoods()
    setGoodOptions(res.data.map((option) => pick(option, ['id', 'name', 'sale_price'])))
  }

  const handleDeleteItem = useCallback(
    (itemId) => {
      setCategoryData({
        ...categoryData,
        items: categoryData.items.filter((comp) => comp.id !== itemId),
      })
    },
    [categoryData]
  )

  useEffect(() => {
    if (categoryId) {
      fetchCategoryData(menuId, categoryId)
    }
  }, [categoryId, menuId])

  useEffect(() => {
    handleSearchGoodOptions(componentKeyword)
  }, [componentKeyword])

  return (
    <Modal title='Thêm hạng mục' isModalVisible={isModalVisible} handleClose={handleCloseModal}>
      <TextField
        label='Tên hạng mục'
        fullWidth
        margin='normal'
        InputLabelProps={{
          shrink: true,
          style: {
            fontSize: 22,
          },
        }}
        value={categoryData.name}
        onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
      />
      <CustomAccordion title='Món ăn'>
        <div style={{ flex: 1 }}>
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
                fullWidth
                label='Thêm món ăn'
                {...params}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22,
                  },
                }}
              />
            )}
          />
          {categoryData.items.length > 0 && (
            <div>
              <CategoryItems items={categoryData.items} onDeleteItem={handleDeleteItem} />
            </div>
          )}
        </div>
      </CustomAccordion>
      <div style={{ display: 'flex', float: 'right', marginTop: 10 }}>
        <Button variant='contained' color='primary' onClick={() => handleCreateCategory(categoryId, categoryData)}>
          Lưu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Hủy bỏ
        </Button>
      </div>
    </Modal>
  )
}

function CategoryItems({ items, onDeleteItem }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Tên món</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.sale_price}</TableCell>
              <TableCell>
                <IconButton onClick={() => onDeleteItem(item.id)}>
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

function MenuCategories(props) {
  const { categories, actionButtons } = props
  return <CustomTable paginationEnabled={false} rows={categories} cols={categoryCols} actionButtons={actionButtons} />
}

function MenuCreate({ menuId, isModalVisible, handleCloseModal }) {
  const [activeTab, setActiveTab] = useState(0)
  const [menuData, setMenuData] = useState(defaultMenuData)
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false)
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)

  const actionButtons = [
    {
      name: 'Chi tiết',
      variant: 'contained',
      color: 'primary',
      clickHandler: (id) => {
        // setSelected(id)
        setCategoryModalVisible(true)
      },
    },
    {
      name: 'Xóa',
      variant: 'contained',
      color: 'secondary',
      clickHandler: (id) => {
        // setSelected(id)
        setDeleteDialogVisible(true)
      },
    },
  ]

  const fetchMenuData = async (menuId) => {
    const res = await getMenu(menuId)
    console.log(res)
  }

  const handleSaveMenu = useCallback(async () => {
    const uploadData = {
      name: menuData.name,
      status: menuData.status,
      type: menuData.type,
      categories: menuData.categories.map((category) => ({
        name: category.name,
        items: category.items.map((item) => item.id),
      })),
    }
    // console.log('upload: ', uploadData)
    if (menuId) {
      await updateMenu(menuId, uploadData)
    } else {
      await createMenu(uploadData)
    }
    handleCloseModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuId, menuData])

  const handleCreateCategory = useCallback(
    (categoryId, categoryData) => {
      const categories = categoryId
        ? menuData.categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  ...categoryData,
                }
              : cat
          )
        : [...menuData.categories, categoryData]
      setMenuData({
        ...menuData,
        categories: categories,
      })
      setCategoryModalVisible(false)
    },
    [menuData]
  )

  useEffect(() => {
    if (menuId) {
      fetchMenuData(menuId)
    } else {
      setMenuData(defaultMenuData)
    }
  }, [menuId])

  return (
    <>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa hạng mục'
        confirmTitle='Xóa'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa hạng mục này?'
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <CategoryCreateModal
        menuId={menuId}
        isModalVisible={isCategoryModalVisible}
        handleCloseModal={() => setCategoryModalVisible(false)}
        handleCreateCategory={handleCreateCategory}
      />
      <Modal isModalVisible={isModalVisible} handleClose={handleCloseModal} title='Thêm thực đơn'>
        <div className='menu__create__container'>
          <CustomTabs labels={['Thông tin chung', 'Hạng mục']} activeTab={activeTab} onChangeActiveTab={(val) => setActiveTab(val)}>
            <TabPanel value={activeTab} index={0}>
              <div>
                <TextField
                  label='Tên thực đơn'
                  fullWidth
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 22,
                    },
                  }}
                  value={menuData.name}
                  onChange={(e) => setMenuData({ ...menuData, name: e.target.value })}
                />

                <TextField
                  label='Loại thực đơn'
                  select
                  fullWidth
                  margin='normal'
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 22,
                    },
                  }}
                  value={menuData.type}
                  onChange={(e) => setMenuData({ ...menuData, type: e.target.value })}
                >
                  <option value='food'>Đồ ăn</option>
                  <option value='beverage'>Đồ uống</option>
                </TextField>
                <FormControl margin='normal'>
                  <FormLabel id='demo-radio-buttons-group-label'>Chi nhánh áp dụng</FormLabel>
                  <RadioGroup aria-labelledby='demo-radio-buttons-group-label' defaultValue='all' name='radio-buttons-group'>
                    <FormControlLabel value='all' control={<Radio />} label='Tất cả chi nhánh' />
                    <FormControlLabel value='groups' control={<Radio />} label='Một số chi nhánh' />
                  </RadioGroup>
                </FormControl>
              </div>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <Button variant='contained' onClick={() => setCategoryModalVisible(true)}>
                Thêm hạng mục
              </Button>
              <div style={{ maxHeight: 700, overflowY: 'scroll' }}>
                <MenuCategories categories={menuData.categories} actionButtons={actionButtons} />
              </div>
            </TabPanel>
          </CustomTabs>
          <div style={{ display: 'flex', float: 'right', marginTop: 2 }}>
            <Button variant='contained' color='primary' onClick={handleSaveMenu}>
              Lưu
            </Button>
            <Button variant='contained' onClick={handleCloseModal}>
              Hủy bỏ
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default MenuCreate


import React, { useCallback, useEffect, useRef, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
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
import ClearIcon from '@material-ui/icons/Clear'
import CustomTable from '../../../components/Table/CustomTable'
import CustomTabs from '../../../components/CustomTabs/CustomTabs'
import TabPanel from '../../../components/CustomTabs/TabPanel'
import { createMenu, getMenu, getMenuCategory, updateMenu } from '../../../apis/menu'
import { Autocomplete } from '@material-ui/lab'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CustomAccordion from '../../../components/CustomAccordion/CustomAccordion'
import { getGoods } from '../../../apis/good'
import pick from '../../../utils/pick'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import SlickList from '../../../components/SlickList/SlickList'
import MenuPopover from '../../../components/MenuPopover/MenuPopover'
// import './MenuCreate.css'

const defaultMenuData = {
  name: '',
  type: 'food',
  categories: [],
  status: 'active',
}

const defaultCategoryData = {
  name: '',
}

function CategoryCreateModal(props) {
  const { menuId, categoryId, isModalVisible, handleCloseModal, handleCreateCategory } = props
  const [categoryData, setCategoryData] = useState(defaultCategoryData)

  const fetchCategoryData = async (menuId, categoryId) => {
    const res = await getMenuCategory(menuId, categoryId)
    setCategoryData(pick(res.data, ['name']))
  }

  useEffect(() => {
    if (menuId && categoryId) {
      fetchCategoryData(menuId, categoryId)
    } else {
      setCategoryData(defaultCategoryData)
    }
  }, [categoryId, menuId])

  return (
    <Modal title={categoryId ? 'Sửa hạng mục' : 'Thêm hạng mục'} isModalVisible={isModalVisible} handleClose={handleCloseModal}>
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

function CategoryItem(props) {
  const { item, handleDeleteItem } = props
  return (
    <Card style={{ position: 'relative', margin: '1rem 1rem', minWidth: 200 }}>
      <CardHeader
        action={
          <IconButton aria-label='settings' size='small'>
            <ClearIcon />
          </IconButton>
        }
        style={{ maxHeight: 50 }}
      />
      <CardMedia
        component='img'
        alt='Contemplative Reptile'
        height={100}
        width={150}
        image='https://cdn4.vectorstock.com/i/1000x1000/71/83/sign-board-discount-vector-1947183.jpg'
        title='Discount thumbnail'
      />
      <CardContent style={{ textAlign: 'center' }}>
        <Typography style={{ fontWeight: 500 }}>{item.name}</Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          {item.sale_price}
        </Typography>
      </CardContent>
    </Card>
  )
}

function MenuCategories(props) {
  const { selectedCategoryIdx, categories, handleDeleteCategory, handleUpdateCategory, handleUpdateCategoryItems, handleSelectCategory } =
    props
  const [goodOptions, setGoodOptions] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [openedPopoverIdx, setOpenedPopoverIdx] = useState(-1)
  const [componentKeyword, setComponentKeyword] = useState('')

  const handleSearchGoodOptions = async (keyword) => {
    const res = await getGoods()
    setGoodOptions(res.data.map((option) => pick(option, ['id', 'name', 'sale_price'])))
  }

  const handleComponentSearchInputChange = useCallback(
    (e, val, reason) => {
      if (reason === 'select-option') {
        console.log('selected: ', val)
        handleUpdateCategoryItems(selectedCategoryIdx, val)

        setComponentKeyword('')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCategoryIdx]
  )

  useEffect(() => {
    handleSearchGoodOptions(componentKeyword)
  }, [componentKeyword])

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ flex: 1, marginRight: '2rem' }}>
        <Card>
          <CardContent style={{ display: 'flex', width: '100%', minWidth: 0, minHeight: 0 }}>
            <List component='nav' style={{ minWidth: 200, borderRight: '1px solid', textAlign: 'center' }}>
              {categories.map((category, idx) => (
                <ListItem button selected={idx === selectedCategoryIdx} onClick={() => handleSelectCategory(idx)}>
                  <ListItemText primary={category.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={(e) => {
                        setOpenedPopoverIdx(idx)
                        setAnchorEl(e.target)
                      }}
                      edge='end'
                      aria-label='delete'
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>

                  <MenuPopover open={openedPopoverIdx === idx} onClose={() => setOpenedPopoverIdx(-1)} anchorEl={anchorEl}>
                    <List>
                      <ListItem
                        button
                        onClick={() => {
                          setOpenedPopoverIdx(-1)
                          handleUpdateCategory(idx)
                        }}
                      >
                        <ListItemText primary='Sửa hạng mục' />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          setOpenedPopoverIdx(-1)
                          handleDeleteCategory(idx)
                        }}
                      >
                        <ListItemText primary='Xóa hạng mục' />
                      </ListItem>
                    </List>
                  </MenuPopover>
                </ListItem>
              ))}
            </List>

            <div style={{ minWidth: 500, maxWidth: 800, marginLeft: '2.5rem', padding: '0 1rem' }}>
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
                style={{ marginBottom: 10 }}
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  rowGap: 20,
                  alignItems: 'center',
                  flex: 1,
                  // padding: '2rem 2rem',
                  columnGap: 20,
                  maxHeight: 700,
                  overflow: 'auto',
                }}
              >
                {(categories.find((_, idx) => idx === selectedCategoryIdx)?.items || []).map((item) => (
                  <CategoryItem item={item} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MenuCreate({ menuId, isModalVisible, handleCloseModal }) {
  const [activeTab, setActiveTab] = useState(0)
  const [menuData, setMenuData] = useState(defaultMenuData)
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false)
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(-1)

  const fetchMenuData = async (menuId) => {
    const res = await getMenu(menuId)
    setMenuData(res.data)
  }

  const handleSaveMenu = useCallback(async () => {
    const uploadData = {
      name: menuData.name,
      status: menuData.status,
      type: menuData.type,
      categories: menuData.categories.map((category) =>
        category.id
          ? {
              id: category.id,
              name: category.name,
              items: category.items.map((item) => item.id),
            }
          : {
              name: category.name,
              items: category.items.map((item) => item.id),
            }
      ),
    }
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
        : [...menuData.categories, { ...categoryData, items: [] }]
      setMenuData({
        ...menuData,
        categories: categories,
      })
      setCategoryModalVisible(false)
    },
    [menuData]
  )

  const handleUpdateCategoryItems = useCallback(
    (categoryIdx, selectedItem) => {
      const category = menuData.categories.find((_, idx) => idx === categoryIdx)
      if (category) {
        const isAlreadySelected = category.items.findIndex((item) => item.id === selectedItem.id) !== -1
        if (!isAlreadySelected) {
          category.items = [...category.items, selectedItem]
          setMenuData({ ...menuData, categories: menuData.categories.map((cat, idx) => (idx === categoryIdx ? category : cat)) })
        }
      }
    },
    [menuData]
  )

  const handleDeleteCategory = useCallback(() => {
    setMenuData({ ...menuData, categories: menuData.categories.filter((_, idx) => idx !== selectedCategoryIdx) })
  }, [menuData, selectedCategoryIdx])

  useEffect(() => {
    if (menuId) {
      fetchMenuData(menuId)
    } else {
      setMenuData(defaultMenuData)
    }
  }, [menuId])

  useEffect(() => {
    if (!isCategoryModalVisible) {
      setSelectedCategory(null)
    }
  }, [isCategoryModalVisible])

  useEffect(() => {
    if (menuData.categories.length && selectedCategoryIdx === -1) {
      setSelectedCategoryIdx(0)
    }
  }, [menuData, selectedCategoryIdx])

  return (
    <>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa hạng mục'
        confirmTitle='Xóa'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa hạng mục này?'
        handleCancel={() => setDeleteDialogVisible(false)}
        handleConfirm={handleDeleteCategory}
        handleCloseDialog={() => setDeleteDialogVisible(false)}
      />
      <CategoryCreateModal
        categoryId={menuData.categories.find((_, idx) => idx === selectedCategoryIdx)?.id}
        menuId={menuId}
        isModalVisible={isCategoryModalVisible}
        handleCloseModal={() => setCategoryModalVisible(false)}
        handleCreateCategory={handleCreateCategory}
        handleShowCategory={(categoryId) => setSelectedCategory(categoryId)}
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
                  <FormLabel id='demo-radio-buttons-group-label'>Trạng thái</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby='demo-radio-buttons-group-label'
                    defaultValue='active'
                    value={menuData.status}
                    onChange={(e) => setMenuData({ ...menuData, status: e.target.value })}
                    name='radio-buttons-group'
                  >
                    <FormControlLabel value='active' control={<Radio />} label='Đang sử dụng' />
                    <FormControlLabel value='inactive' control={<Radio />} label='Ngừng sử dụng' />
                  </RadioGroup>
                </FormControl>
                <FormControl margin='normal' style={{ marginLeft: 20 }}>
                  <FormLabel id='demo-radio-buttons-group-label'>Chi nhánh áp dụng</FormLabel>
                  <RadioGroup row aria-labelledby='demo-radio-buttons-group-label' defaultValue='all' name='radio-buttons-group'>
                    <FormControlLabel value='all' control={<Radio />} label='Tất cả chi nhánh' />
                    <FormControlLabel value='groups' control={<Radio />} label='Một số chi nhánh' />
                  </RadioGroup>
                </FormControl>
              </div>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <Button
                variant='contained'
                onClick={() => {
                  setSelectedCategoryIdx(-1)
                  setCategoryModalVisible(true)
                }}
              >
                Thêm hạng mục
              </Button>
              {menuData.categories.length > 0 && (
                <div>
                  <MenuCategories
                    categories={menuData.categories}
                    selectedCategoryIdx={selectedCategoryIdx}
                    handleSelectCategory={(idx) => setSelectedCategoryIdx(idx)}
                    handleDeleteCategory={(categoryIdx) => {
                      setSelectedCategoryIdx(categoryIdx)
                      setDeleteDialogVisible(true)
                    }}
                    handleUpdateCategory={(categoryIdx) => {
                      setSelectedCategoryIdx(categoryIdx)
                      setCategoryModalVisible(true)
                    }}
                    handleUpdateCategoryItems={handleUpdateCategoryItems}
                  />
                </div>
              )}
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


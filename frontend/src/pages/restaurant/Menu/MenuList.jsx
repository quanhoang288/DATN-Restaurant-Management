import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { deleteMenu, getMenus } from '../../../apis/menu'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import CustomTable from '../../../components/Table/CustomTable'
import Main from '../../../containers/Main/Main'
import MenuCreate from './MenuCreate'

function MenuList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [menuList, setMenuList] = useState([])
  const [selected, setSelected] = useState(null)

  const fetchMenuList = async () => {
    const res = await getMenus()
    console.log(res)
  }

  const handleDeleteMenu = async (id) => {
    if (id) {
      await deleteMenu(id)
      setDeleteDialogVisible(false)
    }
  }

  const actionButtons = [
    {
      name: 'Chi tiet',
      variant: 'contained',
      color: 'primary',
      clickHandler: (id) => {
        setSelected(id)
        setCreateModalVisible(true)
      }
    },
    {
      name: 'Xoa',
      variant: 'contained',
      color: 'secondary',
      clickHandler: (id) => {
        setSelected(id)
        setDeleteDialogVisible(true)
      }
    }
  ]

  useEffect(() => {
    fetchMenuList()
  }, [])

  return (
    <Main>
      <div style={{ marginTop: '4rem' }}>
        <ConfirmDialog
          isModalVisible={isDeleteDialogVisible}
          title='Xóa thực đơn'
          confirmTitle='Xóa'
          cancelTitle='Hủy bỏ'
          description='Bạn có chắc chắn muốn xóa thực đơn này?'
          handleConfirm={() => handleDeleteMenu(selected)}
          handleCancel={() => setDeleteDialogVisible(false)}
        />
        <MenuCreate isModalVisible={isCreateModalVisible} handleCloseModal={() => setCreateModalVisible(false)} />
        <div style={{ float: 'right', marginBottom: '1rem' }}>
          <Button variant='contained' color='primary' onClick={() => setCreateModalVisible(true)}>
            Thêm mới
          </Button>
        </div>
        <div>
          <CustomTable rows={menuList} paginationEnabled={false} actionButtons={actionButtons} />
        </div>
      </div>
    </Main>
  )
}

export default MenuList

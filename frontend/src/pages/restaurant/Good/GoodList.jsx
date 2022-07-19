import React, { useEffect, useState } from 'react'
import { Typography, FormControlLabel, FormGroup, Button, TextField } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'

import CollapsibleCard from '../../../components/CollapsibleCard/CollapsibleCard'
import CustomTable from '../../../components/Table/CustomTable'
import GoodGroupCreate from './GoodGroupCreate'
import GoodCreate from './GoodCreate'
import Main from '../../../containers/Main/Main'
import CustomTreeViewCheckbox from '../../../components/CustomTreeView/CustomTreeViewCheckbox'
import { deleteGood, getGoods } from '../../../apis/good'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import './GoodList.css'

const cols = [
  { id: 'id', label: 'STT', isSortable: true },
  { id: 'name', label: 'Ten bep', isSortable: true },
  { id: 'type', label: 'Loai', isSortable: true },
]

function GoodList({ children }) {
  const [isGoodGroupModalVisible, setGoodGroupModalVisible] = useState(false)
  const [isGoodModalVisible, setGoodModalVisible] = useState(false)
  const [selectedGoodGroups, setSelectedGoodGroups] = useState([])
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [goodList, setGoodList] = useState([])
  const [selected, setSelected] = useState(null)

  const fetchGoodList = async () => {
    const res = await getGoods()
    setGoodList(res.data)
  }

  const handleDeleteGood = async (id) => {
    if (id) {
      await deleteGood(id)
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
        setGoodModalVisible(true)
      },
    },
    {
      name: 'Xoa',
      variant: 'contained',
      color: 'secondary',
      clickHandler: (id) => {
        setSelected(id)
        setDeleteDialogVisible(true)
      },
    },
  ]

  useEffect(() => {
    fetchGoodList()
  }, [])

  return (
    <Main>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa hàng hóa'
        confirmTitle='Xóa'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa hàng hóa này?'
        handleConfirm={() => handleDeleteGood(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <GoodCreate goodId={selected} isModalVisible={isGoodModalVisible} handleCloseModal={() => setGoodModalVisible(false)} />
      <GoodGroupCreate isModalVisible={isGoodGroupModalVisible} handleCloseModal={() => setGoodGroupModalVisible(false)} />
      <div className='good__list__container'>
        <div className='list__container'>
          <div className='list__header'>
            <Typography variant='h5'>Hàng hóa</Typography>
            <div>
              <Button size='small' variant='contained' onClick={() => setGoodModalVisible(true)}>
                Thêm mới
              </Button>
              <Button size='small' variant='contained'>
                Import
              </Button>
              <Button size='small' variant='contained'>
                Xuất file
              </Button>
            </div>
          </div>
          <div className='list__content'>
            <CustomTable rows={goodList} cols={cols} actionButtons={actionButtons} />
          </div>
        </div>
      </div>
    </Main>
  )
}

export default GoodList


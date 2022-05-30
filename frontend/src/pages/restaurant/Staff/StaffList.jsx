import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, Typography, Collapse, Avatar, IconButton, CardActions, FormControlLabel, FormGroup, Icon, Button, TextField } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import SearchIcon from '@material-ui/icons/Search'

import CollapsibleCard from '../../../components/CollapsibleCard/CollapsibleCard'
import CustomTable from '../../../components/Table/CustomTable'
// import './StaffList.css'
import Main from '../../../containers/Main/Main'
import StaffCreate from './StaffCreate'
import { staffApi } from '../../../apis'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'

const cols = [
  { id: 'id', label: 'STT', isSortable: true },
  { id: 'name', label: 'Ten bep', isSortable: true },
  { id: 'type', label: 'Loai', isSortable: true }
]

function StaffList() {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [selected, setSelected] = useState(null)

  const [staffList, setStaffList] = useState([])
  const [curPage, setCurPage] = useState(1)

  const handleDeleteStaff = async (id) => {
    if (id) {
      await staffApi.deleteStaff(id)
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

  const fetchStaffList = async (page, limit = 5) => {
    const res = await staffApi.getStaffList()
    console.log(res.data)
  }

  useEffect(() => {
    fetchStaffList()
  }, [curPage])

  useEffect(() => {
    if (isCreateModalVisible) {
      setSelected(null)
    }
  }, [isCreateModalVisible])

  return (
    <Main>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xoa nhan vien'
        confirmTitle='Xoa'
        cancelTitle='Huy bo'
        description='Ban co chac chan muon xoa nhan vien nay?'
        handleConfirm={() => handleDeleteStaff(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <StaffCreate staffId={selected} isModalVisible={isCreateModalVisible} handleCloseModal={() => setCreateModalVisible(false)} />
      <div className='good__list__container'>
        <div className='list_container'>
          <div className='list__header' style={{ marginBottom: 10 }}>
            <Typography variant='h5'>Nhân viên</Typography>
          </div>
          <div className='staff__button__group' style={{ float: 'right' }}>
            <div style={{ display: 'flex' }}>
              <Button size='small' variant='contained' onClick={() => setCreateModalVisible(true)}>
                Them moi
              </Button>
              <Button size='small' variant='contained' onClick={() => setCreateModalVisible(true)}>
                Import
              </Button>
              <Button size='small' variant='contained'>
                Xuat file
              </Button>
            </div>
          </div>
          <div className='list__content'>
            <CustomTable />
          </div>
        </div>
      </div>
    </Main>
  )
}

export default StaffList

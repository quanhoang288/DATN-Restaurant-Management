import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Collapse,
  Avatar,
  IconButton,
  CardActions,
  FormControlLabel,
  FormGroup,
  Icon,
  Button,
  TextField,
} from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import SearchIcon from '@material-ui/icons/Search'

import CollapsibleCard from '../../../components/CollapsibleCard/CollapsibleCard'
import CustomTable from '../../../components/Table/CustomTable'
// import './StaffList.css'
import Main from '../../../containers/Main/Main'
import StaffCreate from './StaffCreate'
import { staffApi } from '../../../apis'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import { getStaffList } from '../../../apis/staff'

const cols = [
  { id: 'id', label: 'STT', isSortable: true },
  { id: 'name', label: 'Ten bep', isSortable: true },
  { id: 'type', label: 'Loai', isSortable: true },
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

  const fetchStaffList = async () => {
    const staff = (await getStaffList()).data
    setStaffList(staff)
  }

  const actionButtons = [
    {
      name: 'Chi tiet',
      variant: 'contained',
      color: 'primary',
      clickHandler: (id) => {
        setSelected(id)
        setCreateModalVisible(true)
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
      <div>
        <div className='list_container'>
          <div className='list__header'>
            <Typography variant='h5'>Nhân viên</Typography>
            <div>
              <Button size='small' variant='contained' onClick={() => setCreateModalVisible(true)}>
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
            <CustomTable cols={cols} actionButtons={actionButtons} rows={staffList} />
          </div>
        </div>
      </div>
    </Main>
  )
}

export default StaffList


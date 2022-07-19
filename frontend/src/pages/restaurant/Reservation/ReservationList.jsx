import React, { useEffect, useState } from 'react'

import { Button, TextField, Typography } from '@material-ui/core'
import { deleteReservation, getReservations, updateReservation } from '../../../apis/reservation'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import CustomTable from '../../../components/Table/CustomTable'
import Main from '../../../containers/Main/Main'
import ReservationCreate from './ReservationCreate'
import { formatDate } from '../../../utils/date'

const reservationCols = [
  {
    id: 'id',
    label: 'Mã',
    isSortable: true,
  },

  {
    id: 'customer_name',
    label: 'Khách hàng',
    isSortable: true,
  },

  {
    id: 'arrive_time',
    label: 'Thời gian đến',
    isSortable: true,
  },
  {
    id: 'status',
    label: 'Trạng thái đặt bàn',
    isSortable: true,
    type: 'chip',
    variantMapping: [
      {
        value: 'pending',
        variant: 'info',
      },
      {
        value: 'confirmed',
        variant: 'primary',
      },
      {
        value: 'serving',
        variant: 'success',
      },
    ],
  },
]

function ReservationList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [reservationList, setReservationList] = useState([])
  const [selected, setSelected] = useState(null)

  const handleDeleteReservation = async (id) => {
    if (id) {
      await deleteReservation(id)
      setDeleteDialogVisible(false)
    }
  }

  const actionButtons = [
    {
      name: 'Chi tiết',
      variant: 'contained',
      color: 'primary',
      clickHandler: (id) => {
        setSelected(id)
        setCreateModalVisible(true)
      },
    },
    {
      name: 'Xóa',
      variant: 'contained',
      color: 'secondary',
      clickHandler: (id) => {
        setSelected(id)
        setDeleteDialogVisible(true)
      },
    },
  ]

  const fetchReservationList = async () => {
    const res = await getReservations()
    setReservationList(
      res.data.map((reservation) => ({
        ...reservation,
        arrive_time: formatDate(new Date(reservation.arrive_time), 'DD/MM/YYYY hh:mm'),
        status:
          reservation.status === 'pending'
            ? {
                name: 'Chờ xác nhận',
                value: 'pending',
              }
            : reservation.status === 'confirmed'
            ? {
                name: 'Đã xác nhận (Chờ nhận bàn)',
                value: 'confirmed',
              }
            : {
                name: 'Đã nhận bàn',
                value: 'serving',
              },
      }))
    )
  }

  useEffect(() => {
    fetchReservationList()
  }, [])

  return (
    <Main>
      <div>
        <ConfirmDialog
          isModalVisible={isDeleteDialogVisible}
          title='Xóa đặt bàn'
          confirmTitle='Xóa'
          cancelTitle='Hủy bỏ'
          description='Bạn có chắc chắn muốn xóa đặt bàn này?'
          handleConfirm={() => handleDeleteReservation(selected)}
          handleCancel={() => setDeleteDialogVisible(false)}
        />
        <ReservationCreate
          reservationId={selected}
          isModalVisible={isCreateModalVisible}
          handleCloseModal={() => setCreateModalVisible(false)}
        />

        <div style={{ display: 'flex', marginBottom: '2rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flex: 1 }}>
            <TextField
              label='Khách hàng'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 20,
                },
              }}
              variant='standard'
              style={{ marginRight: 20 }}
            />
            <TextField
              label='Từ ngày'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 20,
                },
              }}
              type='date'
              style={{ marginRight: 20 }}
            />
            <TextField
              label='Đến ngày'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 20,
                },
              }}
              type='date'
              style={{ marginRight: 20 }}
            />
            <TextField
              label='Trạng thái nhận bàn'
              select
              SelectProps={{
                native: true,
                placeholder: 'Chọn trạng thái',
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 20,
                },
              }}
            >
              <option>Tất cả</option>
              <option value='pending'>Chờ xác nhận</option>
              <option value='confirmed'>Đã xác nhận (Chờ nhận bàn)</option>
              <option value='serving'>Đã nhận bàn</option>
            </TextField>
          </div>
          <Button variant='contained' color='primary' onClick={() => setCreateModalVisible(true)}>
            Thêm mới
          </Button>
        </div>
        <div>
          <CustomTable rows={reservationList} cols={reservationCols} actionButtons={actionButtons} />
        </div>
      </div>
    </Main>
  )
}

export default ReservationList


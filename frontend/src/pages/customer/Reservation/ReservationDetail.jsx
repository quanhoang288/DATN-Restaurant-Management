import React, { useState } from 'react'

import { Button, Card, CardContent, CardHeader, Paper, TextField, Typography } from '@material-ui/core'
import CustomerMain from '../../../containers/CustomerMain/CustomerMain'
import { Autocomplete } from '@material-ui/lab'
import { useCallback } from 'react'
import { createReservation, getReservation } from '../../../apis/reservation'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { borderRadius } from '@mui/system'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const defaultReservationData = {
  arriveTime: null,
  customerId: null,
  customerName: null,
  phoneNumber: null,
  numPeople: null,
  note: '',
  status: 'pending',
}

export default function ReservationDetail(props) {
  const [reservationData, setReservationData] = useState(defaultReservationData)

  const { id } = useParams()

  const history = useHistory()

  const fetchReservationData = async (id) => {
    if (id) {
      const reservation = (await getReservation(id)).data
      if (reservation) {
        setReservationData({
          arriveTime: reservation.arrive_time,
          customerId: reservation.customer_id,
          customerName: reservation.customer_name,
          phoneNumber: reservation.customer_phone_number,
          numPeople: reservation.num_people,
          note: reservation.note,
          status: reservation.status,
        })
      }
    }
  }

  useEffect(() => {
    if (id) {
      fetchReservationData(id)
    }
  }, [id])

  return (
    <CustomerMain>
      <div
        style={{ background: '#f5f5f5', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card style={{ minWidth: 600, border: '1px solid', borderRadius: 10 }}>
          <CardHeader title='Thông tin đặt chỗ' />
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex' }}>
                <Typography style={{ fontWeight: 500, marginRight: '1rem' }}>Tên khách hàng: </Typography>
                <Typography>{reservationData.customerName || 'Hoàng Huy Quân'}</Typography>
              </div>
              <div style={{ display: 'flex' }}>
                <Typography style={{ fontWeight: 500, marginRight: '1rem' }}>SĐT: </Typography>
                <Typography>{reservationData.phoneNumber}</Typography>
              </div>
              <div style={{ display: 'flex' }}>
                <Typography style={{ fontWeight: 500, marginRight: '1rem' }}>Thời gian đến: </Typography>
                <Typography>{reservationData.arriveTime}</Typography>
              </div>
              <div style={{ display: 'flex' }}>
                <Typography style={{ fontWeight: 500, marginRight: '1rem' }}>Số lượng người: </Typography>
                <Typography>{reservationData.numPeople}</Typography>
              </div>
              <div style={{ display: 'flex' }}>
                <Typography style={{ fontWeight: 500, marginRight: '1rem' }}>Ghi chú cho nhà hàng: </Typography>
                <Typography>{reservationData.note}</Typography>
              </div>
              <div style={{ display: 'flex' }}>
                <Typography style={{ fontWeight: 500, marginRight: '1rem' }}>Ghi chú cho nhà hàng: </Typography>
                <Typography>{reservationData.note}</Typography>
              </div>
              <div style={{ display: 'flex' }}>
                <Typography style={{ fontWeight: 500, marginRight: '1rem' }}>Trạng thái đặt chỗ: </Typography>
                <Typography>{reservationData.status}</Typography>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button variant='contained' onClick={() => history.push('/home')}>
                  Về trang chủ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerMain>
  )
}


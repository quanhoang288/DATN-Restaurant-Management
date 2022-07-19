import React, { useState } from 'react'

import { Button, Card, CardContent, CardHeader, Paper, TextField } from '@material-ui/core'
import CustomerMain from '../../../containers/CustomerMain/CustomerMain'
import { Autocomplete } from '@material-ui/lab'
import { useCallback } from 'react'
import { createReservation } from '../../../apis/reservation'
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

export default function Reservation(props) {
  const [reservationData, setReservationData] = useState(defaultReservationData)

  const history = useHistory()

  const handleSubmit = useCallback(async () => {
    const postData = {
      arrive_time: reservationData.arriveTime,
      customer_id: reservationData.customerId,
      customer_name: reservationData.customerName,
      customer_phone_number: reservationData.phoneNumber,
      num_people: reservationData.numPeople,
      note: reservationData.note,
      status: reservationData.status,
    }
    const reservation = (await createReservation(postData)).data
    if (reservation) {
      history.push(`/reservations/${reservation.id}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationData])

  return (
    <CustomerMain>
      <Card style={{ background: '#f5f5f5', padding: '2rem 3rem' }}>
        <CardHeader title='Đặt chỗ' />
        <CardContent>
          <div style={{ display: 'flex' }}>
            <TextField
              type='datetime-local'
              margin='normal'
              value={reservationData.arriveTime}
              onChange={(e) => setReservationData({ ...reservationData, arriveTime: e.target.value })}
              label='Thời gian'
              InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
              style={{ marginRight: 30 }}
              required
            />
            <TextField
              label='Số người'
              value={reservationData.numPeople}
              onChange={(e) => setReservationData({ ...reservationData, numPeople: e.target.value })}
              type='number'
              margin='normal'
              InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
              required
            />
          </div>
          <div style={{ display: 'flex', marginTop: 20, marginBottom: 20 }}>
            <TextField
              fullWidth
              label='Khách hàng'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 20,
                },
              }}
              required
              style={{ minWidth: 250 }}
              // margin='normal'
            />
            <TextField
              label='Số điện thoại'
              value={reservationData.phoneNumber}
              onChange={(e) => setReservationData({ ...reservationData, phoneNumber: e.target.value })}
              InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
              style={{ marginLeft: 50 }}
              required
            />
          </div>
          <TextField
            label='Ghi chú cho nhà hàng'
            value={reservationData.note}
            onChange={(e) => setReservationData({ ...reservationData, note: e.target.value })}
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            style={{ marginTop: 10 }}
          />
          <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'center' }}>
            <Button variant='contained' color='primary' onClick={handleSubmit}>
              Lưu
            </Button>
            <Button variant='contained' onClick={() => setReservationData(defaultReservationData)}>
              Tạo lại
            </Button>
          </div>
        </CardContent>
      </Card>
    </CustomerMain>
  )
}


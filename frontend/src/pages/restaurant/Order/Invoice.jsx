import React, { useEffect, useState } from 'react'

import { Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core'

import { forwardRef } from 'react'

const defaultPaymentData = {
  customerPaid: 0,
  otherFee: 0,
  isEnableInvoiceExport: false,
}

const Invoice = forwardRef((props, ref) => {
  const { order } = props
  const [paymentData, setPaymentData] = useState(defaultPaymentData)

  return (
    <div ref={ref} style={{ padding: '1rem' }}>
      <div className='invoice__header' style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography>Invoice header</Typography>
      </div>
      <div className='restaurant__info'>
        <Typography>Nha hang ABC</Typography>
        <Typography>D/C: ABC, DEF, XYZ</Typography>
        <Typography>Tel: 0382203949 - 0903940393</Typography>
      </div>
      <div className='invoice__content'>
        <div className='invoice__info'>
          <Typography>TN: Hoang Huy Quan</Typography>
          <Typography>Ban: A12</Typography>
          <Typography>Ngay: 27/06/2022</Typography>
        </div>
        <Divider />
        <div className='invoice__main'>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: 16 }}>Tên</TableCell>
                  <TableCell style={{ fontSize: 16 }}>Số lượng</TableCell>
                  <TableCell style={{ fontSize: 16 }}>Đơn giá</TableCell>
                  <TableCell style={{ fontSize: 16 }}>Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(order.details || []).map((item) => (
                  <TableRow>
                    <TableCell width={150} style={{ maxWidth: 300 }}>
                      {item.name}
                    </TableCell>
                    <TableCell width={80}>{item.quantity}</TableCell>
                    <TableCell width={80}>{item.price}</TableCell>
                    <TableCell width={80}>{item.quantity * item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <div>
            <div style={{ padding: '0 2rem', height: '100%' }}>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Typography style={{ minWidth: 300, fontWeight: 'bold' }}>Tổng tiền hàng</Typography>
                <Typography>{order.details.reduce((prevSum, item) => (prevSum += item.quantity * item.price), 0)}</Typography>
              </div>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Typography style={{ minWidth: 300, fontWeight: 'bold' }}>Giảm giá</Typography>
                <Typography>30000</Typography>
              </div>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Typography style={{ minWidth: 300, fontWeight: 'bold' }}>Thu khác</Typography>
                <Typography>30000</Typography>
              </div>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Typography style={{ minWidth: 300, fontWeight: 'bold' }}>Tổng số tiền</Typography>
                <Typography>371250</Typography>
              </div>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Typography style={{ minWidth: 300, fontWeight: 'bold' }}>Khách trả</Typography>
                <TextField
                  type='number'
                  placeholder={0}
                  value={paymentData.customerPaid}
                  onChange={(e) => setPaymentData({ ...paymentData, customerPaid: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Typography style={{ minWidth: 300, fontWeight: 'bold' }}>Tiền thừa trả khách</Typography>
                <Typography>0</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Invoice


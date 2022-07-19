import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core'
import ReactToPrint from 'react-to-print'

// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
import Modal from '../../../components/Modal/Modal'
// import Invoice from './Invoice'
import { createOrder, payOrder } from '../../../apis/order'
import { PDFViewer } from '@react-pdf/renderer'
import Invoice from '../Invoice/Invoice'

const defaultPaymentData = {
  discounts: [],
  invoice: {
    paid_amount: 0,
    other_fee: 0,
  },
  isEnableInvoiceExport: true,
}

function OrderInvoicePreview(props) {
  const { isModalVisible, handleCloseModal } = props
  return (
    <Modal title='Hóa đơn' isModalVisible={isModalVisible} handleClose={handleCloseModal}>
      <PDFViewer style={{ minHeight: 700, width: '100%' }}>
        <Invoice />
      </PDFViewer>
    </Modal>
  )
}

function OrderPayment(props) {
  const { order, isModalVisible, handleClose } = props

  const [amountToBePaid, setAmountToBePaid] = useState(0)
  const [paymentData, setPaymentData] = useState(defaultPaymentData)
  const [isInvoicePreviewVisible, setInvoicePreviewVisible] = useState(false)

  const handlePayOrder = useCallback(
    async (resolve, reject) => {
      if (order.id) {
        // pay existing order
        await payOrder(order.id, paymentData)
      } else {
        // create new order and perform payment
        const res = await createOrder(order)
        await payOrder(res.data, paymentData)
      }
      resolve()
    },
    [order, paymentData]
  )

  return (
    <>
      <OrderInvoicePreview isModalVisible={isInvoicePreviewVisible} handleCloseModal={() => setInvoicePreviewVisible(false)} />
      <Modal title='Thanh toán đơn hàng' isModalVisible={isModalVisible} handleClose={handleClose}>
        <div>
          <div>
            <div style={{ display: 'flex', marginBottom: 10 }}>
              <div style={{ display: 'flex', marginRight: '2.5rem' }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>Loại đơn hàng: </Typography>
                <Typography>Phục vụ tại bàn</Typography>
              </div>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>Bàn phục vụ: </Typography>
                <Typography>Bàn 1</Typography>
              </div>
            </div>

            <div style={{ display: 'flex', marginBottom: 10 }}>
              <div style={{ display: 'flex', marginRight: '2.5rem' }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>Nhân viên thu ngân: </Typography>
                <Typography>Hoàng Huy Quân</Typography>
              </div>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>Ngày tạo: </Typography>
                <Typography>23/6/2022 18:30:05</Typography>
              </div>
            </div>
          </div>

          <Grid container style={{ marginTop: '2rem' }}>
            <Grid item xs={6}>
              <TableContainer component={Paper}>
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

              <Card style={{ marginTop: '1rem' }}>
                <CardHeader
                  title='Chương trình khuyến mại'
                  titleTypographyProps={{
                    variant: 'h6',
                    style: {
                      fontSize: 16,
                    },
                  }}
                />
                <CardContent>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen
                    peas along with the mussels, if you like.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <div style={{ padding: '0 2rem', height: '100%' }}>
                <div style={{ display: 'flex', marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>Tổng tiền hàng</Typography>
                  <Typography>{order.details.reduce((prevSum, item) => (prevSum += item.quantity * item.price), 0)}</Typography>
                </div>
                <div style={{ display: 'flex', marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>Giảm giá</Typography>
                  <Typography>30000</Typography>
                </div>
                <div style={{ display: 'flex', marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>Thu khác</Typography>
                  <Typography>{paymentData.invoice.other_fee}</Typography>
                </div>
                <div style={{ display: 'flex', marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>Khách cần trả</Typography>
                  <Typography>{order.details.reduce((prevSum, item) => (prevSum += item.quantity * item.price), 0)}</Typography>
                </div>
                <div style={{ display: 'flex', marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>Khách trả</Typography>
                  <TextField
                    type='number'
                    placeholder={0}
                    value={paymentData.invoice.paid_amount}
                    onChange={(e) => setPaymentData({ ...paymentData, invoice: { ...paymentData.invoice, paid_amount: e.target.value } })}
                  />
                </div>
                <div style={{ display: 'flex', marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>Tiền thừa trả khách</Typography>
                  <Typography>0</Typography>
                </div>
                <FormControlLabel
                  control={
                    <Checkbox
                      name='checkedC'
                      value={paymentData.isEnableInvoiceExport}
                      onChange={(e, checked) => setPaymentData({ ...paymentData, isEnableInvoiceExport: checked })}
                    />
                  }
                  label='Xuất hóa đơn khi thanh toán'
                />
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{ display: 'flex', float: 'right', marginTop: 10 }}>
          <Button variant='contained' color='primary' onClick={handlePayOrder}>
            Thanh toán
          </Button>

          <Button variant='contained' onClick={() => setInvoicePreviewVisible(true)}>
            In hóa đơn
          </Button>

          <Button variant='contained' onClick={handleClose}>
            Hủy bỏ
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default OrderPayment


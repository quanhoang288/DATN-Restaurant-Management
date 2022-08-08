import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
} from "react";

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
} from "@material-ui/core";
import ReactToPrint from "react-to-print";

// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
import Modal from "../../../components/Modal/Modal";
// import Invoice from './Invoice'
import { createOrder, payOrder } from "../../../apis/order";
import { PDFViewer } from "@react-pdf/renderer";
import Invoice from "../Invoice/Invoice";
import ChipLabel from "../../../components/ChipLabel/ChipLabel";
import CustomAccordion from "../../../components/CustomAccordion/CustomAccordion";
import { createInvoice } from "../../../apis/invoice";
import { convertToOrderDTO } from "../../../utils/converter/convertToOrderDTO";
import { getDiscountAmount, getInvoiceTotal } from "../../../utils/order";
import { useSelector } from "react-redux";

const defaultPaymentData = {
  other_fee: 0,
  paid_amount: 0,
};

function OrderInvoicePreview(props) {
  const { order, cashier, isModalVisible, handleCloseModal } = props;
  return (
    <Modal
      title='Hóa đơn'
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
    >
      <PDFViewer style={{ minHeight: 700, width: "100%" }}>
        <Invoice cashier={cashier} order={order} />
      </PDFViewer>
    </Modal>
  );
}

function OrderDiscounts(props) {
  const { discounts } = props;
  return (
    <div>
      <div className='discount__invoice' style={{ marginBottom: "1rem" }}>
        <Typography style={{ fontWeight: 500 }}>
          Khuyến mãi trên hóa đơn
        </Typography>

        {(discounts || []).filter((discount) => discount.type === "invoice")
          .length > 0 && (
          <TableContainer>
            <TableHead>
              <TableRow>
                <TableCell>Tên chương trình</TableCell>
                <TableCell>Hình thức khuyến mãi</TableCell>
                <TableCell>Khuyến mãi</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(discounts || [])
                .filter((discount) => discount.type === "invoice")
                .map((discount) => (
                  <TableRow>
                    <TableCell>{discount.name}</TableCell>
                    <TableCell>{discount.method}</TableCell>
                    <TableCell>
                      {discount.method === "invoice-discount" ? (
                        `${discount.constraint.discount_amount}${
                          discount.constraint.discount_unit === "cash"
                            ? ""
                            : "%"
                        }`
                      ) : (
                        <div style={{ display: "flex" }}>
                          {(discount.discountItems || []).map((item) => (
                            <ChipLabel
                              key={item.id}
                              label={item.name}
                              variant='primary'
                            />
                          ))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </TableContainer>
        )}
      </div>
      <div className='discount__good'>
        <Typography style={{ fontWeight: 500 }}>
          Khuyến mãi trên hàng hóa
        </Typography>
      </div>
    </div>
  );
}

function OrderPayment(props) {
  const { order, isModalVisible, handleClose } = props;

  const [paymentData, setPaymentData] = useState(defaultPaymentData);
  const [isInvoicePreviewVisible, setInvoicePreviewVisible] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handlePayOrder = useCallback(async () => {
    if (order.id) {
      // pay existing order
      await createInvoice({
        order_id: order.id,
        ...paymentData,
      });
    } else {
      // create new order and perform payment
      const orderPayload = convertToOrderDTO(order);
      const newOrder = (await createOrder(orderPayload)).data;
      await createInvoice({
        order_id: newOrder.id,
        ...paymentData,
      });
    }
    handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, paymentData]);

  useEffect(() => {
    console.log("user: ", user);
  }, [user]);

  return (
    <>
      <OrderInvoicePreview
        order={order}
        cashier={user}
        isModalVisible={isInvoicePreviewVisible}
        handleCloseModal={() => setInvoicePreviewVisible(false)}
      />
      <Modal
        title='Thanh toán đơn hàng'
        isModalVisible={isModalVisible}
        handleClose={handleClose}
      >
        <div>
          <div>
            <div style={{ display: "flex", marginBottom: 10 }}>
              <div style={{ display: "flex", marginRight: "2.5rem" }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>
                  Loại đơn hàng:{" "}
                </Typography>
                <Typography>
                  {order.type === "dine-in"
                    ? "Phục vụ tại bàn"
                    : order.type === "take-away"
                    ? "Mang về"
                    : "Giao đi"}
                </Typography>
              </div>
              <div style={{ display: "flex", marginBottom: 10 }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>
                  Bàn phục vụ:{" "}
                </Typography>
                <Typography>Bàn 1</Typography>
              </div>
            </div>

            <div style={{ display: "flex", marginBottom: 10 }}>
              <div style={{ display: "flex", marginRight: "2.5rem" }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>
                  Nhân viên thu ngân:{" "}
                </Typography>
                <Typography>Hoàng Huy Quân</Typography>
              </div>
              <div style={{ display: "flex", marginBottom: 10 }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>
                  Ngày tạo:{" "}
                </Typography>
                <Typography>6/8/2022 18:30:05</Typography>
              </div>
            </div>
          </div>

          <Grid container style={{ marginTop: "2rem" }}>
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
                        <TableCell width={80}>
                          {item.quantity * item.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <CustomAccordion
                title='Chương trình khuyến mãi'
                style={{ marginTop: "1rem" }}
              >
                <OrderDiscounts discounts={order.discounts || []} />
              </CustomAccordion>
            </Grid>
            <Grid item xs={6}>
              <div style={{ padding: "0 2rem", height: "100%" }}>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Tổng tiền hàng
                  </Typography>
                  <Typography>{getInvoiceTotal(order)}</Typography>
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Giảm giá
                  </Typography>
                  <Typography>
                    {getDiscountAmount(getInvoiceTotal(order), order.discounts)}
                  </Typography>
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Thu khác
                  </Typography>
                  <Typography>0</Typography>
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Khách cần trả
                  </Typography>
                  <Typography>
                    {getInvoiceTotal(order) -
                      getDiscountAmount(
                        getInvoiceTotal(order),
                        order.discounts
                      )}
                  </Typography>
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Khách trả
                  </Typography>
                  <TextField
                    type='number'
                    placeholder={0}
                    value={paymentData.paid_amount}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paid_amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Tiền thừa trả khách
                  </Typography>
                  <Typography>
                    {paymentData.paid_amount -
                      (getInvoiceTotal(order) -
                        getDiscountAmount(
                          getInvoiceTotal(order),
                          order.discounts
                        ))}
                  </Typography>
                </div>
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      name='checkedC'
                      value={paymentData.isEnableInvoiceExport}
                      onChange={(e, checked) => setPaymentData({ ...paymentData, isEnableInvoiceExport: checked })}
                    />
                  }
                  label='Xuất hóa đơn khi thanh toán'
                /> */}
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{ display: "flex", float: "right", marginTop: 10 }}>
          <Button variant='contained' color='primary' onClick={handlePayOrder}>
            Thanh toán
          </Button>

          <Button
            variant='contained'
            onClick={() => setInvoicePreviewVisible(true)}
          >
            In hóa đơn
          </Button>

          <Button variant='contained' onClick={handleClose}>
            Hủy bỏ
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default OrderPayment;

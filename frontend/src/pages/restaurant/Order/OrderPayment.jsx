import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
} from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
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
import {
  createOrder,
  getOrders,
  payOrder,
  updateOrder,
} from "../../../apis/order";
import { PDFViewer } from "@react-pdf/renderer";
import Invoice from "../Invoice/Invoice";
import ChipLabel from "../../../components/ChipLabel/ChipLabel";
import CustomAccordion from "../../../components/CustomAccordion/CustomAccordion";
import { createInvoice, getInvoice } from "../../../apis/invoice";
import { convertToOrderDTO } from "../../../utils/converter/convertToOrderDTO";
import { getDiscountAmount, getInvoiceTotal } from "../../../utils/order";
import { useSelector } from "react-redux";
import { formatDate } from "../../../utils/date";
import Toast from "../../../components/Toast/Toast";
import { getTables } from "../../../apis/table";

const defaultPaymentData = {
  other_fee: 0,
  paid_amount: 0,
  discount: 0,
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

function TableMergeOptions(props) {
  const {
    curTableId,
    isModalVisible,
    handleCloseModal,
    branchId,
    handleMergeTables,
  } = props;

  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [tableOptions, setTableOptions] = useState([]);
  const numFloors = 4;

  const fetchTableOptions = async (floorNum) => {
    const res = await getTables({
      filters: JSON.stringify({
        branch_id: branchId,
        floor_num: floorNum,
        id: { ne: curTableId },
      }),
    });
    setTableOptions(
      res.data.filter((table) =>
        (table.reservations || []).some((res) => res.status === "serving")
      )
    );
  };

  const handleToggleTable = (newTable) => {
    console.log("toggle table: ", newTable);
    if ((newTable.reservations || []).some((res) => res.status === "serving")) {
      console.log("toggling");
      console.log(selectedTables.find((table) => table.id === newTable.id));
      setSelectedTables(
        selectedTables.find((table) => table.id === newTable.id) === undefined
          ? [...selectedTables, { id: newTable.id, name: newTable.name }]
          : selectedTables.filter((table) => table.id !== newTable.id)
      );
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchTableOptions(selectedFloor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible, selectedFloor]);

  return (
    <Modal
      title='Ghép bàn'
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
    >
      <div
        className='search__container'
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {selectedTables.length > 0 && (
          <Typography>{`Bàn đang chọn: ${selectedTables
            .map((table) => table.name)
            .join(", ")}`}</Typography>
        )}
      </div>

      <div style={{ display: "flex", marginBottom: 20 }}>
        <List
          component='nav'
          style={{
            minWidth: 150,
            borderRight: "1px solid",
            textAlign: "center",
          }}
        >
          {[...Array(numFloors).keys()].map((floorIdx) => (
            <ListItem button selected={selectedFloor === floorIdx + 1}>
              <ListItemText
                primary={`Tầng ${floorIdx + 1}`}
                onClick={() => setSelectedFloor(floorIdx + 1)}
              />
            </ListItem>
          ))}
        </List>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            rowGap: 20,
            alignItems: "center",
            flex: 1,
            marginLeft: 10,
          }}
          className='table__list'
        >
          {tableOptions.map((opt) =>
            selectedTables.some((table) => table.id === opt.id) ? (
              <Badge
                color='primary'
                badgeContent={
                  selectedTables.findIndex((table) => table.id === opt.id) + 1
                }
              >
                <div
                  className={"table__item table__item__used"}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleToggleTable(opt)}
                >
                  <Typography>{opt.name}</Typography>
                </div>
              </Badge>
            ) : (
              <div
                className={"table__item table__item__used"}
                style={{ cursor: "pointer" }}
                onClick={() => handleToggleTable(opt)}
              >
                <Typography>{opt.name}</Typography>
              </div>
            )
          )}
        </div>
      </div>
      <div style={{ display: "flex", float: "right", marginTop: 10 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            handleCloseModal();
            handleMergeTables(selectedTables);
          }}
          style={{ marginRight: "0.5rem" }}
        >
          Lưu
        </Button>
      </div>
    </Modal>
  );
}

function OrderPayment(props) {
  const { order, isModalVisible, handleClose } = props;
  const [successMessage, setSuccessMessage] = useState(null);
  const [paymentData, setPaymentData] = useState(defaultPaymentData);
  const [isInvoicePreviewVisible, setInvoicePreviewVisible] = useState(false);
  const [isTableModalVisible, setTableModalVisible] = useState(false);

  const [orderData, setOrderData] = useState({});

  const user = useSelector((state) => state.auth.user);

  const handleMergeTables = useCallback(
    async (tables = []) => {
      const orders = (
        await getOrders({
          filters: JSON.stringify({
            type: "dine-in",
            status: "accepted",
            payment_status: {
              ne: "paid",
            },
          }),
        })
      ).data;
      if (!orders) {
        return;
      }
      const ordersToMerge = orders.filter((order) =>
        tables
          .map((table) => table.id)
          .includes(order.reservationTable.table.id)
      );
      console.log("orders to merge: ", ordersToMerge);
      const orderDetails = ordersToMerge.reduce(
        (details, order) => [
          ...details,
          ...(order.goods || []).map((item) => ({
            id: item.id,
            sale_price: item.sale_price,
            name: item.name,
            quantity: item.OrderDetail?.quantity,
          })),
        ],
        []
      );
      setOrderData({
        ...orderData,
        tableName: [
          orderData.tableName,
          ...tables.map((table) => table.name),
        ].join(", "),
        mergedOrders: ordersToMerge.map((order) => order.id),
        details: [...orderData.details, ...orderDetails].reduce(
          (details, curItem) => {
            const itemIdx = details.findIndex((item) => item.id === curItem.id);
            if (itemIdx === -1) {
              return [...details, curItem];
            }
            details[itemIdx] = {
              ...details[itemIdx],
              quantity: details[itemIdx].quantity + curItem.quantity,
            };
            return details;
          },
          []
        ),
      });
    },
    [orderData]
  );

  const handlePayOrder = useCallback(async () => {
    const invoiceData = {
      ...paymentData,
      mergedOrders: orderData.mergedOrders || [],
    };

    let orderId;
    if (order.id) {
      await updateOrder(
        order.id,
        convertToOrderDTO({
          ...orderData,
          payment_status: "paid",
          status: orderData.type === "dine-in" ? "done" : "accepted",
        })
      );
      orderId = order.id;
    } else {
      const orderCreateRes = await createOrder(
        convertToOrderDTO({ ...orderData, payment_status: "paid" })
      );
      if (!orderCreateRes) {
        return;
      }
      orderId = orderCreateRes.data.id;
    }

    const invoiceCreateRes = await createInvoice({
      ...invoiceData,
      order_id: orderId,
    });
    if (!invoiceCreateRes) {
      return;
    }

    setSuccessMessage(
      orderData.id
        ? "Thanh toán đơn thành công"
        : "Thêm và thanh toán đơn thành công"
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData, paymentData]);

  useEffect(() => {
    if (successMessage) {
      // handleClose(true);
      setInvoicePreviewVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage]);

  useEffect(() => {
    const fetchInvoice = async (invoiceId) => {
      const invoice = (await getInvoice(invoiceId)).data;
      setPaymentData(invoice);
    };
    if (orderData.payment_status === "paid" && orderData.invoice?.id) {
      fetchInvoice(orderData.invoice.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData]);

  useEffect(() => {
    console.log(orderData);
  }, [orderData]);

  useEffect(() => {
    if (isInvoicePreviewVisible && successMessage) {
      handleClose(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInvoicePreviewVisible, successMessage]);

  useEffect(() => {
    setOrderData(order);
  }, [order]);

  return (
    <>
      {successMessage && (
        <Toast
          message={successMessage}
          variant='success'
          handleClose={() => setSuccessMessage(null)}
        />
      )}

      <TableMergeOptions
        isModalVisible={isTableModalVisible}
        handleCloseModal={() => setTableModalVisible(false)}
        branchId={orderData.reservationTable?.table?.branch_id}
        handleMergeTables={handleMergeTables}
        curTableId={orderData.reservationTable?.table.id}
      />

      <OrderInvoicePreview
        order={orderData}
        cashier={user}
        isModalVisible={isInvoicePreviewVisible}
        handleCloseModal={() => setInvoicePreviewVisible(false)}
      />
      <Modal
        title='Thanh toán đơn hàng'
        isModalVisible={isModalVisible}
        handleClose={() => handleClose()}
      >
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "2rem" }}>
              <div style={{ display: "flex", marginBottom: 10 }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>
                  Loại đơn hàng:{" "}
                </Typography>
                <Typography>
                  {orderData.type === "dine-in"
                    ? "Phục vụ tại bàn"
                    : orderData.type === "takeaway"
                    ? "Mang về"
                    : "Giao đi"}
                </Typography>
              </div>

              <div style={{ display: "flex" }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>
                  Nhân viên thu ngân:{" "}
                </Typography>
                <Typography>{user?.full_name}</Typography>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", marginBottom: 10 }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>
                  Bàn phục vụ:{" "}
                </Typography>
                <Typography>{orderData.tableName}</Typography>
              </div>

              <div style={{ display: "flex", marginBottom: 10 }}>
                <Typography style={{ minWidth: 200, fontWeight: 500 }}>
                  Ngày tạo:{" "}
                </Typography>
                <Typography>
                  {formatDate(
                    orderData.created_at || new Date(),
                    "DD/MM/YYYY hh:mm"
                  )}
                </Typography>
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
                    {(orderData.details || []).map((item) => (
                      <TableRow>
                        <TableCell width={150} style={{ maxWidth: 300 }}>
                          {item.name}
                        </TableCell>
                        <TableCell width={80}>{item.quantity}</TableCell>
                        <TableCell width={80}>{item.sale_price}</TableCell>
                        <TableCell width={80}>
                          {item.quantity * item.sale_price}
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
                <OrderDiscounts discounts={orderData.discounts || []} />
              </CustomAccordion>
            </Grid>
            <Grid item xs={6}>
              <div style={{ padding: "0 2rem", height: "100%" }}>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Tổng tiền hàng
                  </Typography>
                  <Typography>{getInvoiceTotal(orderData)}</Typography>
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Giảm giá
                  </Typography>
                  <Typography>
                    {getDiscountAmount(
                      getInvoiceTotal(orderData),
                      orderData.discounts
                    )}
                  </Typography>
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Thu khác
                  </Typography>
                  <Typography>{paymentData.other_fee || 0}</Typography>
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Khách cần trả
                  </Typography>
                  <Typography>
                    {getInvoiceTotal(orderData) -
                      getDiscountAmount(
                        getInvoiceTotal(orderData),
                        orderData.discounts
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
                    disabled={order.payment_status === "paid"}
                  />
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <Typography style={{ minWidth: 300, fontWeight: 500 }}>
                    Tiền thừa trả khách
                  </Typography>
                  <Typography>
                    {paymentData.paid_amount -
                      (getInvoiceTotal(orderData) -
                        getDiscountAmount(
                          getInvoiceTotal(orderData),
                          orderData.discounts
                        ))}
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
          <div style={{ display: "flex", float: "right", marginTop: 10 }}>
            {order.payment_status !== "paid" && (
              <>
                {order.type === "dine-in" && (
                  <Button
                    variant='contained'
                    onClick={() => setTableModalVisible(true)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Gộp hóa đơn
                  </Button>
                )}

                <Button
                  variant='contained'
                  color='primary'
                  onClick={handlePayOrder}
                  style={{ marginRight: "0.5rem" }}
                >
                  Thanh toán
                </Button>
              </>
            )}

            <Button
              variant='contained'
              onClick={() => setInvoicePreviewVisible(true)}
            >
              In hóa đơn
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default OrderPayment;

import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  withStyles,
  Tooltip,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import AlarmOnIcon from "@material-ui/icons/AlarmOn";

import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import TabPanel from "../../../components/CustomTabs/TabPanel";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import Main from "../../../containers/Main/Main";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import {
  getOrder,
  getOrders,
  updateOrder,
  updateOrderItem,
} from "../../../apis/order";
import "./KitchenDisplay.css";
import Modal from "../../../components/Modal/Modal";
import { formatDate } from "../../../utils/date";

const GreenTextTypography = withStyles({
  root: {
    color: "#2e9a13",
  },
})(Typography);

function OrderItem(props) {
  const { order, handleViewDetail } = props;
  console.log(order);
  return (
    <Card
      className='order__item__card'
      style={{ height: "100%", marginBottom: "1.5rem" }}
      onClick={handleViewDetail}
    >
      <CardHeader
        className='order__item__card__header'
        title={`#${order.id} - ${
          order.type === "dine-in"
            ? order.reservationTable?.table?.name
            : order.type === "takeaway"
            ? "Đơn mang về"
            : "Đơn giao đi"
        }`}
        titleTypographyProps={{
          variant: "h6",
          // component: "a",
        }}
        subheader={formatDate(new Date(order.created_at), "hh:mm")}
        action={
          <IconButton aria-label='settings'>
            <MoreVertIcon />
          </IconButton>
        }
      />
    </Card>
  );
}

function FinishQuantityModal(props) {
  const {
    isModalVisible,
    handleCloseModal,
    finishedQuantity,
    handleChangeFinishedQuantity,
    handleFinishOrderItem,
  } = props;
  return (
    <Modal
      title='Hoàn thành món'
      isModalVisible={isModalVisible}
      handleCloseModal={handleCloseModal}
    >
      <TextField
        fullWidth
        placeholder='Nhập số lượng hoàn thành'
        type='number'
        value={finishedQuantity}
        onChange={(e) => handleChangeFinishedQuantity(e.target.value)}
      />
      <div style={{ display: "flex", float: "right", marginTop: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleFinishOrderItem}
        >
          Lưu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Hủy bỏ
        </Button>
      </div>
    </Modal>
  );
}

function OrderDetail(props) {
  const { orderId, handleCloseDetailView, handleUpdateOrderStatus } = props;
  const [orderDetail, setOrderDetail] = useState({});
  const [isNotiDialogVisible, setNotiDialogVisible] = useState(false);
  const [orderItemIdToReject, setOrderItemIdToReject] = useState(null);
  const [isFinishQuantityModalVisible, setFinishQuantityModalVisible] =
    useState(false);
  const [finishedQuantity, setFinishedQuantity] = useState(0);
  const [orderItemIdToFinish, setOrderItemIdToFinish] = useState(null);

  const fetchOrderDetail = async (id) => {
    const res = await getOrder(id);
    setOrderDetail(res.data);
  };

  const updateStatus = (orderId, curStatus) => {
    const newStatus =
      curStatus === "pending"
        ? "in_progress"
        : curStatus === "in_progress"
        ? "done"
        : "pending";
    handleUpdateOrderStatus(orderId, newStatus);
  };

  const handleUpdateOrderItemStatus = useCallback(
    async (itemId, newStatus, finishedQuantity = null) => {
      const updateData = { status: newStatus };
      if (finishedQuantity) {
        updateData.finished_quantity = finishedQuantity;
      }

      await updateOrderItem(orderId, itemId, updateData);
      setOrderDetail({
        ...orderDetail,
        goods: (orderDetail.goods || []).map((item) =>
          item.id === itemId
            ? { ...item, OrderDetail: { ...item.OrderDetail, ...updateData } }
            : item
        ),
      });
    },
    [orderId, orderDetail]
  );

  const handleRejectOrderItem = useCallback(
    async (itemId, rejectForAllOrders = false) => {
      await updateOrderItem(!rejectForAllOrders ? orderId : null, itemId, {
        status: "rejected",
      });
      setOrderDetail({
        ...orderDetail,
        goods: (orderDetail.goods || []).map((item) =>
          item.id === itemId
            ? {
                ...item,
                OrderDetail: { ...item.OrderDetail, status: "rejected" },
              }
            : item
        ),
      });
      setNotiDialogVisible(false);
    },
    [orderId, orderDetail]
  );

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId]);

  return (
    <>
      <ConfirmDialog
        title='Báo hết món'
        description='Báo hết món này trên toàn bộ đơn hàng?'
        confirmTitle='Báo hết trên toàn bộ đơn'
        cancelTitle='Chỉ báo hết trên đơn này'
        isModalVisible={isNotiDialogVisible}
        handleConfirm={() => handleRejectOrderItem(orderItemIdToReject, true)}
        handleCancel={() => handleRejectOrderItem(orderItemIdToReject)}
        handleCloseDialog={() => setNotiDialogVisible(false)}
      />
      <FinishQuantityModal
        isModalVisible={isFinishQuantityModalVisible}
        handleCloseModal={() => setFinishQuantityModalVisible(false)}
        finishedQuantity={finishedQuantity}
        handleChangeFinishedQuantity={(newQuantity) =>
          setFinishedQuantity(newQuantity)
        }
        handleFinishOrderItem={() =>
          updateOrderItem(orderId, orderItemIdToFinish, {
            status: "ready_to_serve",
            finished_quantity: finishedQuantity,
          })
        }
      />
      <Card style={{ height: "100%", marginBottom: "1.5rem" }}>
        <CardHeader
          title={`#${orderDetail.id} - ${
            orderDetail.type === "dine-in"
              ? orderDetail.reservationTable?.table?.name
              : orderDetail.type === "takeaway"
              ? "Đơn mang về"
              : "Đơn giao đi"
          }`}
          titleTypographyProps={{
            variant: "h6",
            // component: "a",
          }}
          subheader={formatDate(new Date(orderDetail.created_at), "hh:mm")}
          action={
            <IconButton aria-label='close' onClick={handleCloseDetailView}>
              <ClearIcon />
            </IconButton>
          }
        />
        <CardContent
          style={{
            display: "flex",
            height: "80%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <List
              component='div'
              style={{ marginBottom: 20, maxHeight: 400, overflowY: "auto" }}
            >
              {(orderDetail.goods || []).map((item) => (
                <ListItem>
                  {["ready_to_serve", "done"].includes(
                    item.OrderDetail.status
                  ) && (
                    <div style={{ marginRight: "1rem" }}>
                      <CheckIcon className='order__detail__item__check' />
                    </div>
                  )}
                  <ListItemText
                    primary={item.name}
                    className={
                      item.OrderDetail.status === "rejected"
                        ? "line__through"
                        : ""
                    }
                    secondary={item.OrderDetail.quantity}
                  />
                  {!["ready_to_serve", "done"].includes(
                    item.OrderDetail.status
                  ) && (
                    <ListItemSecondaryAction>
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        {item.OrderDetail.status === "pending" && (
                          <>
                            {orderDetail.prepare_status === "in_progress" && (
                              <Tooltip title='Bắt đầu chế biến'>
                                <IconButton
                                  onClick={() =>
                                    handleUpdateOrderItemStatus(
                                      item.id,
                                      "in_progress"
                                    )
                                  }
                                >
                                  <AlarmOnIcon />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip title='Báo hết'>
                              <IconButton
                                color='secondary'
                                onClick={() => {
                                  setOrderItemIdToReject(item.id);
                                  setNotiDialogVisible(true);
                                }}
                              >
                                <ClearIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}

                        {item.OrderDetail.status === "in_progress" && (
                          <Tooltip title='Hoàn thành'>
                            <IconButton
                              color='primary'
                              onClick={() => {
                                setFinishedQuantity(item.OrderDetail.quantity);
                                setOrderItemIdToFinish(item.id);
                                setFinishQuantityModalVisible(true);
                              }}
                            >
                              <CheckIcon className='order__detail__item__check' />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
            <TextField
              value={orderDetail.note ?? ""}
              variant='outlined'
              fullWidth
              disabled
              multiline
              rows={4}
              label='Ghi chú'
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "3rem",
            }}
          >
            <Button color='secondary'>Ngừng nhận đơn</Button>
            <Button
              color='primary'
              onClick={() => updateStatus(orderId, orderDetail.prepare_status)}
            >
              {orderDetail.prepare_status === "pending"
                ? "Chế biến"
                : orderDetail.prepare_status === "in_progress"
                ? "Hoàn thành"
                : "Tiếp tục"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function OrderGroup(props) {
  const { title, type, orders, handleViewDetail } = props;
  return (
    <Card style={{ height: "100%" }}>
      <CardHeader
        title={
          type === "todo" ? (
            <Typography variant='h6'>{title}</Typography>
          ) : type === "in-progress" ? (
            <Typography variant='h6' color='primary'>
              {title}
            </Typography>
          ) : (
            <GreenTextTypography variant='h6'>{title}</GreenTextTypography>
          )
        }
      />

      <CardContent>
        <CardContent>
          {(orders || []).map((order) => (
            <OrderItem
              order={order}
              handleViewDetail={() => handleViewDetail(order.id)}
            />
          ))}
        </CardContent>
      </CardContent>
    </Card>
  );
}

function KitchenDisplay(props) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrders(res.data);
  };

  const handleUpdateOrderStatus = useCallback(
    async (orderId, newStatus) => {
      await updateOrder(orderId, { prepare_status: newStatus });
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, prepare_status: newStatus } : order
        )
      );
    },
    [orders]
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log("selected order: ", selectedOrder);
  }, [selectedOrder]);

  useEffect(() => {
    console.log("orders: ", orders);
  }, [orders]);

  return (
    <Main>
      <CustomTabs
        labels={["Theo bàn", "Theo món"]}
        activeTab={activeTab}
        onChangeActiveTab={(val) => setActiveTab(val)}
      >
        <TabPanel value={activeTab} index={0}>
          {selectedOrder ? (
            <Grid container spacing={2} style={{ height: "80vh" }}>
              <Grid item style={{ background: "#f5f5f5" }} xs={4}>
                <OrderGroup
                  title='Chờ chế biến'
                  type='todo'
                  orders={orders.filter(
                    (order) => order.prepare_status === "pending"
                  )}
                  handleViewDetail={(orderId) => setSelectedOrder(orderId)}
                />{" "}
              </Grid>
              <Grid item style={{ background: "#f5f5f5" }} xs={4}>
                <OrderGroup
                  title='Đang chế biến'
                  type='in-progress'
                  orders={orders.filter(
                    (order) => order.prepare_status === "in_progress"
                  )}
                  handleViewDetail={(orderId) => setSelectedOrder(orderId)}
                />{" "}
              </Grid>

              <Grid item style={{ background: "#f5f5f5" }} xs={4}>
                <OrderDetail
                  orderId={selectedOrder}
                  handleCloseDetailView={() => setSelectedOrder(null)}
                  handleUpdateOrderStatus={handleUpdateOrderStatus}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2} style={{ height: "80vh" }}>
              <Grid item style={{ background: "#f5f5f5" }} xs={6}>
                <OrderGroup
                  title='Chờ chế biến'
                  type='todo'
                  orders={orders.filter(
                    (order) => order.prepare_status === "pending"
                  )}
                  handleViewDetail={(orderId) => setSelectedOrder(orderId)}
                />
              </Grid>
              <Grid item style={{ background: "#f5f5f5" }} xs={6}>
                <OrderGroup
                  title='Đang chế biến'
                  type='in-progress'
                  orders={orders.filter(
                    (order) => order.prepare_status === "in_progress"
                  )}
                  handleViewDetail={(orderId) => setSelectedOrder(orderId)}
                />
              </Grid>
            </Grid>
          )}
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <List style={{ flex: 1 }}>
            <ListItem style={{ justifyContent: "space-between" }}>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  minWidth: 500,
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{ marginRight: 100, fontWeight: "bold", fontSize: 18 }}
                >
                  Bo xao xa ot
                </Typography>
                <Typography style={{ fontSize: 18 }}>1</Typography>
              </div>
              <div style={{ display: "flex" }}>
                <Button variant='contained'>Bao het mon</Button>
                <Button variant='contained' color='primary'>
                  Doi ung
                </Button>
              </div>
            </ListItem>
            <ListItem style={{ justifyContent: "space-between" }}>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  minWidth: 500,
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{ marginRight: 100, fontWeight: "bold", fontSize: 18 }}
                >
                  Bo xao xa ot
                </Typography>
                <Typography style={{ fontSize: 18 }}>1</Typography>
              </div>
              <div style={{ display: "flex" }}>
                <Button variant='contained'>Bao het mon</Button>
                <Button variant='contained' color='primary'>
                  Doi ung
                </Button>
              </div>
            </ListItem>
          </List>

          <div></div>
        </TabPanel>
      </CustomTabs>
    </Main>
  );
}

export default KitchenDisplay;

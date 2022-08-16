import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CustomerMain from "../../../containers/CustomerMain/CustomerMain";
import {
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  Paper,
  Typography,
} from "@material-ui/core";
import ChipLabel from "../../../components/ChipLabel/ChipLabel";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { getOrder } from "../../../apis/order";
import { ASSET_BASE_URL } from "../../../configs";
import noImageAvailable from "../../../assets/no-image-available.jpg";

const OrderSummary = (props) => {
  const [orderData, setOrderData] = useState({});

  const { id } = useParams();
  const history = useHistory();

  const fetchOrderData = async (id) => {
    const order = await getOrder(id);
    if (order?.data) {
      setOrderData(order.data);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderData(id);
    }
  }, [id]);

  return (
    <CustomerMain>
      <Paper style={{ padding: "3rem 5rem" }}>
        <Grid container>
          <Grid item xs={3}>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              Địa chỉ nhận hàng
            </Typography>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              Địa chỉ giao hàng
            </Typography>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              Trạng thái
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              {orderData.branch?.address}
            </Typography>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              {orderData.deliveryInfo
                ? orderData.deliveryInfo.delivery_address
                : orderData.delivery_address}
            </Typography>
            <ChipLabel
              label={
                orderData.status === "pending"
                  ? "Chờ xử lý"
                  : orderData.status === "accepted"
                  ? orderData.delivery_status === "delivering"
                    ? "Đang giao"
                    : "Đang chế biến"
                  : orderData.status === "rejected"
                  ? "Đã bị hủy"
                  : orderData.status === "canceled"
                  ? "Đã hủy"
                  : "Hoàn tất"
              }
              variant={
                orderData.status === "pending"
                  ? "info"
                  : orderData.status === "accepted"
                  ? orderData.delivery_status === "delivering"
                    ? "primary"
                    : "warning"
                  : orderData.status === "rejected"
                  ? "failure"
                  : orderData.status === "canceled"
                  ? "failure"
                  : "success"
              }
            />
          </Grid>
        </Grid>

        <List style={{ minWidth: 400 }}>
          {(orderData.goods || []).map((item) => (
            <>
              <ListItem alignItems='center'>
                <Typography style={{ marginRight: "1rem" }}>
                  x{item.OrderDetail?.quantity || 0}
                </Typography>

                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      alignItems: "center",
                      marginRight: "1rem",
                    }}
                  >
                    <img
                      src={
                        item.image
                          ? `${ASSET_BASE_URL}/images/${item.image}`
                          : noImageAvailable
                      }
                      alt='Cart item'
                      width={60}
                      height={60}
                      style={{ marginRight: 10 }}
                    />
                    <Typography style={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                  </div>
                  <Typography>
                    {(item.delivery_sale_price || item.sale_price) *
                      item.OrderDetail?.quantity || 0}
                  </Typography>
                </div>
              </ListItem>
              <Divider />
            </>
          ))}
        </List>

        <Grid
          containter
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Grid item xs={2}>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              Tạm tính
            </Typography>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              Khuyến mại
            </Typography>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              Phí áp dụng
            </Typography>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              Tổng tiền
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: "right" }}>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              {(orderData.goods || []).reduce(
                (prevTotal, item) =>
                  prevTotal + item.sale_price * item.OrderDetail.quantity,
                0
              )}
            </Typography>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              0
            </Typography>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              30000
            </Typography>
            <Typography style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
              {(orderData.goods || []).reduce(
                (prevTotal, item) =>
                  prevTotal + item.sale_price * item.OrderDetail.quantity,
                0
              ) + 30000}
            </Typography>
          </Grid>
        </Grid>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          {orderData.status === "pending" && (
            <Button variant='contained' color='secondary'>
              Hủy đơn
            </Button>
          )}

          <Button variant='contained' onClick={() => history.push("/")}>
            Về trang chủ
          </Button>
        </div>
      </Paper>
    </CustomerMain>
  );
};

OrderSummary.propTypes = {};

export default OrderSummary;

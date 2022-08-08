import React, { useCallback, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormGroup,
  FormLabel,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import CustomerMain from "../../../containers/CustomerMain/CustomerMain";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";

const defaultOrderData = {
  orderItems: [],
  customerId: null,
  customerPhoneNumber: null,
  customerAddress: null,
  note: "",
  discounts: [],
};

export default function Checkout(props) {
  const [orderData, setOrderData] = useState(defaultOrderData);

  const location = useLocation();

  const handleUpdateItemQuantity = useCallback(
    (itemId, quantity) => {
      setOrderData({
        ...orderData,
        orderItems:
          quantity === 0
            ? orderData.orderItems.filter((i) => i.id !== itemId)
            : orderData.orderItems.map((i) =>
                i.id === itemId ? { ...i, quantity } : i
              ),
      });
    },
    [orderData]
  );

  const handleCreateOrder = useCallback(() => {
    //TODO: api call
    console.log("order data: ", orderData);
  }, [orderData]);

  useEffect(() => {
    if (location.state?.orderItems) {
      setOrderData({ ...orderData, orderItems: location.state.orderItems });
    }
  }, [location, orderData]);

  return (
    <>
      <CustomerMain includeFooter={false}>
        <div style={{ padding: "1rem 30rem", background: "#f5f5f5" }}>
          <Card style={{ marginBottom: "2rem", marginTop: "1rem" }}>
            <CardHeader title='Giao đến' />
            <CardContent>
              <FormGroup style={{ marginBottom: "2rem" }}>
                <FormLabel>Địa chỉ</FormLabel>
                <TextField
                  fullWidth
                  variant='outlined'
                  style={{ marginTop: 10 }}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Ghi chú cho tài xế</FormLabel>
                <TextField
                  fullWidth
                  variant='outlined'
                  style={{ marginTop: 10 }}
                />
              </FormGroup>
            </CardContent>
          </Card>
          <Card style={{ marginBottom: "2rem" }}>
            <CardHeader title='Thông tin đơn hàng' />
            <CardContent>
              <List style={{ minWidth: 400 }}>
                {orderData.orderItems.map((item) => (
                  <>
                    <ListItem alignItems='center'>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        <IconButton
                          size='medium'
                          onChange={() =>
                            handleUpdateItemQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography style={{ margin: "0 4px" }}>
                          {item.quantity}
                        </Typography>
                        <IconButton size='medium'>
                          <AddIcon />
                        </IconButton>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flex: 1,
                            alignItems: "center",
                          }}
                        >
                          <img
                            src='https://d1sag4ddilekf6.azureedge.net/compressed/items/VNITE20220620072008363273/photo/menueditor_item_c1cc9114f56b46308d9d553166e4b3bc_1655892956270133788.jpg'
                            alt='Cart item'
                            width={60}
                            height={60}
                            style={{ marginRight: 10 }}
                          />
                          <Typography style={{ fontWeight: 500 }}>
                            {item.name}
                          </Typography>
                        </div>
                        <div>
                          <Typography>{item.sale_price}</Typography>
                        </div>
                      </div>
                    </ListItem>
                    <Divider />
                  </>
                ))}
              </List>
              <div style={{ padding: "1rem 1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Typography>Tổng tạm tính</Typography>
                  <Typography style={{ fontWeight: 500 }}>
                    {orderData.orderItems.reduce(
                      (prevTotal, item) =>
                        prevTotal + item.sale_price * item.quantity,
                      0
                    )}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Phí áp dụng</Typography>
                  <Typography style={{ fontWeight: 500 }}>30000</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card style={{ marginBottom: "2rem" }}>
            <CardHeader title='Khuyến mại' />
            <CardContent>
              <div style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  placeholder='Nhập mã khuyến mãi'
                  variant='outlined'
                />
                <Button
                  variant='contained'
                  style={{
                    background: "green",
                    color: "white",
                    minWidth: 100,
                    marginLeft: "2rem",
                  }}
                >
                  Áp dụng
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title='Chi tiết thanh toán' />
            <CardContent>
              <FormGroup>
                <FormLabel>Phương thức thanh toán</FormLabel>
                <TextField
                  value='cash'
                  fullWidth
                  select
                  variant='outlined'
                  style={{ marginTop: 10 }}
                >
                  <option value='cash'>Tiền mặt</option>
                </TextField>
              </FormGroup>
            </CardContent>
          </Card>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            bottom: 0,
            background: "white",
            height: 100,
            padding: "0 40rem",
          }}
        >
          <div>
            <Typography style={{ fontSize: 20 }}>Tổng cộng</Typography>
            <Typography style={{ fontSize: 20, fontWeight: 500 }}>
              170.000
            </Typography>
          </div>

          <Button
            variant='contained'
            onClick={handleCreateOrder}
            style={{
              background: "green",
              color: "white",
              minWidth: 200,
              minHeight: 50,
              marginLeft: "2rem",
            }}
          >
            Đặt đơn
          </Button>
        </div>
      </CustomerMain>
    </>
  );
}

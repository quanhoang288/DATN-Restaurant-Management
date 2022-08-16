import React, { useCallback, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
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
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetCart, updateCart } from "../../../redux/actions/cartActions";
import {
  createDeliveryInfo,
  getDeliveryInfos,
} from "../../../apis/delivery-info";
import Modal from "../../../components/Modal/Modal";
import { createOrder } from "../../../apis/order";
import { createNotification } from "../../../apis/notification";
import { useWebsocket } from "../../../utils/websocket.context";
import { ASSET_BASE_URL } from "../../../configs";
import noImageAvailable from "../../../assets/no-image-available.jpg";
import { getBranches } from "../../../apis/branch";

const defaultOrderData = {
  customer_id: null,
  delivery_info_id: null,
  note: "",
  discounts: [],
  branch_id: null,
};

function DeliveryInfoCreate(props) {
  const { userId, deliveryInfoId, isModalVisible, handleCloseModal } = props;
  const [deliveryInfoData, setDeliveryInfoData] = useState({});

  const handleSaveDeliveryInfo = useCallback(async () => {
    if (userId) {
      await createDeliveryInfo({ ...deliveryInfoData, customer_id: userId });
    }
    handleCloseModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, deliveryInfoData]);

  return (
    <Modal
      title='Thêm địa chỉ giao hàng'
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
    >
      <div>
        <TextField
          fullWidth
          label='Tên địa chỉ'
          variant='outlined'
          style={{ marginBottom: "1rem" }}
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: 20,
            },
          }}
          value={deliveryInfoData.name}
          onChange={(e) =>
            setDeliveryInfoData({ ...deliveryInfoData, name: e.target.value })
          }
        />

        <TextField
          fullWidth
          label='Địa chỉ'
          variant='outlined'
          style={{ marginBottom: "1rem" }}
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: 20,
            },
          }}
          value={deliveryInfoData.delivery_address}
          onChange={(e) =>
            setDeliveryInfoData({
              ...deliveryInfoData,
              delivery_address: e.target.value,
            })
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={deliveryInfoData.is_default}
              onChange={(e, checked) =>
                setDeliveryInfoData({
                  ...deliveryInfoData,
                  is_default: checked ? 1 : 0,
                })
              }
            />
          }
          label='Đặt làm địa chỉ mặc định'
        />
      </div>

      <div style={{ display: "flex", float: "right", marginTop: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSaveDeliveryInfo}
        >
          Luu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Huy bo
        </Button>
      </div>
    </Modal>
  );
}

export default function Checkout(props) {
  const [orderData, setOrderData] = useState(defaultOrderData);
  const [otherFee, setOtherFee] = useState(30000);
  const [deliveryInfoOptions, setDeliveryInfoOptions] = useState([]);
  const [isDeliveryInfoCreateVisible, setDeliveryInfoCreateVisible] =
    useState(false);
  const [branchOptions, setBranchOptions] = useState([]);

  const cartItems = useSelector((state) => state.cart.items);
  const authUser = useSelector((state) => state.auth.user);

  const socket = useWebsocket();
  const history = useHistory();
  const dispatch = useDispatch();

  const fetchBranchOptions = async () => {
    const branches = (await getBranches()).data;
    setBranchOptions(branches);
  };

  const fetchDeliveryInfoOptions = useCallback(async () => {
    if (authUser) {
      const options = (
        await getDeliveryInfos({
          filters: JSON.stringify({ customer_id: authUser.id }),
        })
      ).data;
      setDeliveryInfoOptions(options);
    }
  }, [authUser]);

  const handleUpdateDeliveryInfo = useCallback(
    (deliveryInfoId) => {
      setOrderData({ ...orderData, delivery_info_id: deliveryInfoId });
    },
    [orderData]
  );

  const handleCreateOrder = useCallback(async () => {
    console.log("order data: ", orderData);
    const postData = {
      ...orderData,
      type: "delivery",
      details: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      created_by_customer: 1,
      customer_id: authUser?.id,
    };
    const order = (await createOrder(postData)).data;

    // create and send notification to server
    // const notification = (
    //   await createNotification({
    //     order_id: order.id,
    //     type: "order_created",
    //   })
    // ).data;

    // socket?.emit("NEW_NOTIFICATION", notification);

    history.push(`/orders/${order.id}`, {
      order: { ...orderData, items: cartItems },
    });
    dispatch(resetCart());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData, cartItems, socket, authUser]);

  useEffect(() => {
    if (!authUser) {
      history.push("/");
    }
    fetchDeliveryInfoOptions();
    fetchBranchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  useEffect(() => {
    if (deliveryInfoOptions.length) {
      const defaultInfo = deliveryInfoOptions.find((opt) => opt.is_default);
      if (defaultInfo) {
        handleUpdateDeliveryInfo(defaultInfo.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryInfoOptions]);

  return (
    <>
      <DeliveryInfoCreate
        isModalVisible={isDeliveryInfoCreateVisible}
        handleCloseModal={(success = false) => {
          setDeliveryInfoCreateVisible(false);
          if (success) {
            fetchDeliveryInfoOptions();
          }
        }}
        userId={authUser?.id}
      />
      <CustomerMain includeFooter={false}>
        <div style={{ padding: "1rem 30rem", background: "#f5f5f5" }}>
          <Card style={{ marginBottom: "2rem", marginTop: "1rem" }}>
            <CardHeader title='Giao đến' />
            <CardContent>
              <TextField
                label='Chi nhánh nhận đơn'
                select
                SelectProps={{ native: true }}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                fullWidth
                style={{ marginBottom: "1rem" }}
                value={orderData.branch_id || null}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    branch_id: Number.parseInt(e.target.value) || null,
                  })
                }
              >
                <option value=''>Chọn chi nhánh</option>
                {branchOptions.map((opt) => (
                  <option
                    value={opt.id}
                  >{`${opt.name} - ${opt.address}`}</option>
                ))}
              </TextField>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <TextField
                  label='Địa chỉ'
                  select
                  SelectProps={{ native: true }}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 20,
                    },
                  }}
                  fullWidth
                >
                  {deliveryInfoOptions.map((opt) => (
                    <option value={opt.id}>{opt.delivery_address}</option>
                  ))}
                </TextField>
                <IconButton
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => setDeliveryInfoCreateVisible(true)}
                >
                  <AddIcon />
                </IconButton>
              </div>

              <TextField
                fullWidth
                label='Ghi chú cho tài xế'
                variant='outlined'
                style={{ marginTop: "2rem" }}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                value={orderData.note}
                onChange={(e) =>
                  setOrderData({ ...orderData, note: e.target.value })
                }
              />
            </CardContent>
          </Card>
          <Card style={{ marginBottom: "2rem" }}>
            <CardHeader title='Thông tin đơn hàng' />
            <CardContent>
              <List style={{ minWidth: 400 }}>
                {cartItems.map((item) => (
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
                          onClick={() =>
                            dispatch(updateCart(item.id, item.quantity - 1))
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography style={{ margin: "0 4px" }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size='medium'
                          onClick={() =>
                            dispatch(updateCart(item.id, item.quantity + 1))
                          }
                        >
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
                        <div>
                          <Typography>
                            {item.delivery_sale_price || item.sale_price}
                          </Typography>
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
                    {cartItems.reduce(
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
                  <Typography style={{ fontWeight: 500 }}>
                    {otherFee}
                  </Typography>
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
              {cartItems.reduce(
                (prevTotal, item) =>
                  prevTotal + item.sale_price * item.quantity,
                0
              ) + otherFee}
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

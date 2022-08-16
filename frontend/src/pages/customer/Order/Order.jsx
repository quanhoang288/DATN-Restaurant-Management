import React, { useState } from "react";

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import CustomAccordion from "../../../components/CustomAccordion/CustomAccordion";
import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import TabPanel from "../../../components/CustomTabs/TabPanel";
import CustomerMain from "../../../containers/CustomerMain/CustomerMain";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SlickList from "../../../components/SlickList/SlickList";
import { useEffect } from "react";
import { getMenus } from "../../../apis/menu";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCart } from "../../../redux/actions/cartActions";
import { showModal } from "../../../redux/actions/modalActions";
import { ASSET_BASE_URL } from "../../../configs";
import noImageAvailable from "../../../assets/no-image-available.jpg";

// import './Order.css'

function CategoryItem(props) {
  const { item, handleItemSelect } = props;
  return (
    <Card style={{ margin: "1rem 1rem" }}>
      <CardActionArea onClick={() => handleItemSelect(item)}>
        <CardMedia
          component='img'
          alt='Item thumbnail'
          height={150}
          width={150}
          image={
            item.image
              ? `${ASSET_BASE_URL}/images/${item.image}`
              : noImageAvailable
          }
        />
        <CardContent style={{ textAlign: "center" }}>
          <Typography style={{ fontWeight: 500 }}>
            {item?.name ?? ""}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {item?.sale_price ?? ""}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Order(props) {
  const [activeTab, setActiveTab] = useState(0);
  const [menuList, setMenuList] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [requestToPay, setRequestToPay] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const authUser = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const fetchMenuList = async () => {
    setMenuList((await getMenus()).data);
  };

  const handleCheckout = useCallback(() => {
    if (!authUser) {
      dispatch(showModal());
    }
    setRequestToPay(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  useEffect(() => {
    if (authUser && requestToPay) {
      history.push("/checkout");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, requestToPay]);

  useEffect(() => {
    if (menuList.length && !selectedMenuId) {
      setSelectedMenuId(menuList[0].id);
    }
  }, [menuList, selectedMenuId]);

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <CustomerMain includeFooter={false}>
      <div style={{ padding: "2rem 10rem" }}>
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ flex: 1, marginRight: "2rem" }}>
            <TextField
              fullWidth
              placeholder='Tìm kiếm theo tên món ăn/đồ uống'
              variant='outlined'
              style={{ marginBottom: "1rem" }}
            />
            <Card>
              <CardContent
                style={{
                  display: "flex",
                  width: "100%",
                  minWidth: 0,
                  minHeight: 0,
                }}
              >
                <List
                  component='nav'
                  style={{
                    minWidth: 150,
                    borderRight: "1px solid",
                    textAlign: "center",
                  }}
                >
                  {menuList.map((menu) => (
                    <ListItem
                      button
                      selected={menu.id === selectedMenuId}
                      onClick={() => setSelectedMenuId(menu.id)}
                    >
                      <ListItemText primary={menu.name} />
                    </ListItem>
                  ))}
                </List>

                <div>
                  <CustomTabs
                    labels={(
                      menuList.find((item) => item.id === selectedMenuId)
                        ?.categories || []
                    ).map((category) => category.name)}
                    activeTab={activeTab}
                    onChangeActiveTab={(val) => setActiveTab(val)}
                  >
                    {(
                      menuList.find((item) => item.id === selectedMenuId)
                        ?.categories || []
                    ).map((category, idx) => (
                      <TabPanel value={activeTab} index={idx}>
                        <div
                          style={{
                            minWidth: 600,
                            maxWidth: 800,
                            marginLeft: "2.5rem",
                          }}
                        >
                          <SlickList
                            settings={{
                              dots: true,
                              infinite: false,
                              slidesToShow: 3,
                              speed: 500,
                              rows: Math.max(
                                (category.items || []).length / 3,
                                1
                              ),
                              slidesToScroll: 1,
                            }}
                          >
                            {(category.items || []).map((item) => (
                              <CategoryItem
                                item={item}
                                handleItemSelect={() =>
                                  dispatch(addToCart(item))
                                }
                              />
                            ))}
                          </SlickList>
                        </div>
                      </TabPanel>
                    ))}
                  </CustomTabs>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flex: 1 }}>
                <List style={{ minWidth: 200 }}>
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
                            {item.quantity ?? 1}
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
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography style={{ fontSize: 18 }}>Tổng</Typography>
                    <Typography style={{ fontSize: 18, fontWeight: 500 }}>
                      {cartItems.reduce(
                        (prevTotal, item) =>
                          prevTotal +
                          (item.delivery_sale_price || item.sale_price) *
                            item.quantity,
                        0
                      )}
                    </Typography>
                  </div>
                  <Typography color='textSecondary'>
                    Phí giao hàng sẽ được tính khi kiểm tra đơn hàng
                  </Typography>
                </div>
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
              </div>
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <Button
                  variant='contained'
                  style={{
                    background: "green",
                    color: "white",
                    minWidth: 300,
                    borderRadius: 10,
                  }}
                  onClick={handleCheckout}
                >
                  Thanh toán
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerMain>
  );
}

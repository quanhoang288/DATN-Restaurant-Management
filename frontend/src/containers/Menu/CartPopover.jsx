import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  List,
  IconButton,
  ListSubheader,
  Typography,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import MenuPopover from "../../components/MenuPopover/MenuPopover";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/actions";
import { showModal } from "../../redux/actions/modalActions";
import { ASSET_BASE_URL } from "../../configs";
import noImageAvailable from "../../assets/no-image-available.jpg";

export default function CartPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [requestToPay, setRequestToPay] = useState(false);

  const cart = useSelector((state) => state.cart);
  const authUser = useSelector((state) => state.auth.user);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckout = useCallback(() => {
    if (!authUser) {
      handleClose();
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

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        style={{ color: "white" }}
      >
        <Badge badgeContent={(cart.items || []).length} color='secondary'>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
      >
        <List
          disablePadding
          subheader={<ListSubheader disableSticky>Giỏ đồ</ListSubheader>}
          style={{ maxHeight: "60vh", overflow: "auto" }}
        >
          {(cart.items || []).length === 0 ? (
            <div
              style={{
                height: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0 20px",
              }}
            >
              <Typography variant='body1'>Giỏ đồ rỗng</Typography>
            </div>
          ) : (
            <div>
              <List style={{ minWidth: 400 }}>
                {(cart.items || []).map((item) => (
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
                            dispatch(
                              item.quantity === 1
                                ? cartActions.removeFromCart(item.id)
                                : cartActions.updateCart(
                                    item.id,
                                    item.quantity - 1
                                  )
                            )
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
                            dispatch(
                              cartActions.updateCart(item.id, item.quantity + 1)
                            )
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
                        <div style={{ marginLeft: "1rem" }}>
                          <Typography>
                            {(item.delivery_sale_price || item.sale_price) *
                              item.quantity}
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
                    {cart.items.reduce(
                      (total, item) =>
                        total +
                        item.quantity *
                          (item.delivery_sale_price || item.sale_price),
                      0
                    )}
                  </Typography>
                </div>
                <Typography color='textSecondary'>
                  Phí giao hàng sẽ được tính khi kiểm tra đơn hàng
                </Typography>
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
            </div>
          )}
        </List>
      </MenuPopover>
    </>
  );
}

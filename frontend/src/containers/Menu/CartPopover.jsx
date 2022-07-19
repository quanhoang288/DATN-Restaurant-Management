import React, { useCallback, useEffect, useRef, useState } from 'react'
import { List, IconButton, ListSubheader, Typography, ListItem, ListItemText, Divider, Button } from '@material-ui/core'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from '@material-ui/core/Badge'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import RemoveIcon from '@material-ui/icons/Remove'
import AddIcon from '@material-ui/icons/Add'
import MenuPopover from '../../components/MenuPopover/MenuPopover'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch, useSelector } from 'react-redux'
import { cartActions } from '../../redux/actions'

export default function CartPopover() {
  const [items, setItems] = useState([])
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)

  const cart = useSelector((state) => state.cart)

  const history = useHistory()
  const dispatch = useDispatch()

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleOpen} style={{ color: 'white' }}>
        <Badge badgeContent={(cart.items || []).length} color='secondary'>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current}>
        <List
          disablePadding
          subheader={<ListSubheader disableSticky>Giỏ đồ</ListSubheader>}
          style={{ maxHeight: '60vh', overflow: 'auto' }}
        >
          {(cart.items || []).length === 0 ? (
            <div
              style={{
                height: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 20px',
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
                      <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                        <IconButton
                          size='medium'
                          onClick={() =>
                            dispatch(
                              item.quantity === 1 ? cartActions.removeFromCart(item.id) : cartActions.updateCart(item.id, item.quantity - 1)
                            )
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography style={{ margin: '0 4px' }}>{item.quantity}</Typography>
                        <IconButton size='medium' onClick={() => dispatch(cartActions.updateCart(item.id, item.quantity + 1))}>
                          <AddIcon />
                        </IconButton>
                      </div>
                      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                          <img
                            src='https://d1sag4ddilekf6.azureedge.net/compressed/items/VNITE20220620072008363273/photo/menueditor_item_c1cc9114f56b46308d9d553166e4b3bc_1655892956270133788.jpg'
                            alt='Cart item'
                            width={60}
                            height={60}
                            style={{ marginRight: 10 }}
                          />
                          <Typography style={{ fontWeight: 500 }}>Bún bò</Typography>
                        </div>
                        <div>
                          <Typography>43000</Typography>
                        </div>
                      </div>
                    </ListItem>
                    <Divider />
                  </>
                ))}
              </List>
              <div style={{ padding: '1rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography style={{ fontSize: 18 }}>Tổng</Typography>
                  <Typography style={{ fontSize: 18, fontWeight: 500 }}>43000</Typography>
                </div>
                <Typography color='textSecondary'>Phí giao hàng sẽ được tính khi kiểm tra đơn hàng</Typography>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <Button
                  variant='contained'
                  style={{ background: 'green', color: 'white', minWidth: 300, borderRadius: 10 }}
                  onClick={() => history.push('/checkout')}
                >
                  Thanh toán
                </Button>
              </div>
            </div>
          )}
        </List>
      </MenuPopover>
    </>
  )
}


import React, { useState } from 'react'
import { alpha, makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import Badge from '@material-ui/core/Badge'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MailIcon from '@material-ui/icons/Mail'
import NotificationsIcon from '@material-ui/icons/Notifications'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { Button, Grid, Link } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import CartPopover from '../../containers/Menu/CartPopover'
import AccountPopover from '../../containers/Menu/AccountPopover'
import AuthHandler from '../../containers/AuthHandler/AuthHandler'
import { showModal } from '../../redux/actions/modalActions'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  categories: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  sectionDesktop: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      marginRight: '1rem',
    },
  },
}))

export default function CustomerHeader() {
  const [anchorEl, setAnchorEl] = useState(null)

  const user = useSelector((state) => state.auth.user)

  const history = useHistory()
  const classes = useStyles()
  const dispatch = useDispatch()

  const isMenuOpen = Boolean(anchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  )

  return (
    <div className={classes.grow}>
      <AuthHandler />
      <AppBar position='sticky' style={{ backgroundColor: '#df5800bf' }}>
        <Toolbar style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ marginLeft: '1rem' }}>
            <Link href='/home' className={classes.title} variant='h6' noWrap style={{ marginRight: '1rem', color: 'white' }}>
              My Kitchen
            </Link>
          </div>

          <div style={{ display: 'flex' }}>
            <Typography className={classes.categories}>
              <Link href='/reservations' style={{ color: 'white' }}>
                Đặt bàn
              </Link>
              <Link href='/menus' style={{ color: 'white' }}>
                Thực đơn
              </Link>
              <Link href='/orders' style={{ color: 'white' }}>
                Đặt đồ
              </Link>
            </Typography>
          </div>

          <div className={classes.sectionDesktop}>
            {user ? (
              <>
                <CartPopover />
                <AccountPopover />
              </>
            ) : (
              <Button variant='contained' color='secondary' onClick={() => dispatch(showModal())}>
                Đăng nhập
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  )
}


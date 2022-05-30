import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import NotificationsIcon from '@material-ui/icons/Notifications'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { Grid, Button } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { showModal } from '../../redux/actions/modalActions'
import './Navbar.css'
import clsx from 'clsx'
import { useStyles } from '../../styles/drawer.style'

export default function Navbar({ isDrawerOpen, onOpenDrawer }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)
  const classes = useStyles()

  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleShowProfile = () => {
    setAnchorEl(null)
    history.push(`/profile/${user.id}`)
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
      <MenuItem onClick={handleShowProfile}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  )

  const renderGuestNavbarOptions = (
    <>
      {/* <Link href='#' variant='body1' className='mr__2 vertical__center '>
        Tải lên
      </Link> */}
      <Button variant='contained' color='secondary' size='medium' onClick={() => dispatch(showModal())}>
        Đăng nhập
      </Button>
    </>
  )

  const renderAuthenticatedNavbarOptions = (
    <>
      <IconButton color='inherit'>
        <CloudUploadIcon />
      </IconButton>
      <IconButton color='inherit'>
        <NotificationsIcon />
      </IconButton>
      <IconButton edge='end' aria-controls={menuId} aria-haspopup='true' onClick={handleProfileMenuOpen} color='inherit'>
        <AccountCircle />
      </IconButton>
    </>
  )

  return (
    <div>
      <AppBar position='fixed' color='default'>
        <Toolbar>
          <Grid container style={{ alignItems: 'center' }}>
            <Grid item xs={1}>
              <IconButton color='inherit' aria-label='open drawer' onClick={onOpenDrawer} edge='start' className={clsx(classes.menuButton, isDrawerOpen && classes.hide)}>
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs={9}></Grid>
            <Grid item xs={2}>
              <div className='icon__group'>{user ? renderAuthenticatedNavbarOptions : renderGuestNavbarOptions}</div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  )
}

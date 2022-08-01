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
import AccountPopover from '../../containers/Menu/AccountPopover'
import NotificationsPopover from '../../containers/Menu/NotificationPopover'

export default function Navbar({ isDrawerOpen, onOpenDrawer }) {
  const classes = useStyles()

  return (
    <div>
      <AppBar position='fixed' color='default'>
        <Toolbar>
          <Grid container style={{ alignItems: 'center' }}>
            <Grid item xs={1}>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={onOpenDrawer}
                edge='start'
                className={clsx(classes.menuButton, isDrawerOpen && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs={9}></Grid>
            <Grid item xs={2}>
              <div className='icon__group'>
                <NotificationsPopover />
                <AccountPopover />
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  )
}


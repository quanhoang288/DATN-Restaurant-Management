import React, { useState } from 'react'
import Drawer from '@material-ui/core/Drawer'

import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { IconButton, ListItemIcon } from '@material-ui/core'
import { useStyles } from '../../styles/drawer.style'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import routes from '../../constants/route'
import EqualizerIcon from '@material-ui/icons/Equalizer'
import PeopleIcon from '@material-ui/icons/People'
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import KitchenIcon from '@material-ui/icons/Kitchen'
import FastfoodIcon from '@material-ui/icons/Fastfood'
import SettingsIcon from '@material-ui/icons/Settings'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'

// import './Sidebar.css'

function Sidebar({ isDrawerOpen, onCloseDrawer }) {
  const classes = useStyles()
  const history = useHistory()

  const categories = [
    { name: 'Tong quan', url: '/', Icon: EqualizerIcon },
    { name: 'Hang hoa', url: routes.GOODS, Icon: FastfoodIcon },
    { name: 'Co so vat chat', url: routes.FACILITIES, Icon: KitchenIcon },
    { name: 'Khach hang', url: routes.CUSTOMERS, Icon: PeopleIcon },
    { name: 'Nhan vien', url: routes.STAFF, Icon: PeopleAltIcon },
    { name: 'Thuc don', url: routes.MENUS, Icon: RestaurantMenuIcon },
    { name: 'Khuyen mai', url: routes.DISCOUNTS, Icon: LocalOfferIcon },
    { name: 'Cai dat', url: routes.SETTING, Icon: SettingsIcon }
  ]

  return (
    <Drawer
      className={classes.drawer}
      variant='persistent'
      anchor='left'
      open={isDrawerOpen}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={onCloseDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        {categories.map((category) => (
          <ListItem button key={category.name} onClick={() => history.push(category.url)}>
            {
              <ListItemIcon>
                <category.Icon />
              </ListItemIcon>
            }
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar

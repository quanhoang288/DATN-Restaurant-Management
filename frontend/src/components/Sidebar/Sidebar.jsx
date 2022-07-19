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
import EventNoteIcon from '@material-ui/icons/EventNote'
import RoomServiceIcon from '@material-ui/icons/RoomService'
import ReceiptIcon from '@material-ui/icons/Receipt'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// import './Sidebar.css'

const categories = [
  { name: 'Tổng quan', url: '/', Icon: EqualizerIcon },
  { name: 'Hàng hóa', url: routes.GOODS, Icon: FastfoodIcon },
  { name: 'Cơ sở vật chất', url: routes.FACILITIES, Icon: KitchenIcon },
  { name: 'Khách hàng', url: routes.CUSTOMERS, Icon: PeopleIcon },
  { name: 'Nhân viên', url: routes.STAFF, Icon: PeopleAltIcon },
  { name: 'Thực đơn', url: routes.MENUS, Icon: RestaurantMenuIcon },
  { name: 'Khuyến mãi', url: routes.DISCOUNTS, Icon: LocalOfferIcon },
  { name: 'Đặt bàn', url: routes.RESERVATIONS, Icon: EventNoteIcon },
  { name: 'Bếp', url: routes.KITCHEN_DISPLAY, Icon: RoomServiceIcon },
  { name: 'Đơn phục vụ', url: routes.ORDERS, Icon: ReceiptIcon },
  { name: 'Cài đặt', url: routes.SETTINGS, Icon: SettingsIcon },
]

function Sidebar({ isDrawerOpen, onCloseDrawer }) {
  const classes = useStyles()
  const history = useHistory()
  const [selectedUrl, setSelectedUrl] = useState(null)
  const location = useLocation()

  useEffect(() => {
    setSelectedUrl(categories.find((cat) => cat.url === location.pathname).url)
  }, [location])

  return (
    <Drawer
      className={classes.drawer}
      variant='persistent'
      anchor='left'
      open={isDrawerOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={onCloseDrawer} style={{ color: 'white' }}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        {categories.map((category) => (
          <ListItem
            button
            selected={category.url === selectedUrl}
            key={category.name}
            onClick={() => {
              setSelectedUrl(category.url)
              history.push(category.url)
            }}
            className={classes.listItem}
          >
            {
              <ListItemIcon className={classes.listItemIcon}>
                <category.Icon />
              </ListItemIcon>
            }
            <ListItemText
              primary={category.name}
              primaryTypographyProps={{
                style: {
                  fontWeight: category.url === selectedUrl ? 500 : 'normal',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar


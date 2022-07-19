import React, { useEffect, useState } from 'react'

import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from '@material-ui/core'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'
import CustomTabs from '../../../components/CustomTabs/CustomTabs'
import TabPanel from '../../../components/CustomTabs/TabPanel'
import CustomerMain from '../../../containers/CustomerMain/CustomerMain'
import { useParams } from 'react-router-dom'
import { getMenu } from '../../../apis/menu'
import { useDispatch } from 'react-redux'
import { cartActions } from '../../../redux/actions'

function CategoryItem(props) {
  const { item } = props

  const dispatch = useDispatch()

  return (
    <Card>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <img
              src='https://d1sag4ddilekf6.azureedge.net/compressed_webp/items/VNITE20210921094246019781/detail/8e68806c57314ae2b14f0e01998c65f3_1632217366841678818.webp'
              alt='Category item'
              width={100}
              height={100}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: '1rem' }}>
            <div>
              <Typography variant='h6'>{item.name}</Typography>
              <Typography>{item.description || 'Description'}</Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography style={{ fontWeight: 500 }}>{item.sale_price}</Typography>
              <IconButton style={{ color: 'green' }} onClick={() => dispatch(cartActions.addToCart(item.id))}>
                <AddBoxOutlinedIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MenuCategory(props) {
  const { category } = props
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        rowGap: 20,
        alignItems: 'center',
        flex: 1,
        columnGap: 20,
      }}
    >
      {category.items.map((item) => (
        <CategoryItem item={item} />
      ))}
    </div>
  )
}

export default function MenuDetail(props) {
  const { id } = useParams()
  const [menuData, setMenuData] = useState({})
  const [activeTab, setActiveTab] = useState(0)

  const fetchMenuData = async (menuId) => {
    const menu = (await getMenu(menuId)).data
    setMenuData(menu)
  }

  useEffect(() => {
    if (id) {
      fetchMenuData(id)
    }
  }, [id])

  return (
    <CustomerMain>
      <div style={{ padding: '2rem 2rem' }}>
        <CustomTabs
          labels={(menuData.categories || []).map((category) => category.name)}
          activeTab={activeTab}
          onChangeActiveTab={(val) => setActiveTab(val)}
        >
          {(menuData.categories || []).map((category, idx) => (
            <TabPanel value={activeTab} index={idx}>
              <div>
                <MenuCategory category={category} />
              </div>
            </TabPanel>
          ))}
        </CustomTabs>
      </div>
    </CustomerMain>
  )
}


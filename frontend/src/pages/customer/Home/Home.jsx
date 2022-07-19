import { CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core'
import { Button, Card, Paper } from '@mui/material'
import React from 'react'

import CustomCarousel from '../../../components/Carousel/Carousel'
import SlickList from '../../../components/SlickList/SlickList'
import CustomerMain from '../../../containers/CustomerMain/CustomerMain'

function DiscountItem(props) {
  return (
    <Card>
      <CardActionArea>
        <CardMedia
          component='img'
          alt='Contemplative Reptile'
          height='140'
          image='https://cdn4.vectorstock.com/i/1000x1000/71/83/sign-board-discount-vector-1947183.jpg'
          title='Discount thumbnail'
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            Lizard
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size='small' color='primary'>
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  )
}

function Home(props) {
  return (
    <CustomerMain>
      <div className='advertisement' style={{ marginTop: '1rem' }}>
        <CustomCarousel>
          <Paper>
            <img src='https://cdn.lauphan.com/photo-storage/myFile-1651677819530.jpeg' alt='advertisement' height={500} width='100%' />
          </Paper>
          <Paper>
            <img src='https://cdn.lauphan.com/photo-storage/myFile-1651677819530.jpeg' alt='advertisement' height={500} width='100%' />
          </Paper>
        </CustomCarousel>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem 3rem' }}>
        <Typography variant='h5'>Khuyến mại</Typography>
        <SlickList>
          <DiscountItem />
          <DiscountItem />
          <DiscountItem />
          <DiscountItem />
          <DiscountItem />
          <DiscountItem />
        </SlickList>
      </div>
    </CustomerMain>
  )
}

export default Home


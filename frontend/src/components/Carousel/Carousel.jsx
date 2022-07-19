import React from 'react'
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'

const items = [
  {
    name: 'Random Name #1',
    description: 'Probably the most random thing you have ever seen!',
  },
  {
    name: 'Random Name #2',
    description: 'Hello World!',
  },
]

function CustomCarousel({ children }) {
  return (
    <Carousel navButtonsAlwaysVisible animation='fade'>
      {children}
    </Carousel>
  )
}

export default CustomCarousel


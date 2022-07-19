import React from 'react'
import Slider from 'react-slick'
import './SlickList.css'

function SlickList({ settings, children }) {
  return <Slider {...settings}>{children}</Slider>
}

SlickList.defaultProps = {
  settings: {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: false,
  },
}

export default SlickList


import React from 'react'

import { Chip } from '@material-ui/core'

function ChipLabel({ label, variant }) {
  const convertToColor = (variant) => {
    switch (variant) {
      case 'success':
        return {
          background: 'green',
          color: 'white',
        }

      case 'primary':
        return {
          background: '#003366',
          color: 'white',
        }

      case 'warning':
        return {
          background: 'yellow',
          color: 'black',
        }

      case 'info':
        return {
          background: 'grey',
          color: 'white',
        }

      case 'failure':
        return {
          background: 'red',
          color: 'white',
        }

      default:
        return {
          background: 'red',
          color: 'white',
        }
    }
  }

  return <Chip label={label} style={convertToColor(variant)} />
}

export default ChipLabel


import { Box, Typography } from '@material-ui/core'
import React from 'react'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography component='div' role='tabpanel' hidden={value !== index} id={`tabpanel-${index}`} {...other}>
      <Box p={2}>{children}</Box>
    </Typography>
  )
}

export default TabPanel

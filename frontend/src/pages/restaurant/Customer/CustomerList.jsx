import React, { useState } from 'react'
import { Card, CardContent, CardHeader, Typography, Collapse, Avatar, IconButton, CardActions, FormControlLabel, FormGroup, Icon, Button, TextField } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'

import CollapsibleCard from '../../../components/CollapsibleCard/CollapsibleCard'
import CustomTable from '../../../components/Table/CustomTable'
import './CustomerList.css'
import Main from '../../../containers/Main/Main'
function CustomerList() {
  return (
    <Main>
      <div className='customer__list__container'>
        <div className='list_container'>
          <div className='list__header' style={{ marginBottom: 10 }}>
            <Typography variant='h6'>Khach hang</Typography>
            <div>
              <Button size='small' variant='contained'>
                Xuat file
              </Button>
            </div>
          </div>
          <div className='list__content'>
            <CustomTable />
          </div>
        </div>
      </div>
    </Main>
  )
}

export default CustomerList

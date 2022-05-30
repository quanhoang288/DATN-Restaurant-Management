import React, { useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { Button, TextField } from '@material-ui/core'

// import './GoodGroupCreate.css'

function GoodGroupCreate({ isModalVisible, handleCloseModal }) {
  const groups = ['A', 'B', 'C']
  return (
    <div className='good__create__container'>
      <Modal isModalVisible={isModalVisible} handleClose={handleCloseModal} title='Them nhom hang'>
        <div sty>
          <TextField
            label='Ten nhom'
            fullWidth
            margin='normal'
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            select
            label='Nhom cha'
            SelectProps={{
              native: true
            }}
            placeholder='Lua chon'
            fullWidth
          >
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </TextField>
        </div>
        <div style={{ display: 'flex', float: 'right', marginTop: 2 }}>
          <Button variant='contained' color='primary'>
            Luu
          </Button>
          <Button variant='contained' onClick={handleCloseModal}>
            Huy bo
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default GoodGroupCreate

import React, { useCallback, useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { Button, TextField } from '@material-ui/core'
import { KITCHEN_TYPES } from '../../../constants'
import { createKitchen, getKitchen, updateKitchen } from '../../../apis/kitchen'
// import './KitchenCreate.css'

function KitchenCreate({ kitchenId, isModalVisible, handleCloseModal }) {
  const [kitchenData, setKitchenData] = useState({
    name: '',
    type: KITCHEN_TYPES[0]
  })

  const fetchKitchenData = async (kitchenId) => {
    const res = await getKitchen(kitchenId)
    const { name, type } = res.data
    setKitchenData({
      name,
      type
    })
  }

  const handleSaveKitchen = useCallback(async () => {
    if (kitchenId) {
      console.log(kitchenData)
      await updateKitchen(kitchenId, kitchenData)
    } else {
      await createKitchen(kitchenData)
    }
    handleCloseModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kitchenId, kitchenData])

  useEffect(() => {
    if (kitchenId) {
      fetchKitchenData(kitchenId)
    } else {
      setKitchenData({
        name: '',
        type: KITCHEN_TYPES[0]
      })
    }
  }, [kitchenId])

  return (
    <Modal isModalVisible={isModalVisible} handleClose={handleCloseModal} title='Them bep'>
      <div>
        <TextField
          label='Ten bep'
          fullWidth
          margin='normal'
          InputLabelProps={{
            shrink: true
          }}
          value={kitchenData.name}
          onChange={(e) => setKitchenData({ ...kitchenData, name: e.target.value })}
        />
        <TextField
          select
          label='Loai bep'
          SelectProps={{
            native: true
          }}
          placeholder='Lua chon'
          fullWidth
          value={kitchenData.type}
          onChange={(e) => setKitchenData({ ...kitchenData, type: e.target.value })}
        >
          {KITCHEN_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </TextField>
        {/* <TextField
          select
          label='Chi nhanh'
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
        </TextField> */}
      </div>
      <div style={{ display: 'flex', float: 'right', marginTop: 2 }}>
        <Button variant='contained' color='primary' onClick={handleSaveKitchen}>
          Luu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Huy bo
        </Button>
      </div>
    </Modal>
  )
}

export default KitchenCreate

import React, { useCallback, useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import {
  Grid,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
  FormLabel,
  IconButton,
  Typography,
} from '@material-ui/core'
import { createRole, updateRole } from '../../../apis/role'

function RoleCreate({ roleId, isModalVisible, handleCloseModal }) {
  const [roleName, setRoleName] = useState('')

  const handleSaveRole = useCallback(async () => {
    if (roleId) {
      await updateRole(roleId, { name: roleName })
    } else {
      await createRole({ name: roleName })
    }
    setRoleName('')
    handleCloseModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId, roleName])

  return (
    <>
      <Modal isModalVisible={isModalVisible} handleClose={handleCloseModal} title='Thêm vai trò'>
        <div>
          <TextField
            label='Tên vai trò'
            required
            fullWidth
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
          />
        </div>

        <div style={{ display: 'flex', float: 'right', marginTop: 2 }}>
          <Button variant='contained' color='primary' onClick={handleSaveRole}>
            Lưu
          </Button>
          <Button variant='contained' onClick={handleCloseModal}>
            Hủy bỏ
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default RoleCreate


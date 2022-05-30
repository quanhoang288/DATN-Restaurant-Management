import React, { useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { Grid, Button, TextField, RadioGroup, FormControlLabel, FormControl, Radio, FormLabel, IconButton, Typography } from '@material-ui/core'
import CameraAltIcon from '@material-ui/icons/CameraAlt'
import './StaffCreate.css'

function StaffCreate({ staffId, isModalVisible, handleCloseModal }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)

  const handleSelectImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    setSelectedFile(e.target.files[0])
  }

  useEffect(() => {
    if (!selectedFile) {
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setProfilePreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  return (
    <Modal isModalVisible={isModalVisible} handleClose={handleCloseModal} title='Thêm nhân viên'>
      <Grid container>
        <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
            <div style={{ border: '1px dashed', minHeight: 200, marginBottom: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {selectedFile ? (
                <img src={profilePreview} alt='profile-preview' style={{ maxWidth: 150, minHeight: 150, maxHeight: 300 }} />
              ) : (
                <>
                  <IconButton size='medium'>
                    <CameraAltIcon />
                  </IconButton>
                  <Typography>Tải ảnh lên</Typography>
                </>
              )}
            </div>
            {selectedFile ? (
              <Button variant='contained' color='secondary' onClick={() => setSelectedFile(null)}>
                Xóa ảnh
              </Button>
            ) : (
              <Button variant='contained' component='label'>
                <Typography>Chọn ảnh</Typography>
                <input type='file' name='profile' onChange={handleSelectImage} hidden />
              </Button>
            )}
          </div>
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <div>
            <TextField
              label='Ma nhan vien'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
            />
            <TextField
              label='Ten nhan vien'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
              fullWidth
            />
            <TextField
              label='Ngay sinh'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
              fullWidth
            />
            <FormControl margin='normal'>
              <FormLabel id='demo-radio-buttons-group-label'>Gioi tinh</FormLabel>
              <RadioGroup row aria-labelledby='demo-radio-buttons-group-label' defaultValue='male' name='radio-buttons-group'>
                <FormControlLabel value='male' control={<Radio />} label='Nam' />
                <FormControlLabel value='female' control={<Radio />} label='Nu' />
              </RadioGroup>
            </FormControl>
            <TextField
              label='So CMND'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
              fullWidth
            />
            <TextField
              label='Chuc danh'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
              fullWidth
            />
            <TextField
              label='Chi nhanh lam viec'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
              fullWidth
            />
          </div>
        </Grid>
        <Grid item xs={1} />

        <Grid item xs={4}>
          <div>
            <TextField
              label='Tài khoản hệ thống'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
              fullWidth
            />
            <TextField
              label='Mật khẩu'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
              margin='normal'
              fullWidth
            />
            <TextField
              label='Số điện thoại'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
              fullWidth
            />
            <TextField
              label='Email'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
              fullWidth
            />
            <TextField
              label='Địa chỉ'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22
                }
              }}
              fullWidth
            />
          </div>
        </Grid>
      </Grid>

      <div style={{ display: 'flex', float: 'right', marginTop: 2 }}>
        <Button variant='contained' color='primary'>
          Luu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Huy bo
        </Button>
      </div>
    </Modal>
  )
}

export default StaffCreate

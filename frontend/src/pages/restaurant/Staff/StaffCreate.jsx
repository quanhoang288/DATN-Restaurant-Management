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
import CameraAltIcon from '@material-ui/icons/CameraAlt'
import AddIcon from '@material-ui/icons/Add'
import './StaffCreate.css'
import { createStaff, getStaff, updateStaff } from '../../../apis/staff'
import Toast from '../../../components/Toast/Toast'
import { API_BASE_URL, ASSET_BASE_URL } from '../../../configs'
import RoleCreate from '../Role/RoleCreate'
import { getRoles } from '../../../apis/role'

const defaultData = {
  avatar: null,
  fullName: '',
  dob: '',
  gender: '',
  roleId: null,
  email: '',
  password: '',
  phoneNumber: '',
  address: '',
  branchId: null,
}

function StaffCreate({ staffId, isModalVisible, handleCloseModal }) {
  const [profilePreview, setProfilePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [staffData, setStaffData] = useState(defaultData)
  const [isSaveStaffSucessful, setSaveStaffSuccessful] = useState(false)
  const [isRoleCreateModalVisible, setRoleCreateModalVisible] = useState(false)
  const [roleOptions, setRoleOptions] = useState([])

  const handleSelectImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    setSelectedFile(e.target.files[0])
  }

  const fetchStaffInfo = async (staffId) => {
    const staff = (await getStaff(staffId)).data
    setStaffData({
      avatar: staff.user?.avatar,
      fullName: staff.user?.full_name,
      dob: staff.user?.dob,
      gender: staff.user?.gender,
      // roleId: staff.role_id,
      email: staff.user?.email,
      phoneNumber: staff.user?.phone_number,
      address: staff.user?.address,
      branchId: staff.branch_id,
    })
  }

  const fetchRoleOptions = async () => {
    const roles = (await getRoles()).data
    setRoleOptions(roles)
  }

  const handleSubmit = useCallback(async () => {
    const data = {
      full_name: staffData.fullName,
      dob: staffData.dob,
      gender: staffData.gender,
      role_id: staffData.roleId,
      email: staffData.email,
      password: staffData.password,
      phone_number: staffData.phoneNumber,
      address: staffData.address,
      branch_id: staffData.branchId,
    }

    if (selectedFile) {
      data.avatar = selectedFile
    }

    if (staffId) {
      await updateStaff(staffId, data)
    } else {
      await createStaff(data)
    }
    setSaveStaffSuccessful(true)
    handleCloseModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffData, selectedFile, staffId])

  useEffect(() => {
    if (!selectedFile) {
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setProfilePreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  useEffect(() => {
    if (staffId) {
      fetchStaffInfo(staffId)
    }
    fetchRoleOptions()
  }, [staffId])

  return (
    <>
      {isSaveStaffSucessful && <Toast variant='success' message={`${staffId ? 'Cập nhật' : 'Thêm'} nhân viên thành công`} />}
      <RoleCreate
        isModalVisible={isRoleCreateModalVisible}
        handleCloseModal={async () => {
          await fetchRoleOptions()
          setRoleCreateModalVisible(false)
        }}
      />
      <Modal isModalVisible={isModalVisible} handleClose={handleCloseModal} title='Thêm nhân viên'>
        <Grid container>
          <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
              <div
                style={{
                  border: '1px dashed',
                  minHeight: 200,
                  marginBottom: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {staffData.avatar ? (
                  <img
                    src={profilePreview ?? `${ASSET_BASE_URL}/images/${staffData.avatar}`}
                    alt='profile-preview'
                    style={{ maxWidth: 150, minHeight: 150, maxHeight: 300 }}
                  />
                ) : (
                  <>
                    <IconButton size='medium'>
                      <CameraAltIcon />
                    </IconButton>
                    <Typography>Tải ảnh lên</Typography>
                  </>
                )}
              </div>
              {staffData.avatar ? (
                <Button variant='contained' color='secondary' onClick={() => setStaffData({ ...staffData, avatar: null })}>
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
                label='Ten nhan vien'
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22,
                  },
                }}
                value={staffData.fullName}
                onChange={(e) => setStaffData({ ...staffData, fullName: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label='Ngay sinh'
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22,
                  },
                }}
                type='date'
                fullWidth
                value={staffData.dob}
                onChange={(e) => setStaffData({ ...staffData, dob: e.target.value })}
              />
              <FormControl margin='normal'>
                <FormLabel id='demo-radio-buttons-group-label'>Gioi tinh</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-radio-buttons-group-label'
                  defaultValue='male'
                  name='radio-buttons-group'
                  value={staffData.gender}
                  onChange={(e, val) => setStaffData({ ...staffData, gender: val })}
                >
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
                    fontSize: 22,
                  },
                }}
                fullWidth
              />
              <TextField
                label='Chuc danh'
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22,
                  },
                }}
                select
                fullWidth
                SelectProps={{
                  native: true,
                  endAdornment: (
                    <IconButton style={{ marginRight: '1.5rem' }} onClick={() => setRoleCreateModalVisible(true)}>
                      <AddIcon />
                    </IconButton>
                  ),
                }}
                value={staffData.roleId}
                onChange={(e) => setStaffData({ ...staffData, roleId: e.target.value })}
              >
                {roleOptions.map((opt) => (
                  <option value={opt.id}>{opt.name}</option>
                ))}
              </TextField>
            </div>
          </Grid>
          <Grid item xs={1} />

          <Grid item xs={4}>
            <div>
              <TextField
                label='Tài khoản email hệ thống'
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22,
                  },
                }}
                fullWidth
                required
                value={staffData.email}
                onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
              />
              {!staffId && (
                <TextField
                  label='Mật khẩu'
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 22,
                    },
                  }}
                  margin='normal'
                  fullWidth
                  required
                  value={staffData.password}
                  onChange={(e) => setStaffData({ ...staffData, password: e.target.value })}
                />
              )}

              <TextField
                label='Số điện thoại'
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22,
                  },
                }}
                fullWidth
                value={staffData.phoneNumber}
                onChange={(e) => setStaffData({ ...staffData, phoneNumber: e.target.value })}
              />

              <TextField
                label='Địa chỉ'
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22,
                  },
                }}
                fullWidth
                value={staffData.address}
                onChange={(e) => setStaffData({ ...staffData, address: e.target.value })}
              />
              <TextField
                label='Chi nhánh làm việc'
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 22,
                  },
                }}
                select
                fullWidth
                SelectProps={{
                  native: true,
                  endAdornment: (
                    <IconButton style={{ marginRight: '1.5rem' }}>
                      <AddIcon />
                    </IconButton>
                  ),
                }}
                value={staffData.branchId}
                onChange={(e) => setStaffData({ ...staffData, branchId: e.target.value })}
              >
                <option value='a'>A</option>
                <option value='b'>B</option>
                <option value='c'>C</option>
              </TextField>
            </div>
          </Grid>
        </Grid>

        <div style={{ display: 'flex', float: 'right', marginTop: 2 }}>
          <Button variant='contained' color='primary' onClick={handleSubmit}>
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

export default StaffCreate


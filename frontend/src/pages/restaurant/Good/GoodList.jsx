import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, Typography, Collapse, Avatar, IconButton, CardActions, FormControlLabel, FormGroup, Icon, Button, TextField } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'

import CollapsibleCard from '../../../components/CollapsibleCard/CollapsibleCard'
import CustomTable from '../../../components/Table/CustomTable'
import './GoodList.css'
import GoodGroupCreate from './GoodGroupCreate'
import GoodCreate from './GoodCreate'
import Main from '../../../containers/Main/Main'
import CustomTreeViewCheckbox from '../../../components/CustomTreeView/CustomTreeViewCheckbox'
import { deleteGood, getGoods } from '../../../apis/good'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'

const sampleGoodGroups = {
  id: '0',
  name: 'Parent',
  children: [
    {
      id: '1',
      name: 'Child - 1'
    },
    {
      id: '3',
      name: 'Child - 3',
      children: [
        {
          id: '4',
          name: 'Child - 4',
          children: [
            {
              id: '7',
              name: 'Child - 7'
            },
            {
              id: '8',
              name: 'Child - 8'
            }
          ]
        }
      ]
    },
    {
      id: '5',
      name: 'Child - 5',
      children: [
        {
          id: '6',
          name: 'Child - 6'
        }
      ]
    },
    {
      id: '9',
      name: 'Child - 9',
      children: [
        {
          id: '10',
          name: 'Child - 10',
          children: [
            {
              id: '11',
              name: 'Child - 11'
            },
            {
              id: '12',
              name: 'Child - 12'
            }
          ]
        }
      ]
    }
  ]
}

const cols = [
  { id: 'id', label: 'STT', isSortable: true },
  { id: 'name', label: 'Ten bep', isSortable: true },
  { id: 'type', label: 'Loai', isSortable: true }
]

function GoodList({ children }) {
  const [isCollapse, setCollapse] = useState(false)
  const [isGoodGroupModalVisible, setGoodGroupModalVisible] = useState(false)
  const [isGoodModalVisible, setGoodModalVisible] = useState(false)
  const [selectedGoodGroups, setSelectedGoodGroups] = useState([])
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [goodList, setGoodList] = useState([])
  const [selected, setSelected] = useState(null)

  const fetchGoodList = async () => {
    const res = await getGoods()
    console.log(res)
  }

  const handleDeleteGood = async (id) => {
    if (id) {
      await deleteGood(id)
      setDeleteDialogVisible(false)
    }
  }

  const actionButtons = [
    {
      name: 'Chi tiet',
      variant: 'contained',
      color: 'primary',
      clickHandler: (id) => {
        setSelected(id)
        setGoodModalVisible(true)
      }
    },
    {
      name: 'Xoa',
      variant: 'contained',
      color: 'secondary',
      clickHandler: (id) => {
        setSelected(id)
        setDeleteDialogVisible(true)
      }
    }
  ]

  useEffect(() => {
    fetchGoodList()
  }, [])

  return (
    <Main>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa hàng hóa'
        confirmTitle='Xóa'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa hàng hóa này?'
        handleConfirm={() => handleDeleteGood(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <GoodCreate isModalVisible={isGoodModalVisible} handleCloseModal={() => setGoodModalVisible(false)} />
      <GoodGroupCreate isModalVisible={isGoodGroupModalVisible} handleCloseModal={() => setGoodGroupModalVisible(false)} />
      <div className='good__list__container'>
        <div className='filter__section'>
          <div>
            <CollapsibleCard title='Tìm kiếm' isCollapse={false}>
              <TextField id='standard-basic' placeholder='Tìm kiếm theo mã, tên hàng hóa' />
            </CollapsibleCard>
          </div>
          <div>
            <CollapsibleCard title='Loại thực đơn' isCollapsible={true}>
              <FormGroup row={false}>
                <FormControlLabel control={<Checkbox />} label='Do an' />
                <FormControlLabel control={<Checkbox />} label='Do uong' />
                <FormControlLabel control={<Checkbox />} label='khac' />
              </FormGroup>
            </CollapsibleCard>
          </div>
          <div>
            <CollapsibleCard title='Nhóm hàng' isCollapsible={true} additionalActions={[{ Icon: AddCircleOutlineIcon, clickHandler: () => setGoodGroupModalVisible(true) }]}>
              <CustomTreeViewCheckbox data={sampleGoodGroups} selected={selectedGoodGroups} setSelected={(arr) => setSelectedGoodGroups(arr)} />
              {/* <FormGroup row={false}>
                <FormControlLabel control={<Checkbox />} label='Hang hoa thuong' />
                <FormControlLabel control={<Checkbox />} label='Che bien' />
                <FormControlLabel control={<Checkbox />} label='Combo' />
              </FormGroup> */}
            </CollapsibleCard>
          </div>
        </div>
        <div className='list_container'>
          <div className='list__header' style={{ marginBottom: 10 }}>
            <Typography variant='h5'>Hàng hóa</Typography>
            <div>
              <Button size='small' variant='contained' onClick={() => setGoodModalVisible(true)}>
                Them moi
              </Button>
              <Button size='small' variant='contained'>
                Import
              </Button>
              <Button size='small' variant='contained'>
                Xuat file
              </Button>
            </div>
          </div>
          <div className='list__content'>
            <CustomTable rows={goodList} cols={cols} actionButtons={actionButtons} />
          </div>
        </div>
      </div>
    </Main>
  )
}

export default GoodList

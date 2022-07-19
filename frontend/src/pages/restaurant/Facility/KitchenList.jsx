import { Button, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { getKitchens, deleteKitchen } from '../../../apis/kitchen'
import CustomTable from '../../../components/Table/CustomTable'
import KitchenCreate from './KitchenCreate'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'

const cols = [
  { id: 'id', label: 'STT', isSortable: true },
  { id: 'name', label: 'Ten bep', isSortable: true },
  { id: 'type', label: 'Loai', isSortable: true },
]

function KitchenList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [kitchenList, setKitchenList] = useState([])
  const [selected, setSelected] = useState(null)

  const fetchKitchenList = async () => {
    const res = await getKitchens()

    setKitchenList(res.data)
  }

  const handleDeleteKitchen = async (id) => {
    if (id) {
      await deleteKitchen(id)
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
        setCreateModalVisible(true)
      },
    },
    {
      name: 'Xoa',
      variant: 'contained',
      color: 'secondary',
      clickHandler: (id) => {
        setSelected(id)
        setDeleteDialogVisible(true)
      },
    },
  ]

  useEffect(() => {
    fetchKitchenList()
  }, [])

  return (
    <div>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xoa bep'
        confirmTitle='Xoa'
        cancelTitle='Huy bo'
        description='Ban co chac chan muon xoa bep nay?'
        handleConfirm={() => handleDeleteKitchen(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <KitchenCreate
        kitchenId={selected}
        isModalVisible={isCreateModalVisible}
        handleCloseModal={() => {
          setSelected(null)
          setCreateModalVisible(false)
        }}
      />
      <div className='list__header' style={{ justifyContent: 'flex-end' }}>
        <div>
          <Button size='small' variant='contained' onClick={() => setCreateModalVisible(true)}>
            Thêm mới
          </Button>
          <Button size='small' variant='contained'>
            Import
          </Button>
        </div>
      </div>

      <div>
        {kitchenList.length > 0 ? (
          <CustomTable rows={kitchenList} cols={cols} actionButtons={actionButtons} />
        ) : (
          <Typography variant='h6'>Khong co du lieu</Typography>
        )}
      </div>
    </div>
  )
}

export default KitchenList


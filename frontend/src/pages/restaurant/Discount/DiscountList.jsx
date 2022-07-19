import { Button, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { deleteDiscount, getDiscounts } from '../../../apis/discount'
import CustomTable from '../../../components/Table/CustomTable'
import DiscountCreate from './DiscountCreate'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import Main from '../../../containers/Main/Main'

const cols = [
  { id: 'id', label: 'STT', isSortable: true },
  { id: 'name', label: 'Ten khuyen mai', isSortable: true },
  { id: 'type', label: 'Loai', isSortable: true },
]

function DiscountList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [discountList, setDiscountList] = useState([])
  const [selected, setSelected] = useState(null)

  const fetchDiscountList = async () => {
    const res = await getDiscounts()
    setDiscountList(res.data)
  }

  const handleDeleteDiscount = async (id) => {
    if (id) {
      await deleteDiscount(id)
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
    fetchDiscountList()
  }, [])

  return (
    <Main>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xoa khuyen mai'
        confirmTitle='Xoa'
        cancelTitle='Huy bo'
        description='Ban co chac chan muon xoa khuyen mai nay?'
        handleConfirm={() => handleDeleteDiscount(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <DiscountCreate
        discountId={selected}
        isModalVisible={isCreateModalVisible}
        handleCloseModal={() => {
          setSelected(null)
          setCreateModalVisible(false)
        }}
      />
      <div className='list__header'>
        <Typography variant='h5'>Khuyến mãi</Typography>
        <div>
          <Button variant='contained' color='primary' onClick={() => setCreateModalVisible(true)}>
            Thêm mới
          </Button>
        </div>
      </div>

      <div>
        {discountList.length > 0 ? (
          <CustomTable rows={discountList} cols={cols} actionButtons={actionButtons} />
        ) : (
          <Typography variant='h6'>Khong co du lieu</Typography>
        )}
      </div>
    </Main>
  )
}

export default DiscountList


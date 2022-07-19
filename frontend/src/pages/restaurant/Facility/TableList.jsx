import { Button, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { getTables, deleteTable } from '../../../apis/table'
import CustomTable from '../../../components/Table/CustomTable'
import TableCreate from './TableCreate'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'

const cols = [
  { id: 'id', label: 'Mã bàn', isSortable: true },
  { id: 'name', label: 'Tên bàn', isSortable: true },
  { id: 'floor_num', label: 'Tầng', isSortable: true },
  { id: 'order', label: 'Thứ tự', isSortable: true },
]

function TableList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [tableList, setTableList] = useState([])
  const [selected, setSelected] = useState(null)

  const fetchTableList = async () => {
    const res = await getTables()
    setTableList(res.data)
  }

  const handleDeleteTable = async (id) => {
    if (id) {
      await deleteTable(id)
      setDeleteDialogVisible(false)
    }
  }

  const actionButtons = [
    {
      name: 'Chi tiết',
      variant: 'contained',
      color: 'primary',
      clickHandler: (id) => {
        setSelected(id)
        setCreateModalVisible(true)
      },
    },
    {
      name: 'Xóa',
      variant: 'contained',
      color: 'secondary',
      clickHandler: (id) => {
        setSelected(id)
        setDeleteDialogVisible(true)
      },
    },
  ]

  useEffect(() => {
    fetchTableList()
  }, [])

  return (
    <div>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa bàn'
        confirmTitle='Xóa'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa bàn này?'
        handleConfirm={() => handleDeleteTable(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <TableCreate
        tableId={selected}
        isModalVisible={isCreateModalVisible}
        handleCloseModal={() => {
          setSelected(null)
          setCreateModalVisible(false)
        }}
      />
      <div className='list__header'>
        {/* <Typography variant='h5'>Bàn ăn</Typography> */}
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
        <CustomTable rows={tableList} cols={cols} actionButtons={actionButtons} />
      </div>
    </div>
  )
}

export default TableList


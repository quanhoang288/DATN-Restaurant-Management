import React, { useEffect, useState } from 'react'
import { Typography, FormControlLabel, FormGroup, Button, TextField } from '@material-ui/core'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend, NativeTypes } from 'react-dnd-html5-backend'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'

import CollapsibleCard from '../../../components/CollapsibleCard/CollapsibleCard'
import CustomTable from '../../../components/Table/CustomTable'
import GoodGroupCreate from './GoodGroupCreate'
import GoodCreate from './GoodCreate'
import Main from '../../../containers/Main/Main'
import CustomTreeViewCheckbox from '../../../components/CustomTreeView/CustomTreeViewCheckbox'
import { deleteGood, getGoods } from '../../../apis/good'
import ConfirmDialog from '../../../components/Modal/ConfirmDialog'
import './GoodList.css'
import Modal from '../../../components/Modal/Modal'
import { ASSET_BASE_URL } from '../../../configs'

const cols = [
  { id: 'id', label: 'STT', isSortable: true },
  { id: 'name', label: 'Ten bep', isSortable: true },
  { id: 'type', label: 'Loai', isSortable: true },
]

function ImportModal({ isModalVisible, handleCloseModal, handleSelectFile, fileToImport, handleRemoveFile, handleDownloadTemplateFile }) {
  const [_, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item) {
        if (handleSelectFile) {
          handleSelectFile(item.files[0])
        }
      },
      canDrop(item) {
        console.log('canDrop', item.files, item.items)
        return true
      },

      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }
      },
    }),
    []
  )

  useEffect(() => {
    console.log('file: ', fileToImport)
  }, [fileToImport])

  return (
    <Modal title='Thêm mới từ file' isModalVisible={isModalVisible} handleClose={handleCloseModal}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <a href={`${ASSET_BASE_URL}/templates/good-import-template.xlsx`} title='Tải file mẫu' download='Them-moi-hang-hoa-template.xlsx'>
          Tải file mẫu
        </a>
      </div>
      <div
        ref={drop}
        style={{
          minHeight: 400,
          border: '1px dashed #dfdfdf',
          borderRadius: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          {fileToImport ? (
            <>
              <Typography style={{ fontWeight: 400 }}>{fileToImport.name} </Typography>
              <Button variant='contained' onClick={handleRemoveFile}>
                Tải file khác
              </Button>
            </>
          ) : (
            <>
              <Typography style={{ fontWeight: 400 }}>Kéo thả tại đây </Typography>
              <Button
                component='label'
                onChange={(e) => handleSelectFile(e.target.files[0])}
                style={{ fontWeight: 400, color: 'rgba(34,117,215,.9)', cursor: 'pointer' }}
              >
                <Typography> hoặc thêm file từ máy tính</Typography>
                <input type='file' name='file' hidden />
              </Button>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', float: 'right', marginTop: 2 }}>
        <Button variant='contained' color='primary'>
          Lưu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Đóng
        </Button>
      </div>
    </Modal>
  )
}

function GoodList({ children }) {
  const [isGoodGroupModalVisible, setGoodGroupModalVisible] = useState(false)
  const [isGoodModalVisible, setGoodModalVisible] = useState(false)
  const [selectedGoodGroups, setSelectedGoodGroups] = useState([])
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [isImportModalVisible, setImportModalVisible] = useState(false)
  const [goodList, setGoodList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [selected, setSelected] = useState(null)
  const [fileToImport, setFileToImport] = useState(null)

  const handleDownloadTemplateFile = () => {}

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

  const fetchCurPage = async (page, perPage) => {
    const res = (await getGoods({ page, perPage })).data
    setGoodList(res.data || [])
    setTotalCount(res.total)
  }

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
      <DndProvider backend={HTML5Backend}>
        <ImportModal
          isModalVisible={isImportModalVisible}
          handleCloseModal={() => setImportModalVisible(false)}
          handleSelectFile={(file) => setFileToImport(file)}
          fileToImport={fileToImport}
          handleRemoveFile={() => setFileToImport(null)}
          handleDownloadTemplateFile={handleDownloadTemplateFile}
        />
      </DndProvider>
      <GoodCreate goodId={selected} isModalVisible={isGoodModalVisible} handleCloseModal={() => setGoodModalVisible(false)} />
      <GoodGroupCreate isModalVisible={isGoodGroupModalVisible} handleCloseModal={() => setGoodGroupModalVisible(false)} />
      <div className='good__list__container'>
        <div className='list__container'>
          <div className='list__header'>
            <Typography variant='h5'>Hàng hóa</Typography>
            <div>
              <Button size='small' variant='contained' onClick={() => setGoodModalVisible(true)}>
                Thêm mới
              </Button>
              <Button size='small' variant='contained' onClick={() => setImportModalVisible(true)}>
                Import
              </Button>
              <Button size='small' variant='contained'>
                Xuất file
              </Button>
            </div>
          </div>
          <div className='list__content'>
            <CustomTable rows={goodList} totalCount={totalCount} cols={cols} actionButtons={actionButtons} handleFetchRows={fetchCurPage} />
          </div>
        </div>
      </div>
    </Main>
  )
}

export default GoodList


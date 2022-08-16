import React, { useCallback, useEffect, useState } from "react";
import {
  Typography,
  FormControlLabel,
  FormGroup,
  Button,
  TextField,
} from "@material-ui/core";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend, NativeTypes } from "react-dnd-html5-backend";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import CollapsibleCard from "../../../components/CollapsibleCard/CollapsibleCard";
import CustomTable from "../../../components/Table/CustomTable";
import GoodGroupCreate from "./GoodGroupCreate";
import GoodCreate from "./GoodCreate";
import Main from "../../../containers/Main/Main";
import CustomTreeViewCheckbox from "../../../components/CustomTreeView/CustomTreeViewCheckbox";
import { deleteGood, getGoods } from "../../../apis/good";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import "./GoodList.css";
import Modal from "../../../components/Modal/Modal";
import { ASSET_BASE_URL } from "../../../configs";
import { getGoodGroups } from "../../../apis/good-group";
import { parseSearchParams } from "../../../utils/parseSearchParams";

const cols = [
  { id: "id", label: "ID", isSortable: true },
  { id: "image", label: "", type: "image", isSortable: false },
  { id: "name", label: "Tên hàng hóa", isSortable: true },
  {
    id: "type",
    label: "Loại",
    isSortable: true,
    type: "chip",
    variantMapping: [
      {
        value: "fresh_served",
        variant: "success",
      },
      { value: "ready_served", variant: "primary" },
      {
        value: "combo",
        variant: "warning",
      },
      {
        value: "ingredient",
        variant: "info",
      },
    ],
  },
  { id: "sale_price", label: "Giá bán", isSortable: true },
];

function ImportModal({
  isModalVisible,
  handleCloseModal,
  handleSelectFile,
  fileToImport,
  handleRemoveFile,
  handleDownloadTemplateFile,
}) {
  const [_, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item) {
        if (handleSelectFile) {
          handleSelectFile(item.files[0]);
        }
      },
      canDrop(item) {
        return true;
      },

      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    []
  );

  return (
    <Modal
      title='Thêm mới từ file'
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <a
          href={`${ASSET_BASE_URL}/templates/good-import-template.xlsx`}
          title='Tải file mẫu'
          download='Them-moi-hang-hoa-template.xlsx'
        >
          Tải file mẫu
        </a>
      </div>
      <div
        ref={drop}
        style={{
          minHeight: 400,
          border: "1px dashed #dfdfdf",
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {fileToImport ? (
            <>
              <Typography style={{ fontWeight: 400 }}>
                {fileToImport.name}{" "}
              </Typography>
              <Button variant='contained' onClick={handleRemoveFile}>
                Tải file khác
              </Button>
            </>
          ) : (
            <>
              <Typography style={{ fontWeight: 400 }}>
                Kéo thả tại đây{" "}
              </Typography>
              <Button
                component='label'
                onChange={(e) => handleSelectFile(e.target.files[0])}
                style={{
                  fontWeight: 400,
                  color: "rgba(34,117,215,.9)",
                  cursor: "pointer",
                }}
              >
                <Typography> hoặc thêm file từ máy tính</Typography>
                <input type='file' name='file' hidden />
              </Button>
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", float: "right", marginTop: 2 }}>
        <Button variant='contained' color='primary'>
          Lưu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
}

const defaultSearchParams = {
  id: "",
  good_group_id: "",
  type: "",
};

function GoodList({ children }) {
  const [isGoodGroupModalVisible, setGoodGroupModalVisible] = useState(false);
  const [isGoodModalVisible, setGoodModalVisible] = useState(false);
  const [selectedGoodGroups, setSelectedGoodGroups] = useState([]);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isImportModalVisible, setImportModalVisible] = useState(false);
  const [goodList, setGoodList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [fileToImport, setFileToImport] = useState(null);
  const [goodGroupOptions, setGoodGroupOptions] = useState([]);
  const [searchParams, setSearchParams] = useState(defaultSearchParams);
  const [isSaveSuccessful, setSaveSuccessful] = useState(false);

  const handleDownloadTemplateFile = () => {};

  const handleDeleteGood = async (id) => {
    if (id) {
      await deleteGood(id);
      setDeleteDialogVisible(false);
    }
  };

  const actionButtons = [
    {
      name: "Chi tiết",
      variant: "contained",
      color: "primary",
      clickHandler: (id) => {
        setSelected(id);
        setGoodModalVisible(true);
      },
    },
    {
      name: "Xóa",
      variant: "contained",
      color: "secondary",
      clickHandler: (id) => {
        setSelected(id);
        setDeleteDialogVisible(true);
      },
    },
  ];

  const fetchGoodGroupOptions = async () => {
    const options = (await getGoodGroups()).data;
    setGoodGroupOptions(options.map((opt) => ({ id: opt.id, name: opt.name })));
  };

  const fetchCurPage = async (page, perPage, searchParams = {}) => {
    const filters = parseSearchParams(searchParams);
    const res = (
      await getGoods({ page, perPage, filters: JSON.stringify(filters) })
    ).data;

    setGoodList(
      (res.data || []).map((good) => ({
        ...good,
        type:
          good.type === "fresh_served"
            ? {
                name: "Hàng chế biến",
                value: "fresh_served",
              }
            : good.type === "ready_served"
            ? {
                name: "Phục vụ ngay",
                value: "ready_served",
              }
            : good.type === "combo"
            ? {
                name: "Combo",
                value: "combo",
              }
            : {
                name: "Nguyên liệu",
                value: "ingredient",
              },
      }))
    );
    setTotalCount(res.total);
  };

  useEffect(() => {
    fetchGoodGroupOptions();
  }, []);

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
      <GoodCreate
        goodId={selected}
        isModalVisible={isGoodModalVisible}
        handleCloseModal={(success = false) => {
          setGoodModalVisible(false);
          if (success) {
            setSaveSuccessful(true);
            fetchCurPage(1, 5);
          }
        }}
      />
      <GoodGroupCreate
        isModalVisible={isGoodGroupModalVisible}
        handleCloseModal={() => setGoodGroupModalVisible(false)}
      />
      <div className='good__list__container'>
        <div className='list__container'>
          <div className='list__header'>
            <Typography variant='h5'>Hàng hóa</Typography>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", flex: 1 }}>
              <TextField
                label='Mã/Tên hàng hóa'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                variant='standard'
                style={{ marginRight: 20 }}
                value={searchParams.id}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    id: Number.parseInt(e.target.value) || "",
                  })
                }
              />
              <TextField
                label='Nhóm hàng hóa'
                select
                SelectProps={{
                  native: true,
                }}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                style={{ marginRight: 20, minWidth: 200 }}
                value={searchParams.good_group_id}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    good_group_id: e.target.value,
                  })
                }
              >
                <option value=''>Tất cả</option>
                {goodGroupOptions.map((opt) => (
                  <option value={opt.id}>{opt.name}</option>
                ))}
              </TextField>
              <TextField
                label='Loại hàng hóa'
                select
                SelectProps={{
                  native: true,
                }}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                value={searchParams.type}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, type: e.target.value })
                }
              >
                <option value=''>Tất cả</option>
                <option value='fresh_served'>Hàng chế biến</option>
                <option value='ready_served'>Phục vụ ngay</option>
                <option value='combo'>Combo</option>
                <option value='ingredient'>Nguyên liệu</option>
              </TextField>
            </div>
            <div>
              <Button
                size='small'
                variant='contained'
                onClick={() => setGoodModalVisible(true)}
                color='primary'
              >
                Thêm mới
              </Button>
              <Button
                size='small'
                variant='contained'
                onClick={() => setImportModalVisible(true)}
              >
                Import
              </Button>
            </div>
          </div>
          <div className='list__content'>
            <CustomTable
              rows={goodList}
              totalCount={totalCount}
              cols={cols}
              actionButtons={actionButtons}
              handleFetchRows={fetchCurPage}
              searchParams={searchParams}
            />
          </div>
        </div>
      </div>
    </Main>
  );
}

export default GoodList;

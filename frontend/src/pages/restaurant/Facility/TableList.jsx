import { Button, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getTables, deleteTable } from "../../../apis/table";
import CustomTable from "../../../components/Table/CustomTable";
import TableCreate from "./TableCreate";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";

const cols = [
  { id: "id", label: "Mã bàn", isSortable: true },
  { id: "name", label: "Tên bàn", isSortable: true },
  { id: "floor_num", label: "Tầng", isSortable: true },
  { id: "branch", label: "Chi nhánh", isSortable: true },
];

function TableList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [tableList, setTableList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [selected, setSelected] = useState(null);

  const fetchCurPage = async (page, perPage) => {
    const res = (await getTables({ page, perPage })).data;
    setTableList(
      res.data.map((table) => ({
        ...table,
        branch: table.branch?.name,
      }))
    );
    setTotalCount(res.total);
  };

  const handleDeleteTable = async (id) => {
    if (id) {
      await deleteTable(id);
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
        setCreateModalVisible(true);
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
          setSelected(null);
          setCreateModalVisible(false);
        }}
      />
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
            label='Mã/Tên bàn'
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
            variant='standard'
            style={{ marginRight: 20 }}
          />
          <TextField
            label='Chi nhánh'
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
            style={{ marginRight: 20 }}
          >
            <option>Tất cả</option>
            <option value='pending'>Chờ xác nhận</option>
            <option value='confirmed'>Đã xác nhận (Chờ nhận bàn)</option>
            <option value='serving'>Đã nhận bàn</option>
          </TextField>
          <TextField
            label='Tầng'
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
            type='number'
            variant='standard'
            style={{ marginRight: 20 }}
          />
        </div>
        <div>
          <Button
            size='small'
            variant='contained'
            onClick={() => setCreateModalVisible(true)}
            color='primary'
          >
            Thêm mới
          </Button>
          <Button
            size='small'
            variant='contained'
            // onClick={() => setImportModalVisible(true)}
          >
            Import
          </Button>
        </div>
      </div>

      <div>
        <CustomTable
          rows={tableList}
          totalCount={totalCount}
          handleFetchRows={fetchCurPage}
          cols={cols}
          actionButtons={actionButtons}
        />
      </div>
    </div>
  );
}

export default TableList;

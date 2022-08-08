import { Button, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getKitchens, deleteKitchen } from "../../../apis/kitchen";
import CustomTable from "../../../components/Table/CustomTable";
import KitchenCreate from "./KitchenCreate";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";

const cols = [
  { id: "id", label: "STT", isSortable: true },
  { id: "name", label: "Tên khu vực chế biến", isSortable: true },
  { id: "branch", label: "Chi nhánh", isSortable: true },
  { id: "type", label: "Loại khu vực", isSortable: true },
];

function KitchenList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [kitchenList, setKitchenList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = useState(null);

  // const fetchKitchenList = async () => {
  //   const res = await getKitchens();

  //   setKitchenList(
  //     res.data.map((kitchen) => ({
  //       ...kitchen,
  //       type: kitchen.type === "food" ? "Bếp" : "Quầy pha chế",
  //       branch: kitchen.branch.name,
  //     }))
  //   );
  // };

  const fetchCurPage = async (page, perPage) => {
    const res = (await getKitchens({ page, perPage })).data;
    setKitchenList(
      res.data.map((kitchen) => ({
        ...kitchen,
        type: kitchen.type === "food" ? "Bếp" : "Quầy pha chế",
        branch: kitchen.branch.name,
      }))
    );
    setTotalCount(res.total);
  };

  const handleDeleteKitchen = async (id) => {
    if (id) {
      await deleteKitchen(id);
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
            label='Mã/Tên khu vực'
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
            label='Loại khu vực'
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
          >
            <option>Tất cả</option>
            <option value='pending'>Chờ xác nhận</option>
            <option value='confirmed'>Đã xác nhận (Chờ nhận bàn)</option>
            <option value='serving'>Đã nhận bàn</option>
          </TextField>
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
        {kitchenList.length > 0 ? (
          <CustomTable
            rows={kitchenList}
            cols={cols}
            totalCount={totalCount}
            handleFetchRows={fetchCurPage}
            actionButtons={actionButtons}
          />
        ) : (
          <Typography variant='h6'>Không có dữ liệu</Typography>
        )}
      </div>
    </div>
  );
}

export default KitchenList;

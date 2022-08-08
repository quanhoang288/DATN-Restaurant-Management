import { Button, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/Table/CustomTable";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import InventoryCreate from "./InventoryCreate";
import { getInventories } from "../../../apis/inventory";

const cols = [
  { id: "id", label: "STT", isSortable: true },
  { id: "name", label: "Tên kho", isSortable: true },
  { id: "branch", label: "Chi nhánh", isSortable: true },
];

function InventoryList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [inventoryList, setInventoryList] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchInventoryList = async () => {
    const inventories = (await getInventories()).data;
    setInventoryList(
      inventories.map((inventory) => ({
        ...inventory,
        branch: inventory.branch.name,
      }))
    );
  };

  const handleDeleteInventory = async (id) => {
    if (id) {
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

  useEffect(() => {
    fetchInventoryList();
  }, []);

  return (
    <div>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa kho'
        confirmTitle='Xóa'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa kho này không?'
        handleConfirm={() => handleDeleteInventory(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <InventoryCreate
        inventoryId={selected}
        isModalVisible={isCreateModalVisible}
        handleCloseModal={() => {
          setSelected(null);
          setCreateModalVisible(false);
          fetchInventoryList();
        }}
      />
      {/* <div className='list__header' style={{ justifyContent: "flex-end" }}>
        <div>
          <Button
            size='small'
            variant='contained'
            onClick={() => setCreateModalVisible(true)}
          >
            Thêm mới
          </Button>
          <Button size='small' variant='contained'>
            Import
          </Button>
        </div>
      </div> */}

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
            label='Mã/Tên kho'
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
        </div>
        <div>
          <Button
            size='small'
            variant='contained'
            onClick={() => setCreateModalVisible(true)}
          >
            Thêm mới
          </Button>
          <Button size='small' variant='contained'>
            Import
          </Button>
        </div>
      </div>

      <div>
        {inventoryList.length > 0 ? (
          <CustomTable
            rows={inventoryList}
            cols={cols}
            actionButtons={actionButtons}
          />
        ) : (
          <Typography variant='h6'>Không có dữ liệu</Typography>
        )}
      </div>
    </div>
  );
}

export default InventoryList;

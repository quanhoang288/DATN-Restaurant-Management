import { Button, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/Table/CustomTable";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import InventoryHistoryCreate from "./InventoryHistoryCreate";
import { getInventoryHistories } from "../../../apis/inventory-history";
import { parseSearchParams } from "../../../utils/parseSearchParams";
import { formatDate } from "../../../utils/date";

const cols = [
  { id: "id", label: "Mã nhập kho", isSortable: true },
  { id: "provider", label: "Nhà cung cấp", isSortable: true },
  // { id: "type", label: "Loại", isSortable: true },
  { id: "source_inventory", label: "Kho xuất hàng", isSortable: true },
  { id: "target_inventory", label: "Kho nhập hàng", isSortable: true },
  { id: "import_time", label: "Thời gian nhập hàng", isSortable: true },
  {
    id: "status",
    label: "Trạng thái",
    isSortable: true,
    type: "chip",
    variantMapping: [
      {
        value: "done",
        variant: "success",
      },
      { value: "temp", variant: "info" },
      {
        value: "cancelled",
        variant: "failure",
      },
    ],
  },
];

// const testInventoryHistories = [
//   {
//     id: 1,
//     type: "provider",
//     provider: "Provider 1",
//     target_inventory: "Kho đông lạnh - Chi nhánh Hà Nội",
//     source_inventory: null,
//     import_time: "08/01/2022 17:22",
//     status: {
//       name: "Đã nhập hàng",
//       value: "imported",
//     },
//   },
//   {
//     id: 2,
//     type: "provider",
//     provider: "Provider 2",
//     source_inventory: null,

//     target_inventory: "Kho đông lạnh - Chi nhánh Hà Nội",
//     import_time: "08/02/2022 10:22",
//     status: {
//       name: "Đã nhập hàng",
//       value: "imported",
//     },
//   },
//   {
//     id: 2,
//     type: "provider",
//     provider: "Provider 3",
//     source_inventory: null,

//     target_inventory: "Kho đông lạnh - Chi nhánh Hà Nội",
//     import_time: "08/03/2022 09:35",
//     status: {
//       name: "Đã nhập hàng",
//       value: "imported",
//     },
//   },
//   {
//     id: 3,
//     type: "provider",
//     provider: "Provider 4",
//     source_inventory: null,

//     target_inventory: "Kho đông lạnh - Chi nhánh Hà Nội",
//     import_time: "08/04/2022 08:00",
//     status: {
//       name: "Đã nhập hàng",
//       value: "imported",
//     },
//   },
//   {
//     id: 4,
//     type: "provider",
//     provider: "Provider 1",
//     source_inventory: null,

//     target_inventory: "Kho đông lạnh - Chi nhánh Đà Nẵng",
//     import_time: "08/05/2022 17:22",
//     status: {
//       name: "Đã nhập hàng",
//       value: "imported",
//     },
//   },
//   {
//     id: 5,
//     type: "provider",
//     provider: "Provider 1",
//     source_inventory: null,

//     target_inventory: "Kho đông lạnh - Chi nhánh TP.HCM",
//     import_time: "08/06/2022 17:22",
//     status: {
//       name: "Đã nhập hàng",
//       value: "imported",
//     },
//   },
// ];

function InventoryHistoryList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [inventoryHistoryList, setInventoryHistoryList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useState({});

  const fetchInventoryHistoryList = async () => {
    const inventoryHistories = (await getInventoryHistories()).data;
    setInventoryHistoryList(inventoryHistories);
  };

  const fetchCurPage = async (page, perPage, searchParams = {}) => {
    const filters = parseSearchParams(searchParams);
    const res = (
      await getInventoryHistories({
        page,
        perPage,
        filters: JSON.stringify(filters),
      })
    ).data;

    if (res) {
      setInventoryHistoryList(
        res.data.map((history) => ({
          ...history,
          source_inventory: history.sourceInventory?.name,
          target_inventory: history.targetInventory?.name,
          import_time: formatDate(history.created_at, "DD/MM/YYYY hh:mm"),
          status:
            history.status === "temp"
              ? {
                  name: "Phiếu tạm",
                  value: "temp",
                }
              : history.status === "done"
              ? {
                  name: "Đã hoàn tất",
                  value: "done",
                }
              : {
                  name: "Đã hủy",
                  value: "canceled",
                },
        }))
      );

      setTotalCount(res.total);
    }
  };

  const handleDeleteInventoryHistory = async (id) => {
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
    fetchInventoryHistoryList();
  }, []);

  return (
    <div>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa thông tin nhập kho'
        confirmTitle='Xóa'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa thông tin nhập kho kho này không?'
        handleConfirm={() => handleDeleteInventoryHistory(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <InventoryHistoryCreate
        inventoryHistoryId={selected}
        isModalVisible={isCreateModalVisible}
        handleCloseModal={() => {
          setSelected(null);
          setCreateModalVisible(false);
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
            label='Mã phiếu nhập kho'
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
            label='Nhà cung cấp'
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
            label='Kho nhập hàng'
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
            label='Từ ngày'
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
            type='date'
            style={{ marginRight: 20 }}
          />
          <TextField
            label='Đến ngày'
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
            type='date'
            style={{ marginRight: 20 }}
          />

          <TextField
            label='Trạng thái'
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
        <CustomTable
          rows={inventoryHistoryList}
          cols={cols}
          actionButtons={actionButtons}
          handleFetchRows={fetchCurPage}
          totalCount={totalCount}
          searchParams={searchParams}
        />
      </div>
    </div>
  );
}

export default InventoryHistoryList;

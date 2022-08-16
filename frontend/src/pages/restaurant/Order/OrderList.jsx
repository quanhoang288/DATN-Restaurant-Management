import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getTables, deleteTable } from "../../../apis/table";
import CustomTable from "../../../components/Table/CustomTable";
import OrderCreate from "./OrderCreate";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import Main from "../../../containers/Main/Main";
import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import TabPanel from "../../../components/CustomTabs/TabPanel";
import { deleteOrder, getOrders } from "../../../apis/order";
import Toast from "../../../components/Toast/Toast";
import { parseSearchParams } from "../../../utils/parseSearchParams";

const cols = [
  { id: "id", label: "Mã đơn", isSortable: true },
  { id: "table", label: "Bàn", isSortable: true },
  {
    id: "type",
    label: "Loại đơn",
    isSortable: true,
    type: "chip",
    variantMapping: [
      {
        value: "dine-in",
        variant: "primary",
      },
      { value: "takeaway", variant: "info" },
      {
        value: "delivery",
        variant: "success",
      },
    ],
  },
  { id: "customer_name", label: "Tên khách hàng", isSortable: true },
  { id: "customer_phone_number", label: "SĐT", isSortable: true },
  { id: "delivery_address", label: "Địa chỉ giao hàng", isSortable: true },
  // { id: "total", label: "Tổng tiền", isSortable: true },
  {
    id: "status",
    label: "Trạng thái",
    isSortable: true,
    type: "chip",
    variantMapping: [
      {
        value: "pending",
        variant: "info",
      },
      { value: "accepted", variant: "primary" },
      { value: "rejected", variant: "failure" },
      { value: "canceled", variant: "warning" },
      {
        value: "done",
        variant: "success",
      },
    ],
  },
  {
    id: "payment_status",
    label: "Thanh toán",
    isSortable: true,
    type: "chip",
    variantMapping: [
      {
        value: "pending",
        variant: "info",
      },
      { value: "request_to_pay", variant: "primary" },
      {
        value: "paid",
        variant: "success",
      },
    ],
  },
];

function OrderList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [tableOptions, setTableOptions] = useState([]);
  const [isDeleteSuccessful, setDeleteSuccessful] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const numFloors = 4;

  const fetchCurPage = async (page, perPage, searchParams = {}) => {
    const filters = parseSearchParams({
      ...searchParams,
    });
    const res = (
      await getOrders({
        page,
        perPage,
        filters: JSON.stringify({
          ...filters,
          status: { notIn: ["canceled", "rejected"] },
        }),
      })
    ).data;

    setOrderList(
      res.data.map((order) => ({
        ...order,
        table: order.reservationTable?.table.name,
        customer_name: order.customer
          ? order.customer.user.full_name
          : order.customer_name,
        customer_phone_number: order.customer
          ? order.customer.user.phone_number
          : order.customer_phone_number,
        delivery_address:
          order.deliveryInfo?.delivery_address || order.delivery_address,
        type:
          order.type === "dine-in"
            ? {
                name: "Phục vụ tại bàn",
                value: "dine-in",
              }
            : order.type === "delivery"
            ? {
                name: "Giao đi",
                value: "delivery",
              }
            : {
                name: "Mang về",
                value: "takeaway",
              },
        status:
          order.status === "pending"
            ? {
                name: "Chờ xử lý",
                value: "pending",
              }
            : order.status === "accepted"
            ? {
                name: "Đang phục vụ",
                value: "accepted",
              }
            : order.status === "rejected"
            ? {
                name: "Đã từ chối",
                value: "rejected",
              }
            : order.status === "canceled"
            ? {
                name: "Đã hủy",
                value: "canceled",
              }
            : {
                name: "Hoàn thành",
                value: "done",
              },
        payment_status:
          order.payment_status === "pending"
            ? {
                name: "Chưa thanh toán",
                value: "pending",
              }
            : order.payment_status === "request_to_pay"
            ? {
                name: "Yêu cầu thanh toán",
                value: "request_to_pay",
              }
            : {
                name: "Đã thanh toán",
                value: "paid",
              },
      }))
    );
    setTotalCount(res.total);
  };

  const fetchTableOptions = async (floorNum) => {
    const res = await getTables();
    setTableOptions(res.data);
  };

  const handleDeleteOrder = async (id) => {
    if (id) {
      // TODO: delete order api call
      await deleteOrder(id);
      setDeleteDialogVisible(false);
      setDeleteSuccessful(true);
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
    if (selectedFloor !== null) {
      fetchTableOptions(selectedFloor);
    }
  }, [selectedFloor]);

  // useEffect(() => {
  //   if (isDeleteSuccessful) {
  //     console.log("delete successful");
  //     // fetchOrderList();
  //   }
  // }, [isDeleteSuccessful]);

  return (
    <Main>
      {isDeleteSuccessful && (
        <Toast
          variant='success'
          message='Xóa đơn phục vụ thành công'
          handleClose={() => setDeleteSuccessful(false)}
        />
      )}
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa đơn phục vụ'
        confirmTitle='Xóa'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa đơn này?'
        handleConfirm={() => handleDeleteOrder(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      {isCreateModalVisible && (
        <OrderCreate
          orderId={selected}
          isModalVisible={isCreateModalVisible}
          handleCloseModal={() => {
            setSelected(null);
            setCreateModalVisible(false);
          }}
        />
      )}

      <div className='list__header'>
        <Typography variant='h5'>Đơn phục vụ</Typography>
      </div>

      <div
        style={{
          display: "flex",
          marginBottom: "2rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flex: 1 }}>
          <TextField
            label='Khách hàng'
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
            label='SĐT'
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
            label='Bàn'
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
            <option value=''>Tất cả</option>
            {tableOptions.map((opt) => (
              <option value={opt.id}>{opt.name}</option>
            ))}
          </TextField>
          <TextField
            label='Trạng thái'
            select
            SelectProps={{
              native: true,
              placeholder: "Chọn trạng thái",
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
            <option value='in_progress'>Đang chế biến</option>
            <option value='done'>Đã hoàn thành</option>
          </TextField>
        </div>

        <Button
          variant='contained'
          color='primary'
          onClick={() => setCreateModalVisible(true)}
        >
          Thêm mới
        </Button>
      </div>

      <div>
        <CustomTable
          rows={orderList}
          cols={cols}
          actionButtons={actionButtons}
          handleFetchRows={fetchCurPage}
          totalCount={totalCount}
          searchParams={searchParams}
        />
      </div>
    </Main>
  );
}

export default OrderList;

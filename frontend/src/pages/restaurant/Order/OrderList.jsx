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
  { id: "reservation_table_id", label: "Mã bàn", isSortable: true },
  { id: "type", label: "Loại đơn", isSortable: true },
  { id: "customer_name", label: "Tên khách hàng", isSortable: true },
  { id: "customer_phone_number", label: "SĐT", isSortable: true },
  { id: "delivery_address", label: "Địa chỉ giao hàng", isSortable: true },

  {
    id: "prepare_status",
    label: "Trạng thái",
    isSortable: true,
    type: "chip",
    variantMapping: [
      {
        value: "pending",
        variant: "info",
      },
      { value: "in_progress", variant: "primary" },
      {
        value: "done",
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

  const fetchOrderList = async () => {
    const res = await getOrders();
    setOrderList(
      res.data.map((order) => ({
        ...order,
        type:
          order.type === "dine-in"
            ? "Phục vụ tại bàn"
            : order.type === "delivery"
            ? "Giao đi"
            : "Mang về",
        prepare_status:
          order.prepare_status === "pending"
            ? {
                name: "Chờ chế biến",
                value: "pending",
              }
            : order.prepare_status === "in_progress"
            ? {
                name: "Đang chế biến",
                value: "in_progress",
              }
            : {
                name: "Hoàn thành",
                value: "done",
              },
      }))
    );
  };

  const fetchCurPage = async (page, perPage, searchParams = {}) => {
    const filters = parseSearchParams(searchParams);
    const res = (
      await getOrders({ page, perPage, filters: JSON.stringify(filters) })
    ).data;

    setOrderList(
      res.data.map((order) => ({
        ...order,
        type:
          order.type === "dine-in"
            ? "Phục vụ tại bàn"
            : order.type === "delivery"
            ? "Giao đi"
            : "Mang về",
        prepare_status:
          order.prepare_status === "pending"
            ? {
                name: "Chờ chế biến",
                value: "pending",
              }
            : order.prepare_status === "in_progress"
            ? {
                name: "Đang chế biến",
                value: "in_progress",
              }
            : {
                name: "Hoàn thành",
                value: "done",
              },
      }))
    );
    setTotalCount(res.total);
  };
  // const refreshOrderList = async () => {
  //   const res = await getOrders()
  //   setOrderList(
  //     res.data.map((order) => ({
  //       ...order,
  //       type: order.type === 'dine-in' ? 'Phục vụ tại bàn' : order.type === 'delivery' ? 'Giao đi' : 'Mang về',
  //       prepare_status:
  //         order.prepare_status === 'pending'
  //           ? {
  //               name: 'Chờ chế biến',
  //               value: 'pending',
  //             }
  //           : order.prepare_status === 'in_progress'
  //           ? {
  //               name: 'Đang chế biến',
  //               value: 'in_progress',
  //             }
  //           : {
  //               name: 'Hoàn thành',
  //               value: 'done',
  //             },
  //     }))
  //   )
  //   setDeleteSuccessful(false)
  // }

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
    fetchOrderList();
  }, []);

  useEffect(() => {
    if (selectedFloor !== null) {
      fetchTableOptions(selectedFloor);
    }
  }, [selectedFloor]);

  useEffect(() => {
    if (isDeleteSuccessful) {
      console.log("delete successful");
      fetchOrderList();
    }
  }, [isDeleteSuccessful]);

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
      <OrderCreate
        orderId={selected}
        isModalVisible={isCreateModalVisible}
        handleCloseModal={() => {
          setSelected(null);
          setCreateModalVisible(false);
        }}
      />
      <div className='list__header'>
        <Typography variant='h5'>Đơn phục vụ</Typography>
      </div>
      <CustomTabs
        labels={["Danh sách đơn", "Sơ đồ"]}
        activeTab={activeTab}
        onChangeActiveTab={(val) => setActiveTab(val)}
      >
        <TabPanel value={activeTab} index={0}>
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
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <div>
            <div style={{ display: "flex", marginTop: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", marginRight: 50 }}>
                <Typography>Toàn bộ nhà hàng: Trống 38/38 bàn</Typography>
                <Typography>Tầng 2: Trống 12/12 bàn</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                  <div
                    style={{ height: 20, width: 20, backgroundColor: "blue" }}
                  ></div>
                  <Typography>Bàn trống</Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{ height: 20, width: 20, backgroundColor: "grey" }}
                  ></div>
                  <Typography>Bàn đang phục vụ</Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{ height: 20, width: 20, backgroundColor: "orange" }}
                  ></div>
                  <Typography>Bàn đặt trước</Typography>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: 20 }}>
              <List
                component='nav'
                style={{
                  minWidth: 150,
                  borderRight: "1px solid",
                  textAlign: "center",
                }}
              >
                {[...Array(numFloors).keys()].map((floorIdx) => (
                  <ListItem button selected={selectedFloor === floorIdx + 1}>
                    <ListItemText
                      primary={`Tầng ${floorIdx + 1}`}
                      onClick={() => setSelectedFloor(floorIdx + 1)}
                    />
                  </ListItem>
                ))}
              </List>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  rowGap: 20,
                  alignItems: "center",
                  flex: 1,
                  marginLeft: 10,
                }}
                className='table__list'
              >
                {(tableOptions || []).map((opt) => (
                  <div
                    style={{
                      height: 80,
                      width: 80,
                      borderRadius: "50%",
                      backgroundColor: "blue",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "auto",
                    }}
                    className='table__item'
                  >
                    <Typography>{opt.name}</Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabPanel>
      </CustomTabs>
    </Main>
  );
}

export default OrderList;

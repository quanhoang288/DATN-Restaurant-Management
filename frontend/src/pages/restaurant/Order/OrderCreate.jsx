import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import RedeemIcon from "@material-ui/icons/Redeem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

import { Autocomplete } from "@material-ui/lab";
import { getMenu, getMenus } from "../../../apis/menu";
import { getTables } from "../../../apis/table";
import TabPanel from "../../../components/CustomTabs/TabPanel";
import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import {
  convertToOrderDTO,
  fromDTOToStateData,
} from "../../../utils/converter/convertToOrderDTO";
import {
  createOrder,
  getOrder,
  updateOrder,
  updateOrderItem,
} from "../../../apis/order";
import OrderPayment from "./OrderPayment";
import ChipLabel from "../../../components/ChipLabel/ChipLabel";
import Toast from "../../../components/Toast/Toast";
import { getDiscounts } from "../../../apis/discount";
import { createNotification } from "../../../apis/notification";
import { useWebsocket } from "../../../utils/websocket.context";
import { getStaffList } from "../../../apis/staff";
import { getRoles } from "../../../apis/role";
import DiscountOptionModal from "./DiscountOption";
import OrderDiscounts from "./OrderDiscounts";
import { useSelector } from "react-redux";
import { getCustomers } from "../../../apis/customer";
import { parseSearchParams } from "../../../utils/parseSearchParams";
import { getBranches } from "../../../apis/branch";
import { getDiscountAmount, getInvoiceTotal } from "../../../utils/order";

const defaultData = {
  type: "dine-in",
  branchId: null,
  details: [],
  table: null,
  note: "",
  customerId: null,
  customerName: null,
  customerPhoneNumber: null,
  shipperId: null,
  deliveryInfoId: null,
  deliveryAddress: null,
  discounts: [],
  createdByCustomer: 0,
  status: "accepted",
};

function CancelAmountModal(props) {
  const {
    isModalVisible,
    handleCloseModal,
    cancelQuantity,
    handleChangeCancelQuantity,
    handleCancelOrderItem,
  } = props;
  return (
    <Modal
      isModalVisible={isModalVisible}
      title='Hủy món'
      handleCloseModal={handleCloseModal}
    >
      <div>
        <TextField
          label='Số lượng hủy'
          placeholder='Nhập số lượng hủy'
          fullWidth
          type='number'
          value={cancelQuantity}
          onChange={(e) => handleChangeCancelQuantity(e.target.value)}
        />
        <div style={{ display: "flex", float: "right", marginTop: 10 }}>
          <Button
            variant='contained'
            color='primary'
            onClick={handleCancelOrderItem}
          >
            Lưu
          </Button>
          <Button variant='contained' onClick={handleCloseModal}>
            Hủy bỏ
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function RejectReasonModal(props) {
  const { isModalVisible, handleCloseModal, handleRejectOrder } = props;
  const [reason, setReason] = useState("");

  return (
    <Modal
      title='Lí do từ chối'
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
    >
      <TextField
        label='Lí do'
        fullWidth
        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}
        onChange={(e) => setReason(e.target.value)}
      />
      <div style={{ display: "flex", float: "right", marginTop: 10 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={() => handleRejectOrder(reason)}
        >
          Lưu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
}

function OrderCreate({ orderId, isModalVisible, handleCloseModal }) {
  const [tableOptions, setTableOptions] = useState([]);
  const [menuOptions, setMenuOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [goodItems, setGoodItems] = useState([]);
  const [goodSearchKeyword, setGoodSearchKeyword] = useState("");
  const [orderData, setOrderData] = useState(defaultData);
  const [activeTab, setActiveTab] = useState(0);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isCancelAmountModalVisible, setCancelAmountModalVisible] =
    useState(false);
  const [isSaveSuccessful, setSaveSuccessful] = useState(false);
  const [cancelQuantity, setCancelQuantity] = useState(0);
  const [itemIdToCancel, setItemIdToCancel] = useState(null);
  const [orderItemToCancel, setOrderItemToCancel] = useState(null);
  const [isDiscountModalVisible, setDiscountModalVisible] = useState(false);
  const [discountOptions, setDiscountOptions] = useState([]);
  const [shipperOptions, setShipperOptions] = useState([]);
  const [isRejectModalVisible, setRejectModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValidationFailBefore, setValidationFailBefore] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerKeyword, setCustomerKeyword] = useState("");
  const [isTotalCollapseVisible, setTotalCollapseVisible] = useState(false);
  const [branchId, setBranchId] = useState(null);

  const apiError = useSelector((state) => state.error.error);
  const authUser = useSelector((state) => state.auth.user);
  const socket = useWebsocket();

  const fetchCustomerOptions = async (keyword = "") => {
    const options = keyword
      ? (
          await getCustomers({
            filters: JSON.stringify({ full_name: { like: keyword } }),
          })
        ).data
      : [];
    setCustomers(options);
  };

  const fetchDiscountOptions = async (orderId) => {
    const discounts = (await getDiscounts({ orderId })).data;
    setDiscountOptions(discounts);
  };

  const fetchBranchOptions = async () => {
    const branches = (await getBranches()).data;
    setBranchOptions(branches);
  };

  const fetchTableOptions = useCallback(async () => {
    const filters = parseSearchParams({ branch_id: orderData.branchId });
    const res = await getTables({ filters: JSON.stringify(filters) });
    setTableOptions(res.data);
  }, [orderData]);

  const fetchMenuOptions = async () => {
    const res = await getMenus();
    setMenuOptions(res.data);
  };

  const fetchCategories = async (menuId) => {
    const res = await getMenu(menuId);
    setCategories(res.data.categories);
  };

  const fetchShipperOptions = useCallback(async () => {
    const shipperRole = (
      await getRoles({
        filters: JSON.stringify({ code: "shipper" }),
      })
    ).data[0];
    if (shipperRole) {
      const shippers = (
        await getStaffList({
          filters: JSON.stringify(
            parseSearchParams({
              role_id: shipperRole.id,
              branch_id: orderData.branchId,
            })
          ),
        })
      ).data;
      setShipperOptions(shippers);
    }
  }, [orderData]);

  const fetchOrderData = async (orderId) => {
    if (orderId) {
      const res = await getOrder(orderId);
      const stateData = fromDTOToStateData(res.data);
      setOrderData(stateData);
    }
  };

  const handleAddItem = useCallback(
    (item) => {
      const itemIdx = orderData.details.findIndex(
        (orderItem) => orderItem.id === item.id
      );
      if (itemIdx !== -1) {
        const details = orderData.details;
        details[itemIdx] = {
          ...details[itemIdx],
          quantity: details[itemIdx].quantity + 1,
          status: "pending",
        };
        setOrderData({ ...orderData, details });
      } else {
        setOrderData({
          ...orderData,
          details: [
            ...orderData.details,
            {
              id: item.id,
              name: item.name,
              quantity: 1,
              finished_quantity: 0,
              sale_price: item.sale_price,
              status: "pending",
            },
          ],
        });
      }
    },
    [orderData]
  );

  const handleRemoveOrderItem = useCallback(
    (id) => {
      setOrderData({
        ...orderData,
        details: orderData.details.filter((item) => item.id !== id),
      });
    },
    [orderData]
  );

  const handleSaveOrder = useCallback(async () => {
    const orderPayload = convertToOrderDTO(orderData);
    let referencedId = orderId;

    if (orderId) {
      await updateOrder(orderId, orderPayload);
    } else {
      const orderRes = await createOrder(orderPayload);
      if (!orderRes) {
        return;
      }

      const order = orderRes.data;
      referencedId = order.id;
    }

    // const notificationRes = await createNotification({
    //   type: "order_created",
    //   order_id: referencedId,
    // });

    // if (!notificationRes) {
    //   return;
    // }
    // const notification = notificationRes.data;
    // socket.emit("NEW_NOTIFICATION", notification);

    handleCloseModal();
    setSaveSuccessful(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData, orderId]);

  const handleUpdateServeStatus = useCallback(
    async (itemId, quantity) => {
      if (orderId) {
        await updateOrderItem(orderId, itemId, {
          status: "done",
          finished_quantity: quantity,
        });
        setOrderData({
          ...orderData,
          details: orderData.details.map((item) =>
            item.id === itemId
              ? { ...item, finished_quantity: quantity, status: "done" }
              : item
          ),
        });
      }
    },
    [orderData, orderId]
  );

  const handleCancelOrderItem = useCallback(async () => {
    if (orderId && orderItemToCancel) {
      setOrderData({
        ...orderData,
        details: orderData.details.map((item) =>
          item.id === orderItemToCancel.id
            ? { ...item, quantity: item.quantity - (cancelQuantity || 0) }
            : item
        ),
      });

      setCancelAmountModalVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderItemToCancel, cancelQuantity, orderId, orderData]);

  const handleSelectDiscountOption = useCallback(
    (option, checked) => {
      setOrderData({
        ...orderData,
        discounts: checked
          ? [...orderData.discounts, option]
          : orderData.discounts.filter((discount) => discount.id !== option.id),
      });
    },
    [orderData]
  );

  const handleUpdateDiscountItems = useCallback(
    (discountId, items) => {
      setOrderData({
        ...orderData,
        discounts: orderData.discounts.map((opt) =>
          opt.id === discountId ? { ...opt, discountItems: items } : opt
        ),
      });
    },
    [orderData]
  );

  const handleApplyDiscount = useCallback(
    (selectedOptions) => {
      setOrderData({ ...orderData, discounts: selectedOptions });
      setDiscountModalVisible(false);
    },
    [orderData]
  );

  const handleRejectOrder = useCallback(
    async (reason) => {
      if (orderId) {
        await updateOrder(orderId, {
          status: "rejected",
          reject_reason: reason,
        });
        setRejectModalVisible(false);
        handleCloseModal();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderId]
  );

  const handleUpdateOrderData = useCallback(
    (fields = {}) => {
      console.log(fields);
      setOrderData({ ...orderData, ...fields });
    },
    [orderData]
  );

  const handleUpdateBranch = useCallback(
    (branchId) => {
      console.log(branchId);
      setOrderData({ ...orderData, branchId });
    },
    [orderData]
  );

  const validateOrderData = useCallback((data) => {
    let isValid = true;

    const newErrors = {};

    if (!isValid) {
      setValidationFailBefore(true);
    }
    setErrors(newErrors);
    return isValid;
  }, []);

  useEffect(() => {
    if (isValidationFailBefore) {
      validateOrderData(orderData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData, isValidationFailBefore]);

  useEffect(() => {
    if (isModalVisible && authUser && !authUser.is_admin) {
      console.log(2);

      handleUpdateBranch(authUser.staff?.branch_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, isModalVisible]);

  useEffect(() => {
    if (isModalVisible) {
      if (orderId) {
        fetchOrderData(orderId);
      }
      fetchMenuOptions();
      fetchBranchOptions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isModalVisible]);

  useEffect(() => {
    if (isModalVisible && customerKeyword) {
      console.log(4);

      handleUpdateOrderData({ customerName: customerKeyword || null });

      fetchCustomerOptions(customerKeyword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerKeyword, isModalVisible]);

  useEffect(() => {
    if (orderId && isDiscountModalVisible) {
      fetchDiscountOptions(orderId);
    }
  }, [orderId, isDiscountModalVisible]);

  useEffect(() => {
    if (isModalVisible) {
      if (orderData.type === "delivery") {
        fetchShipperOptions();
      }
      if (orderData.branchId) {
        fetchTableOptions();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData, isModalVisible]);

  useEffect(() => {
    if (!selectedMenu && menuOptions.length) {
      setSelectedMenu(menuOptions[0].id);
    }
  }, [selectedMenu, menuOptions]);

  useEffect(() => {
    if (selectedMenu) {
      fetchCategories(selectedMenu);
    }
  }, [selectedMenu]);

  useEffect(() => {
    if (categories.length) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCategory && selectedMenu) {
      const menu = menuOptions.find((opt) => opt.id === selectedMenu);
      const category = menu.categories.find(
        (cat) => cat.id === selectedCategory
      );
      if (category) {
        setGoodItems(category.items || []);
      }
    }
  }, [selectedCategory, selectedMenu, menuOptions]);

  useEffect(() => {
    if (!isModalVisible) {
      setOrderData(defaultData);
      setActiveTab(0);
    }
  }, [isModalVisible]);

  useEffect(() => {
    console.log("order data: ", orderData);
  }, [orderData]);

  return (
    <>
      {isSaveSuccessful && (
        <Toast
          variant='success'
          message={`${orderId ? "Cập nhật" : "Thêm"} đơn phục vụ thành công`}
          handleClose={() => setSaveSuccessful(false)}
        />
      )}
      <DiscountOptionModal
        isModalVisible={isDiscountModalVisible}
        handleCloseModal={() => setDiscountModalVisible(false)}
        discountOptions={discountOptions}
        selectedOptions={orderData.discounts}
        handleSelectDiscountOption={handleSelectDiscountOption}
        handleUpdateDiscountItems={handleUpdateDiscountItems}
        handleApplyDiscount={handleApplyDiscount}
      />
      <OrderPayment
        isModalVisible={isPaymentModalVisible}
        handleClose={(success = false) => {
          setPaymentModalVisible(false);
          if (success) {
            handleCloseModal();
          }
        }}
        order={{ ...orderData, id: orderId }}
      />
      <CancelAmountModal
        isModalVisible={isCancelAmountModalVisible}
        handleCloseModal={() => setCancelAmountModalVisible(false)}
        cancelQuantity={itemIdToCancel?.quantity || 0}
        handleChangeCancelQuantity={(val) => setCancelQuantity(val)}
        handleCancelOrderItem={handleCancelOrderItem}
      />
      <RejectReasonModal
        isModalVisible={isRejectModalVisible}
        handleCloseModal={() => setRejectModalVisible(false)}
        handleRejectOrder={handleRejectOrder}
      />
      <Modal
        isModalVisible={isModalVisible}
        handleClose={handleCloseModal}
        title='Thêm đơn hàng'
      >
        <CustomTabs
          labels={["Thông tin đơn hàng", "Gọi món"]}
          activeTab={activeTab}
          onChangeActiveTab={(val) => setActiveTab(val)}
        >
          <TabPanel value={activeTab} index={0}>
            <div style={{ flex: 1 }}>
              <FormControl
                margin='normal'
                disabled={orderData.status === "done"}
              >
                <FormLabel id='demo-radio-buttons-group-label'>
                  Loại đơn hàng
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-radio-buttons-group-label'
                  defaultValue='dine-in'
                  value={orderData.type}
                  onChange={(e, val) =>
                    setOrderData({ ...orderData, type: val })
                  }
                  name='radio-buttons-group'
                >
                  <FormControlLabel
                    value='dine-in'
                    control={<Radio />}
                    label='Ngồi tại bàn'
                  />
                  <FormControlLabel
                    value='delivery'
                    control={<Radio />}
                    label='Giao đi'
                  />
                  <FormControlLabel
                    value='takeaway'
                    control={<Radio />}
                    label='Mang về'
                  />
                </RadioGroup>
              </FormControl>

              {orderData.type !== "dine-in" && (
                <div
                  style={{ display: "flex", marginTop: 20, marginBottom: 20 }}
                >
                  <Autocomplete
                    className='navbar__searchBar__container'
                    freeSolo
                    id='free-solo-2-demo'
                    options={customers || []}
                    inputValue={customerKeyword}
                    onInputChange={(e, val) => {
                      setCustomerKeyword(val);
                    }}
                    value={
                      orderData.customerName ||
                      customers.find(
                        (customer) => customer.id === orderData.customerId
                      )
                    }
                    onChange={(e, val) => {
                      setOrderData({
                        ...orderData,
                        customerId: val ? val.id : null,
                        customerPhoneNumber: val ? val.phone_number : null,
                      });
                    }}
                    disabled={orderData.status === "done"}
                    getOptionLabel={(option) => option.full_name || option}
                    filterOptions={(options, state) => options}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        label='Khách hàng'
                        {...params}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            fontSize: 20,
                          },
                        }}
                        style={{ minWidth: 250 }}

                        // error={errors.customerName !== undefined}
                        // helperText={errors.customerName}
                      />
                    )}
                  />
                  <TextField
                    label='Số điện thoại'
                    InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
                    style={{ marginLeft: 50 }}
                    value={orderData.customerPhoneNumber}
                    onChange={(e) =>
                      setOrderData({
                        ...orderData,
                        customerPhoneNumber: e.target.value,
                      })
                    }
                    disabled={orderData.status === "done"}
                  />
                </div>
              )}

              <div style={{ display: "flex", marginBottom: 20 }}>
                <TextField
                  label='Chi nhánh'
                  fullWidth
                  select
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 20,
                    },
                  }}
                  style={{ marginRight: "1rem" }}
                  SelectProps={{ native: true }}
                  value={orderData.branchId}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      branchId: Number.parseInt(e.target.value) || null,
                    })
                  }
                  disabled={orderData.status === "done" || !authUser?.is_admin}
                >
                  <option value=''>Chọn chi nhánh</option>
                  {branchOptions.map((opt) => (
                    <option value={opt.id}>{opt.name}</option>
                  ))}
                </TextField>

                {orderData.branchId && orderData.type === "dine-in" && (
                  <Autocomplete
                    className='navbar__searchBar__container'
                    options={tableOptions}
                    value={
                      tableOptions.find((opt) => opt.id === orderData.table) ??
                      null
                    }
                    disabled={orderData.status === "done"}
                    onChange={(e, val) =>
                      setOrderData({ ...orderData, table: val.id })
                    }
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    filterOptions={(options, state) => options}
                    renderInput={(params) => (
                      <TextField
                        label='Chọn bàn'
                        {...params}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            fontSize: 20,
                          },
                        }}
                        style={{ minWidth: 250 }}
                        margin='normal'
                      />
                    )}
                  />
                )}
              </div>

              {orderData.type === "delivery" && (
                <>
                  <TextField
                    label='Địa chỉ giao hàng'
                    fullWidth
                    margin='normal'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 20,
                      },
                    }}
                    style={{ marginBottom: 20 }}
                    disabled={orderData.status === "done"}
                  />
                  <Autocomplete
                    className='navbar__searchBar__container'
                    freeSolo
                    id='free-solo-2-demo'
                    options={shipperOptions}
                    value={
                      shipperOptions.find(
                        (opt) => opt.id === orderData.shipperId
                      ) ?? null
                    }
                    disabled={orderData.status === "done"}
                    onChange={(e, val) =>
                      setOrderData({
                        ...orderData,
                        shipperId: val ? val.id : null,
                      })
                    }
                    getOptionLabel={(option) => option.full_name}
                    filterOptions={(options, state) => options}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        label='Nhân viên giao hàng'
                        {...params}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            fontSize: 20,
                          },
                        }}
                        style={{ marginBottom: 20 }}
                      />
                    )}
                  />
                  {orderData.type === "delivery" && orderData.delivery_status && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Typography style={{ marginRight: "1rem" }}>
                        Trạng thái giao hàng
                      </Typography>
                      <ChipLabel
                        label={
                          orderData.delivery_status === "pending"
                            ? "Chờ nhận đơn"
                            : orderData.delivery_status === "accepted"
                            ? "Đã nhận đơn"
                            : orderData.delivery_status === "rejected"
                            ? "Đã từ chối"
                            : orderData.delivery_status === "delivering"
                            ? "Đang giao"
                            : "Đã giao"
                        }
                        variant={
                          orderData.delivery_status === "pending"
                            ? "info"
                            : orderData.delivery_status === "accepted"
                            ? "warning"
                            : orderData.delivery_status === "rejected"
                            ? "failure"
                            : orderData.delivery_status === "delivering"
                            ? "primary"
                            : "success"
                        }
                      />
                    </div>
                  )}
                </>
              )}

              <TextField
                margin='normal'
                label='Ghi chú'
                variant='outlined'
                fullWidth
                multiline
                InputLabelProps={{
                  shrink: true,
                  style: { paddingTop: 10, fontSize: 20 },
                }}
                rows={4}
                value={orderData.note}
                onChange={(e) =>
                  setOrderData({ ...orderData, note: e.target.value })
                }
                disabled={orderData.status === "done"}
              />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <div style={{ display: "flex" }}>
              {orderData.payment_status !== "paid" && (
                <div
                  style={{
                    borderRight: "1px solid",
                    minWidth: 400,
                    padding: "1rem",
                    marginRight: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 20,
                    }}
                  >
                    <TextField
                      select
                      SelectProps={{ native: true }}
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          fontSize: 20,
                        },
                      }}
                      margin='normal'
                      label='Thực đơn'
                      style={{ minWidth: 150, marginRight: 10 }}
                      value={selectedMenu}
                      onChange={(e) =>
                        setSelectedMenu(Number.parseInt(e.target.value))
                      }
                    >
                      {menuOptions.map((opt) => (
                        <option value={opt.id}>{opt.name}</option>
                      ))}
                    </TextField>
                    <TextField
                      select
                      SelectProps={{ native: true }}
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          fontSize: 20,
                        },
                      }}
                      margin='normal'
                      label='Hạng mục'
                      style={{ minWidth: 170, marginRight: 10 }}
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(Number.parseInt(e.target.value))
                      }
                    >
                      {categories.map((opt) => (
                        <option value={opt.id}>{opt.name}</option>
                      ))}
                    </TextField>
                    <TextField
                      label='Nhập tên món'
                      margin='normal'
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          fontSize: 20,
                        },
                      }}
                      value={goodSearchKeyword}
                      onChange={(e) => setGoodSearchKeyword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton>
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>

                  <div>
                    {goodItems.length > 0 ? (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ fontSize: 16 }}>
                                Tên
                              </TableCell>
                              <TableCell style={{ fontSize: 16 }}>
                                Đơn giá
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {goodItems.map((item) => (
                              <TableRow>
                                <TableCell
                                  width={200}
                                  style={{ maxWidth: 300 }}
                                >
                                  {item.name}
                                </TableCell>
                                <TableCell width={80}>
                                  {item.sale_price}
                                </TableCell>
                                <TableCell width={50}>
                                  <IconButton
                                    onClick={() => handleAddItem(item)}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <Typography variant='h6'>
                          Không tìm thấy món ăn
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div>
                <TableContainer style={{ maxHeight: 260 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell colSpan={2}>Thành tiền</TableCell>
                        <>
                          <TableCell>Đã phục vụ</TableCell>

                          <TableCell>Trạng thái</TableCell>
                          <TableCell></TableCell>
                        </>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderData.details.map((item) => (
                        <TableRow>
                          <TableCell width={250}>{item.name}</TableCell>
                          <TableCell align='center' width={100}>
                            <TextField
                              type='number'
                              value={item.quantity}
                              disabled={item.status === "done"}
                              onChange={(e) =>
                                setOrderData({
                                  ...orderData,
                                  details: orderData.details.map((orderItem) =>
                                    orderItem.id === item.id
                                      ? {
                                          ...orderItem,
                                          quantity: e.target.value,
                                        }
                                      : orderItem
                                  ),
                                })
                              }
                            />
                          </TableCell>
                          <TableCell colSpan={2}>
                            {item.quantity * item.sale_price}
                          </TableCell>
                          <>
                            <TableCell width={150} align='center'>
                              {item.finished_quantity || 0}
                            </TableCell>
                            <TableCell>
                              <ChipLabel
                                label={
                                  item.status === "pending"
                                    ? "Chờ chế biến"
                                    : item.status === "in_progress"
                                    ? "Đang chế biến"
                                    : item.status === "ready_to_serve"
                                    ? "Sẵn sàng phục vụ"
                                    : item.status === "rejected"
                                    ? "Hết món"
                                    : "Hoàn thành"
                                }
                                variant={
                                  item.status === "ready_to_serve"
                                    ? "warning"
                                    : item.status === "done"
                                    ? "success"
                                    : item.status === "rejected"
                                    ? "failure"
                                    : item.status === "in_progress"
                                    ? "primary"
                                    : "info"
                                }
                              />
                            </TableCell>
                            <TableCell width={50}>
                              <div style={{ display: "flex" }}>
                                {!item.id ||
                                  (item.status === "pending" && (
                                    <IconButton
                                      color='secondary'
                                      onClick={() => {
                                        setOrderItemToCancel(item);
                                        setCancelAmountModalVisible(true);
                                      }}
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  ))}

                                {item.status === "ready_to_serve" && (
                                  <IconButton
                                    color='primary'
                                    onClick={() =>
                                      handleUpdateServeStatus(
                                        item.id,
                                        item.quantity
                                      )
                                    }
                                  >
                                    <CheckIcon className='order__detail__item__check' />
                                  </IconButton>
                                )}
                              </div>
                            </TableCell>
                          </>
                        </TableRow>
                      ))}
                      {orderData.discounts
                        .filter(
                          (discount) =>
                            discount.discountItems &&
                            discount.discountItems.length > 0
                        )
                        .reduce(
                          (items, discount) =>
                            items.concat(discount.discountItems),
                          []
                        )
                        .map((item) => (
                          <TableRow>
                            <TableCell width={250}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography style={{ marginRight: 10 }}>
                                  {item.name}
                                </Typography>
                                <ChipLabel label='KM' variant='failure' />
                              </div>
                            </TableCell>
                            <TableCell align='center' width={100}>
                              <TextField
                                type='number'
                                value={item.quantity || 1}
                                disabled
                              />
                            </TableCell>
                            <TableCell width={150} align='center'>
                              {item.finished_quantity || 0}
                            </TableCell>
                            <TableCell>
                              <ChipLabel
                                label={
                                  item.status === "pending"
                                    ? "Chờ chế biến"
                                    : item.status === "in_progress"
                                    ? "Đang chế biến"
                                    : item.status === "ready_to_serve"
                                    ? "Sẵn sàng phục vụ"
                                    : item.status === "rejected"
                                    ? "Hết món"
                                    : "Hoàn thành"
                                }
                                variant={
                                  item.status === "ready_to_serve"
                                    ? "warning"
                                    : item.status === "done"
                                    ? "success"
                                    : item.status === "rejected"
                                    ? "failure"
                                    : item.status === "in_progress"
                                    ? "primary"
                                    : "info"
                                }
                              />
                            </TableCell>
                            {item.status !== "done" && (
                              <TableCell width={50}>
                                <div style={{ display: "flex" }}>
                                  {!item.id ||
                                    (item.status === "pending" && (
                                      <IconButton
                                        color='secondary'
                                        onClick={
                                          item.id
                                            ? () => {
                                                setItemIdToCancel(item.id);
                                                setCancelQuantity(
                                                  item.quantity
                                                );
                                                setCancelAmountModalVisible(
                                                  true
                                                );
                                              }
                                            : () =>
                                                handleRemoveOrderItem(item.id)
                                        }
                                      >
                                        <ClearIcon />
                                      </IconButton>
                                    ))}

                                  {item.status === "ready_to_serve" && (
                                    <IconButton
                                      color='primary'
                                      onClick={() =>
                                        handleUpdateServeStatus(
                                          item.id,
                                          item.quantity
                                        )
                                      }
                                    >
                                      <CheckIcon className='order__detail__item__check' />
                                    </IconButton>
                                  )}
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {orderData.details.length > 0 && (
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            aria-label='expand row'
                            size='small'
                            onClick={() =>
                              setTotalCollapseVisible(!isTotalCollapseVisible)
                            }
                          >
                            {isTotalCollapseVisible ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell colSpan={6} align={"right"}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography style={{ fontWeight: 500 }}>
                              Tổng tiền
                            </Typography>
                            <Typography style={{ marginLeft: "1rem" }}>
                              {getInvoiceTotal(orderData) +
                                10000 -
                                getDiscountAmount(
                                  getInvoiceTotal(orderData),
                                  orderData.discounts
                                )}
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ padding: 0 }}
                          align='right'
                          colSpan={7}
                        >
                          <Collapse
                            in={isTotalCollapseVisible}
                            timeout='auto'
                            unmountOnExit
                          >
                            <Grid
                              container
                              style={{
                                justifyContent: "flex-end",
                                paddingRight: "1rem",
                              }}
                            >
                              <Grid item xs={3} />

                              <Grid item xs={3}>
                                <Typography>Tạm tính</Typography>
                                <Typography>VAT</Typography>
                                <Typography>Giảm giá</Typography>
                                <Typography>Tổng tiền</Typography>
                              </Grid>

                              <Grid item xs={3}>
                                <Typography>
                                  {getInvoiceTotal(orderData)}
                                </Typography>
                                <Typography>10000</Typography>
                                <Typography>
                                  {getDiscountAmount(
                                    getInvoiceTotal(orderData),
                                    orderData.discounts
                                  )}
                                </Typography>
                                <Typography>
                                  {getInvoiceTotal(orderData) +
                                    10000 -
                                    getDiscountAmount(
                                      getInvoiceTotal(orderData),
                                      orderData.discounts
                                    )}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}

                {orderId && (
                  <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography>Chương trình khuyến mãi</Typography>
                          {orderData.status !== "done" && (
                            <Tooltip title='Xem chương trình khuyến mãi khả dụng'>
                              <IconButton
                                style={{ color: "#FFB6C1" }}
                                onClick={() => setDiscountModalVisible(true)}
                              >
                                <RedeemIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <OrderDiscounts
                          discounts={orderData.discounts}
                          handleRemoveDiscount={(id) =>
                            setOrderData({
                              ...orderData,
                              discounts: orderData.discounts.filter(
                                (discount) => discount.id !== id
                              ),
                            })
                          }
                        />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                )}
              </div>
            </div>
          </TabPanel>
        </CustomTabs>

        <div style={{ display: "flex", float: "right", marginTop: 2 }}>
          {orderData.createdByCustomer && orderData.status === "pending" ? (
            <>
              <Button
                variant='contained'
                style={{ background: "green", color: "white" }}
                onClick={async () => {
                  await updateOrder(orderId, { status: "accepted" });
                  setSaveSuccessful(true);
                  handleCloseModal();
                }}
              >
                Nhận đơn
              </Button>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => setRejectModalVisible(true)}
              >
                Từ chối
              </Button>
            </>
          ) : (
            <>
              {orderId &&
              orderData.type === "dine-in" &&
              orderData.payment_status !== "paid" ? (
                authUser?.staff?.role?.code === "server" ? (
                  <Button
                    variant='contained'
                    onClick={async () => {
                      await updateOrder(orderId, {
                        ...convertToOrderDTO(orderData),
                        payment_status: "request_to_pay",
                      });
                      handleCloseModal();
                    }}
                  >
                    Yêu cầu thanh toán
                  </Button>
                ) : (
                  orderData.payment_status === "request_to_pay" && (
                    <Button
                      variant='contained'
                      onClick={() => setPaymentModalVisible(true)}
                    >
                      Thanh toán
                    </Button>
                  )
                )
              ) : (
                authUser?.staff?.role?.code !== "server" &&
                !["dine-in", "delivery"].includes(orderData.type) &&
                orderData.payment_status !== "paid" && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => setPaymentModalVisible(true)}
                  >
                    Thanh toán
                  </Button>
                )
              )}

              {orderData.payment_status === "paid" && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => setPaymentModalVisible(true)}
                >
                  Xem hóa đơn
                </Button>
              )}

              {orderId && orderData.status === "pending" && (
                <Button variant='contained' color='secondary'>
                  Hủy đơn
                </Button>
              )}

              {orderData.type !== "takeaway" && orderData.status !== "done" && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSaveOrder}
                >
                  Lưu
                </Button>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

export default OrderCreate;

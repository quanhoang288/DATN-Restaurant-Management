import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
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
// import './OrderCreate.css'

const defaultData = {
  type: "dine-in",
  details: [],
  table: null,
  note: "",
  customerId: null,
  customerPhoneNumber: null,
  shipperId: null,
  deliveryInfoId: null,
  deliveryAddress: null,
  discounts: [],
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

function DiscountOptionModal(props) {
  const {
    isModalVisible,
    discountOptions,
    selectedOptions,
    handleCloseModal,
    handleApplyDiscount,
    handleSelectDiscountOption,
    handleUpdateDiscountItems,
  } = props;

  useEffect(() => {
    console.log("selected: ", selectedOptions);
  }, [selectedOptions]);

  return (
    <Modal
      title='Khuyến mãi trên hóa đơn'
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox />
              </TableCell>
              <TableCell>Tên chương trình</TableCell>
              <TableCell>Nội dung khuyến mãi</TableCell>
              <TableCell>Áp dụng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discountOptions.map((opt) => (
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={(selectedOptions || []).some(
                      (selected) => selected.id === opt.id
                    )}
                    onChange={(e, checked) =>
                      handleSelectDiscountOption(opt, checked)
                    }
                  />
                </TableCell>
                <TableCell>{opt.name}</TableCell>
                <TableCell>{opt.description || "Description"}</TableCell>
                <TableCell>
                  {opt.method === "invoice-discount" ? (
                    `${opt.constraint.discount_amount}${
                      opt.constraint.discount_unit === "cash" ? "" : "%"
                    }`
                  ) : opt.method === "invoice-giveaway" ? (
                    <Autocomplete
                      className='navbar__searchBar__container'
                      id='free-solo-2-demo'
                      options={opt.constraint.goods || []}
                      value={
                        selectedOptions.find(
                          (selected) => selected.id === opt.id
                        )?.discountItems || []
                      }
                      onChange={(e, val) =>
                        handleUpdateDiscountItems(opt.id, val)
                      }
                      getOptionSelected={(option, value) =>
                        option.id === value.id
                      }
                      multiple
                      getOptionLabel={(option) => option.name}
                      filterOptions={(options, state) => options}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          label='Món khuyến mãi'
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              fontSize: 20,
                            },
                          }}
                          style={{ minWidth: 250 }}
                          // margin='normal'
                        />
                      )}
                    />
                  ) : opt.method === "good-giveaway" ? (
                    <Autocomplete
                      className='navbar__searchBar__container'
                      freeSolo
                      id='free-solo-2-demo'
                      options={[]}
                      getOptionLabel={(option) => option.name}
                      filterOptions={(options, state) => options}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          label='Món khuyến mãi'
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              fontSize: 20,
                            },
                          }}
                          style={{ minWidth: 250 }}
                          // margin='normal'
                        />
                      )}
                    />
                  ) : (
                    <Typography>30000</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            console.log("selected options: ", selectedOptions);
            handleApplyDiscount(selectedOptions);
          }}
        >
          Áp dụng
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Hủy bỏ
        </Button>
      </div>
    </Modal>
  );
}

function OrderDiscounts(props) {
  const { discounts, handleRemoveDiscount } = props;
  console.log("order discounts: ", discounts);
  return (
    <div>
      <div className='discount__invoice' style={{ marginBottom: "1rem" }}>
        <Typography style={{ fontWeight: 500 }}>
          Khuyến mãi trên hóa đơn
        </Typography>

        {(discounts || []).filter((discount) => discount.type === "invoice")
          .length > 0 && (
          <TableContainer>
            <TableHead>
              <TableRow>
                <TableCell>Tên chương trình</TableCell>
                <TableCell>Hình thức khuyến mãi</TableCell>
                <TableCell>Khuyến mãi</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(discounts || [])
                .filter((discount) => discount.type === "invoice")
                .map((discount) => (
                  <TableRow>
                    <TableCell>{discount.name}</TableCell>
                    <TableCell>{discount.method}</TableCell>
                    <TableCell>
                      {discount.method === "invoice-discount" ? (
                        `${discount.constraint.discount_amount}${
                          discount.constraint.discount_unit === "cash"
                            ? ""
                            : "%"
                        }`
                      ) : (
                        <div style={{ display: "flex" }}>
                          {(discount.discountItems || []).map((item) => (
                            <ChipLabel
                              key={item.id}
                              label={item.name}
                              variant='primary'
                            />
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleRemoveDiscount(discount.id)}
                      >
                        <ClearIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </TableContainer>
        )}
      </div>
      <div className='discount__good'>
        <Typography style={{ fontWeight: 500 }}>
          Khuyến mãi trên hàng hóa
        </Typography>
      </div>
    </div>
  );
}

function OrderCreate({ orderId, isModalVisible, handleCloseModal }) {
  const [tableOptions, setTableOptions] = useState([]);
  const [menuOptions, setMenuOptions] = useState([]);
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
  const [isDiscountModalVisible, setDiscountModalVisible] = useState(false);
  const [discountOptions, setDiscountOptions] = useState([]);
  const [shipperOptions, setShipperOptions] = useState([]);

  const socket = useWebsocket();

  const fetchDiscountOptions = async (orderId) => {
    const discounts = (await getDiscounts({ orderId })).data;
    setDiscountOptions(discounts);
  };

  const fetchTableOptions = async () => {
    const res = await getTables();
    setTableOptions(res.data);
  };

  const fetchMenuOptions = async () => {
    const res = await getMenus();
    setMenuOptions(res.data);
  };

  const fetchCategories = async (menuId) => {
    const res = await getMenu(menuId);
    setCategories(res.data.categories);
  };

  const fetchShipperOptions = async () => {
    const shipperRole = (
      await getRoles({
        filters: JSON.stringify({ code: "shipper" }),
      })
    ).data[0];
    if (shipperRole) {
      const shippers = (
        await getStaffList({
          filters: JSON.stringify({
            role_id: shipperRole.id,
          }),
        })
      ).data;
      setShipperOptions(shippers);
    }
  };

  const fetchOrderData = async (orderId) => {
    if (orderId) {
      const res = await getOrder(orderId);
      console.log("order state: ", fromDTOToStateData(res.data));
      setOrderData(fromDTOToStateData(res.data));
    }
  };

  const handleAddItem = useCallback(
    (item) => {
      const itemPos = orderData.details.findIndex(
        (orderItem) => orderItem.good_id === item.id
      );
      if (itemPos !== -1) {
        const details = orderData.details;
        details[itemPos] = {
          ...details[itemPos],
          quantity: details[itemPos].quantity + 1,
        };
        setOrderData({ ...orderData, details });
      } else {
        setOrderData({
          ...orderData,
          details: [
            ...orderData.details,
            { good_id: item.id, name: item.name, quantity: 1 },
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
        details: orderData.details.filter((item) => item.good_id !== id),
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
      const order = (await createOrder(orderPayload)).data;
      referencedId = order.id;
    }
    const notification = (
      await createNotification({
        type: "order_created",
        referenced_id: referencedId,
      })
    ).data;
    socket.emit("NEW_NOTIFICATION", notification);

    handleCloseModal();
    setSaveSuccessful(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData, orderId]);

  const handleUpdateServeStatus = useCallback(
    async (itemId) => {
      if (orderId) {
        await updateOrderItem(orderId, itemId, { status: "done" });
        setOrderData({
          ...orderData,
          details: orderData.details.map((item) =>
            item.id === itemId ? { ...item, status: "done" } : item
          ),
        });
      }
    },
    [orderData, orderId]
  );

  const handleCancelOrderItem = useCallback(async () => {
    if (orderId && itemIdToCancel) {
      const orderItem = orderData.details.find(
        (item) => item.good_id === itemIdToCancel
      );
      await updateOrderItem(orderId, itemIdToCancel, {
        quantity: Math.max(orderItem.quantity - cancelQuantity, 0),
      });
      setCancelAmountModalVisible(false);
      handleCloseModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIdToCancel, cancelQuantity, orderId, orderData]);

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

  useEffect(() => {
    if (orderId) {
      fetchOrderData(orderId);
    }
    fetchTableOptions();
    fetchMenuOptions();
  }, [orderId]);

  useEffect(() => {
    if (orderId && isDiscountModalVisible) {
      fetchDiscountOptions(orderId);
    }
  }, [orderId, isDiscountModalVisible]);

  useEffect(() => {
    if (orderData.type === "delivery") {
      fetchShipperOptions();
    }
  }, [orderData]);

  useEffect(() => {
    if (goodSearchKeyword) {
      // TODO: Search for good item
    } else {
      // TODO: fetch all goods
    }
  }, [goodSearchKeyword]);

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
    if (!selectedCategory && categories.length) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (selectedCategory && selectedMenu) {
      const menu = menuOptions.find((opt) => opt.id === selectedMenu);
      const category = menu.categories.find(
        (cat) => cat.id === selectedCategory
      );
      if (category) {
        setGoodItems(category.items);
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
        handleClose={() => setPaymentModalVisible(false)}
        order={{ ...orderData, id: orderId }}
      />
      <CancelAmountModal
        isModalVisible={isCancelAmountModalVisible}
        handleCloseModal={() => setCancelAmountModalVisible(false)}
        cancelQuantity={cancelQuantity}
        handleChangeCancelQuantity={(val) => setCancelQuantity(val)}
        handleCancelOrderItem={handleCancelOrderItem}
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
              <div style={{ display: "flex", marginTop: 20, marginBottom: 20 }}>
                <Autocomplete
                  className='navbar__searchBar__container'
                  freeSolo
                  id='free-solo-2-demo'
                  options={[]}
                  value={null}
                  getOptionLabel={(option) => option.name}
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
                      // margin='normal'
                    />
                  )}
                />
                <TextField
                  label='Số điện thoại'
                  InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
                  style={{ marginLeft: 50 }}
                />
              </div>

              <FormControl margin='normal'>
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

              {orderData.type === "dine-in" && (
                <Autocomplete
                  className='navbar__searchBar__container'
                  options={tableOptions}
                  value={
                    tableOptions.find((opt) => opt.id === orderData.table) ??
                    null
                  }
                  onChange={(e, val) =>
                    setOrderData({ ...orderData, table: val })
                  }
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => option.id === value.id}
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
              />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <div style={{ display: "flex" }}>
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
                    onChange={(e) => setSelectedMenu(e.target.value)}
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
                    onChange={(e) => setSelectedCategory(e.target.value)}
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
                            <TableCell style={{ fontSize: 16 }}>Tên</TableCell>
                            <TableCell style={{ fontSize: 16 }}>
                              Đơn giá
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {goodItems.map((item) => (
                            <TableRow>
                              <TableCell width={200} style={{ maxWidth: 300 }}>
                                {item.name}
                              </TableCell>
                              <TableCell width={80}>
                                {item.sale_price}
                              </TableCell>
                              <TableCell width={50}>
                                <IconButton onClick={() => handleAddItem(item)}>
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
              <div>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell colSpan={2}>Thành tiền</TableCell>
                        <TableCell>Đã phục vụ</TableCell>

                        <TableCell>Trạng thái</TableCell>
                        <TableCell></TableCell>
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
                                    orderItem.good_id === item.good_id
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
                            {item.quantity * item.price}
                          </TableCell>
                          <TableCell width={150} align='center'>
                            {item.finished_quantity || item.quantity}
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
                                              setItemIdToCancel(item.good_id);
                                              setCancelQuantity(item.quantity);
                                              setCancelAmountModalVisible(true);
                                            }
                                          : () =>
                                              handleRemoveOrderItem(
                                                item.good_id
                                              )
                                      }
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  ))}

                                {item.status === "ready_to_serve" && (
                                  <IconButton
                                    color='primary'
                                    onClick={() =>
                                      handleUpdateServeStatus(item.good_id)
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
                                        handleUpdateServeStatus(item.good_id)
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
                <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography>Chương trình khuyến mãi</Typography>
                        <Tooltip title='Xem chương trình khuyến mãi khả dụng'>
                          <IconButton
                            style={{ color: "#FFB6C1" }}
                            onClick={() => setDiscountModalVisible(true)}
                          >
                            <RedeemIcon />
                          </IconButton>
                        </Tooltip>
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

                {/* <div style={{ float: "right" }}>
                  <Typography>Tổng tiền: 20000</Typography>
                </div> */}
              </div>
            </div>
          </TabPanel>
        </CustomTabs>

        <div style={{ display: "flex", float: "right", marginTop: 2 }}>
          <Button
            variant='contained'
            onClick={() => setPaymentModalVisible(true)}
          >
            Lưu và thanh toán
          </Button>
          <Button variant='contained' color='primary' onClick={handleSaveOrder}>
            Lưu
          </Button>
          <Button variant='contained' onClick={handleCloseModal}>
            Hủy bỏ
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default OrderCreate;

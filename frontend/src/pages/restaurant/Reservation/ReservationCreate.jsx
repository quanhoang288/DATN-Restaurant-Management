import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import {
  Badge,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import CustomTable from "../../../components/Table/CustomTable";
import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import TabPanel from "../../../components/CustomTabs/TabPanel";

import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import {
  createReservation,
  getReservation,
  updateReservation,
} from "../../../apis/reservation";
import { Autocomplete } from "@material-ui/lab";
import { getGoods } from "../../../apis/good";
import { getMenus } from "../../../apis/menu";
import "./ReservationCreate.css";
import { getTables } from "../../../apis/table";
import {
  convertToReservationDTO,
  fromDTOToStateData,
} from "../../../utils/converter/convertToReservationDTO";
import { getCustomers } from "../../../apis/customer";
import { useSelector } from "react-redux";
import { getBranches } from "../../../apis/branch";
import { parseSearchParams } from "../../../utils/parseSearchParams";
import Toast from "../../../components/Toast/Toast";

const defaultReservationData = {
  arriveTime: null,
  customerId: null,
  customerName: null,
  phoneNumber: null,
  numPeople: null,
  note: "",
  tables: [],
  status: "pending",
  reject_reason: null,
};

function ReservationCreate({
  reservationId,
  isModalVisible,
  handleCloseModal,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [reservationData, setReservationData] = useState(
    defaultReservationData
  );
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [tableOptions, setTableOptions] = useState([]);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerKeyword, setCustomerKeyword] = useState("");
  const [errors, setErrors] = useState({});
  const [isValidationFailBefore, setValidationFailBefore] = useState(false);
  const [branchId, setBranchId] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);
  const [isSaveSuccessful, setSaveSuccessful] = useState(false);
  const [isEditable, setEditable] = useState(true);

  const authUser = useSelector((state) => state.auth.user);

  const numFloors = 4;

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

  const fetchReservationdata = async (reservationId) => {
    if (reservationId) {
      console.log("fetching reservation data");
      const res = await getReservation(reservationId);
      const stateData = fromDTOToStateData(res.data);
      setReservationData(stateData);
      setCustomerKeyword(
        stateData.customer
          ? stateData.customer.user?.full_name
          : stateData.customerName
      );
      console.log(stateData.status);
      setEditable(stateData.status !== "done");
    }
  };

  const fetchBranchOptions = async () => {
    const res = await getBranches();
    setBranchOptions(res?.data || []);
  };

  const fetchTableOptions = async (floorNum, branchId) => {
    const filters = parseSearchParams({
      branch_id: branchId,
      floor_num: floorNum,
    });
    const res = await getTables({ filters: JSON.stringify(filters) });
    setTableOptions(res.data);
  };

  const handleToggleTable = useCallback(
    (table) => {
      const isAvailable = !(table.reservations || []).some((res) =>
        ["pending", "confirmed", "serving"].includes(res.status)
      );
      if (isAvailable) {
        const isSelected = reservationData.tables.some(
          (t) => table.id === t.id
        );
        if (!isSelected) {
          setReservationData({
            ...reservationData,
            tables: [...reservationData.tables, table],
          });
        } else {
          setReservationData({
            ...reservationData,
            tables: reservationData.tables.filter((t) => t.id !== table.id),
          });
        }
      }
    },
    [reservationData]
  );

  const validateReservationData = useCallback((data) => {
    let isValid = true;

    const newErrors = {};

    if (!data.arriveTime) {
      newErrors.arriveTime = "Thời gian đến là bắt buộc";
      isValid = false;
    }
    if (!data.phoneNumber) {
      newErrors.phoneNumber = "SĐT là bắt buộc";
      isValid = false;
    }
    if (!data.customerId && !data.customerName) {
      newErrors.customerName = "Tên khách hàng là bắt buộc";
      isValid = false;
    }
    if (!data.numPeople) {
      newErrors.numPeople = "Số lượng khách là bắt buộc";
      isValid = false;
    }

    if (!isValid) {
      setValidationFailBefore(true);
    }
    setErrors(newErrors);
    return isValid;
  }, []);

  const handleSaveReservation = useCallback(async () => {
    console.log("saving reservation");
    const isValidData = validateReservationData(reservationData);
    if (!isValidData) {
      return;
    }
    const reservationPayload = convertToReservationDTO(reservationData);
    console.log(reservationPayload);
    let saveRes;
    if (reservationId) {
      saveRes = await updateReservation(reservationId, reservationPayload);
    } else {
      saveRes = await createReservation(reservationPayload);
    }
    if (!saveRes) {
      return;
    }
    setReservationData(defaultReservationData);
    handleCloseModal(true);
    setSaveSuccessful(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationData, reservationId]);

  useEffect(() => {
    if (selectedFloor !== null) {
      fetchTableOptions(selectedFloor, branchId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFloor, branchId]);

  useEffect(() => {
    if (reservationId) {
      fetchReservationdata(reservationId);
    } else {
      setReservationData(defaultReservationData);
    }
    fetchBranchOptions();
  }, [reservationId]);

  useEffect(() => {
    if (isValidationFailBefore) {
      validateReservationData(reservationData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationData, isValidationFailBefore]);

  useEffect(() => {
    console.log("keyword: ", customerKeyword);
    setReservationData({
      ...reservationData,
      customerName: customerKeyword || null,
    });

    fetchCustomerOptions(customerKeyword);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerKeyword]);

  useEffect(() => {
    if (authUser.staff?.branch_id) {
      setBranchId(authUser.staff.branch_id);
    }
  }, [authUser]);

  useEffect(() => {
    console.log("reservation data: ", reservationData);
    if (reservationData.tables.length) {
      setBranchId(reservationData.tables[0].branch_id);
    }
  }, [reservationData]);

  return (
    <>
      {isSaveSuccessful && (
        <Toast
          message={
            reservationId
              ? "Cập nhập thông tin thành công"
              : "Thêm thông tin thành công"
          }
          variant='success'
          handleClose={() => setSaveSuccessful(false)}
        />
      )}
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa đặt bàn'
        confirmTitle='Xóa'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa đặt bàn này?'
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <Modal
        isModalVisible={isModalVisible}
        handleClose={handleCloseModal}
        title={
          reservationId ? "Sửa thông tin đặt bàn" : "Thêm thông tin đặt bàn"
        }
      >
        <div
          className='reservation__create__container'
          style={{ minWidth: 800 }}
        >
          <CustomTabs
            labels={["Thông tin chung", "Xếp bàn"]}
            activeTab={activeTab}
            onChangeActiveTab={(val) => setActiveTab(val)}
          >
            <TabPanel value={activeTab} index={0}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex" }}>
                  <TextField
                    type='datetime-local'
                    margin='normal'
                    value={reservationData.arriveTime}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        arriveTime: e.target.value,
                      })
                    }
                    disabled={!isEditable}
                    label='Thời gian'
                    InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
                    style={{ marginRight: 30 }}
                    error={errors.arriveTime !== undefined}
                    helperText={errors.arriveTime}
                  />
                  <TextField
                    label='Số người'
                    value={reservationData.numPeople}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        numPeople: Number.parseInt(e.target.value) || null,
                      })
                    }
                    disabled={!isEditable}
                    type='number'
                    margin='normal'
                    InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
                    error={errors.numPeople !== undefined}
                    helperText={errors.numPeople}
                  />
                </div>
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
                    disabled={!isEditable}
                    value={
                      reservationData.customerName ||
                      customers.find(
                        (customer) => customer.id === reservationData.customerId
                      )
                    }
                    onChange={(e, val) => {
                      setReservationData({
                        ...reservationData,
                        customerId: val ? val.id : null,
                        phoneNumber: val ? val.phone_number : null,
                      });
                    }}
                    getOptionLabel={(option) => option.full_name}
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
                        error={errors.customerName !== undefined}
                        helperText={errors.customerName}
                      />
                    )}
                  />
                  <TextField
                    label='Số điện thoại'
                    value={reservationData.phoneNumber}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        phoneNumber: e.target.value,
                      })
                    }
                    disabled={!isEditable}
                    InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
                    style={{ marginLeft: 50 }}
                    error={errors.phoneNumber !== undefined}
                    helperText={errors.phoneNumber}
                  />
                </div>

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
                  disabled={!authUser.is_admin || !isEditable}
                  style={{ marginRight: "1rem" }}
                  SelectProps={{ native: true }}
                  value={branchId}
                  onChange={(e) =>
                    setBranchId(Number.parseInt(e.target.value) || null)
                  }
                >
                  <option value=''>Chọn chi nhánh</option>
                  {branchOptions.map((opt) => (
                    <option value={opt.id}>{opt.name}</option>
                  ))}
                </TextField>

                <FormControl margin='normal' disabled={!isEditable}>
                  <FormLabel id='demo-radio-buttons-group-label'>
                    Trạng thái đặt bàn
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby='demo-radio-buttons-group-label'
                    defaultValue='pending'
                    value={reservationData.status}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        status: e.target.value,
                      })
                    }
                    name='radio-buttons-group'
                  >
                    <FormControlLabel
                      value='pending'
                      control={<Radio />}
                      label='Chờ xác nhận'
                    />
                    <FormControlLabel
                      value='confirmed'
                      control={<Radio />}
                      label='Đã xác nhận (Chờ nhận bàn)'
                    />
                    <FormControlLabel
                      value='serving'
                      control={<Radio />}
                      label='Đã nhận bàn'
                    />
                    <FormControlLabel
                      value='rejected'
                      control={<Radio />}
                      label='Từ chối'
                    />
                    <FormControlLabel
                      value='done'
                      control={<Radio />}
                      label='Đã trả bàn'
                    />
                  </RadioGroup>
                </FormControl>
                {reservationData.status === "rejected" && (
                  <TextField
                    label='Lí do từ chối'
                    value={reservationData.reject_reason}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        reject_reason: e.target.value,
                      })
                    }
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 18,
                      },
                    }}
                    fullWidth
                    style={{ marginBottom: "1rem" }}
                  />
                )}
                <TextField
                  label='Ghi chú cho nhà hàng'
                  value={reservationData.note}
                  onChange={(e) =>
                    setReservationData({
                      ...reservationData,
                      note: e.target.value,
                    })
                  }
                  disabled={!isEditable}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 18,
                      paddingTop: 10,
                    },
                  }}
                  variant='outlined'
                  fullWidth
                  multiline
                  rows={4}
                />
              </div>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <div>
                {isEditable && (
                  <div
                    style={{
                      display: "flex",
                      marginTop: 5,
                      // marginBottom: 5,
                      justifyContent: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", marginRight: "1rem" }}>
                        <div
                          style={{
                            height: 20,
                            width: 20,
                            backgroundColor: "grey",
                            marginRight: 5,
                          }}
                        ></div>
                        <Typography>Bàn trống</Typography>
                      </div>
                      <div style={{ display: "flex", marginRight: "1rem" }}>
                        <div
                          style={{
                            height: 20,
                            width: 20,
                            backgroundColor: "blue",
                            marginRight: 5,
                          }}
                        ></div>
                        <Typography>Bàn đang phục vụ</Typography>
                      </div>
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            height: 20,
                            width: 20,
                            backgroundColor: "orange",
                            marginRight: 5,
                          }}
                        ></div>
                        <Typography>Bàn đặt trước</Typography>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className='search__container'
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  {reservationData.tables.length > 0 && (
                    <Typography>{`Bàn đã chọn: ${reservationData.tables
                      .map((table) => table.name)
                      .join(", ")}`}</Typography>
                  )}
                </div>

                {isEditable && (
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
                        <ListItem
                          button
                          selected={selectedFloor === floorIdx + 1}
                        >
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
                      {tableOptions.map((opt) =>
                        reservationData.tables.some(
                          (table) => table.id === opt.id
                        ) ? (
                          <Badge
                            color='primary'
                            badgeContent={
                              reservationData.tables.findIndex(
                                (table) => table.id === opt.id
                              ) + 1
                            }
                          >
                            <div
                              className={`table__item ${
                                opt.reservations.some((res) =>
                                  ["pending", "confirmed"].includes(res.status)
                                )
                                  ? "table__item__reserved"
                                  : opt.reservations.some(
                                      (res) => res.status === "serving"
                                    )
                                  ? "table__item__used"
                                  : "table__item__available"
                              }`}
                              onClick={() => handleToggleTable(opt)}
                            >
                              <Typography>{opt.name}</Typography>
                            </div>
                          </Badge>
                        ) : (
                          <div
                            className={`table__item ${
                              opt.reservations.some((res) =>
                                ["pending", "confirmed"].includes(res.status)
                              )
                                ? "table__item__reserved"
                                : opt.reservations.some(
                                    (res) => res.status === "serving"
                                  )
                                ? "table__item__used"
                                : "table__item__available"
                            }`}
                            onClick={() => handleToggleTable(opt)}
                          >
                            <Typography>{opt.name}</Typography>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabPanel>
          </CustomTabs>
          <div style={{ display: "flex", float: "right", marginTop: 2 }}>
            {reservationData.status !== "done" && (
              <Button
                variant='contained'
                color='primary'
                onClick={handleSaveReservation}
              >
                Lưu
              </Button>
            )}

            <Button
              variant='contained'
              onClick={() => {
                setReservationData(defaultReservationData);
                setActiveTab(0);
                handleCloseModal();
              }}
            >
              Đóng
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ReservationCreate;

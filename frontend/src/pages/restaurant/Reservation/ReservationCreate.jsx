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

const defaultReservationData = {
  arriveTime: null,
  customerId: null,
  customerName: null,
  phoneNumber: null,
  numPeople: null,
  note: "",
  tables: [],
  status: "pending",
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
  const [isSelectedTableReserved, setSelectedTableReserved] = useState(false);
  const numFloors = 4;

  const fetchReservationdata = async (reservationId) => {
    if (reservationId) {
      const res = await getReservation(reservationId);
      setReservationData(fromDTOToStateData(res.data));
    }
  };

  const fetchTableOptions = async (floorNum) => {
    const res = await getTables();
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

  const handleSaveReservation = useCallback(async () => {
    const reservationPayload = convertToReservationDTO(reservationData);
    if (reservationId) {
      await updateReservation(reservationId, reservationPayload);
    } else {
      await createReservation(reservationPayload);
    }
    setReservationData(defaultReservationData);
    handleCloseModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationData, reservationId]);

  useEffect(() => {
    if (selectedFloor !== null) {
      fetchTableOptions(selectedFloor);
    }
  }, [selectedFloor]);

  useEffect(() => {
    if (reservationId) {
      fetchReservationdata(reservationId);
    } else {
      setReservationData(defaultReservationData);
    }
  }, [reservationId]);

  return (
    <>
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
                    label='Thời gian'
                    InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
                    style={{ marginRight: 30 }}
                  />
                  <TextField
                    label='Số người'
                    value={reservationData.numPeople}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        numPeople: e.target.value,
                      })
                    }
                    type='number'
                    margin='normal'
                    InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
                  />
                </div>
                <div
                  style={{ display: "flex", marginTop: 20, marginBottom: 20 }}
                >
                  <Autocomplete
                    className='navbar__searchBar__container'
                    freeSolo
                    id='free-solo-2-demo'
                    options={[]}
                    value={reservationData.customerName}
                    onChange={(e, val) =>
                      setReservationData({
                        ...reservationData,
                        customerName: val,
                      })
                    }
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
                    value={reservationData.phoneNumber}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        phoneNumber: e.target.value,
                      })
                    }
                    InputLabelProps={{ shrink: true, style: { fontSize: 20 } }}
                    style={{ marginLeft: 50 }}
                  />
                </div>
                <FormControl margin='normal'>
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
                  </RadioGroup>
                </FormControl>
                <TextField
                  label='Ghi chú cho nhà hàng'
                  value={reservationData.note}
                  onChange={(e) =>
                    setReservationData({
                      ...reservationData,
                      note: e.target.value,
                    })
                  }
                  variant='outlined'
                  fullWidth
                  multiline
                  rows={4}
                />
              </div>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 5,
                    // marginBottom: 5,
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
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
                <div
                  className='search__container'
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <TextField
                    label='Xếp vào bàn'
                    margin='normal'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 20,
                      },
                    }}
                    style={{ marginRight: 20 }}
                  />
                  {reservationData.tables.length > 0 && (
                    <Typography>{`Bàn đang chọn: ${reservationData.tables
                      .map((table) => table.name)
                      .join(", ")}`}</Typography>
                  )}
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
              </div>
            </TabPanel>
          </CustomTabs>
          <div style={{ display: "flex", float: "right", marginTop: 2 }}>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSaveReservation}
            >
              Lưu
            </Button>
            <Button variant='contained' onClick={handleCloseModal}>
              Hủy bỏ
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ReservationCreate;

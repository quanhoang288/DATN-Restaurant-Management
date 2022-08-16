import {
  Box,
  Button,
  Grid,
  List,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import CustomerMain from "../../../containers/CustomerMain/CustomerMain";
import CustomTable from "../../../components/Table/CustomTable";
import ChipLabel from "../../../components/ChipLabel/ChipLabel";
import Modal from "../../../components/Modal/Modal";
import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import TabPanel from "../../../components/CustomTabs/TabPanel";

const reservationCols = [
  {
    id: "id",
    label: "Mã đặt lịch",
    isSortable: true,
  },

  {
    id: "arrive_time",
    label: "Thời gian đến",
    isSortable: true,
  },
  {
    id: "status",
    label: "Trạng thái đặt bàn",
    isSortable: true,
    type: "chip",
    variantMapping: [
      {
        value: "pending",
        variant: "info",
      },
      {
        value: "confirmed",
        variant: "primary",
      },
      {
        value: "serving",
        variant: "success",
      },
    ],
  },
];

function ReservationList(props) {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const actionButtons = [
    {
      name: "Chi tiết",
      variant: "contained",
      color: "primary",
      clickHandler: (id) => {
        setSelected(id);
      },
    },
  ];

  return (
    <div>
      <ReservationDetail
        reservationId={selected}
        isModalVisible={selected !== null}
        handleCloseModal={() => setSelected(null)}
      />
      <CustomTabs
        labels={["Chờ xử lý", "Đã xác nhận", "Đã nhận bàn", "Đã hủy"]}
        activeTab={activeTab}
        onChangeActiveTab={(val) => setActiveTab(val)}
      >
        <TabPanel value={activeTab} index={0}>
          <div>Chờ xử lý</div>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <div>Đã xác nhận</div>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <div>Đã nhận bàn</div>
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <div>Đã hủy</div>
        </TabPanel>
      </CustomTabs>
    </div>
  );
}

function ReservationDetail(props) {
  const { reservationId, isModalVisible, handleCloseModal } = props;
  return (
    <Modal
      isModalVisible={isModalVisible}
      handleCloseModal={handleCloseModal}
      title='Thông tin đặt lịch'
    >
      <Grid container>
        <Grid item xs={3}>
          <Typography style={{ fontWeight: 500 }}>Khách hàng</Typography>
          <Typography style={{ fontWeight: 500 }}>SĐT</Typography>
          <Typography style={{ fontWeight: 500 }}>SL khách</Typography>
          <Typography style={{ fontWeight: 500 }}>Thời gian</Typography>
          <Typography style={{ fontWeight: 500 }}>Địa chỉ</Typography>
          <Typography style={{ fontWeight: 500 }}>Bàn được xếp</Typography>
          <Typography style={{ fontWeight: 500 }}>Trạng thái</Typography>
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <Typography>A Quân</Typography>
          <Typography>0384426529</Typography>
          <Typography>10</Typography>

          <Typography>14/8/2022 18:30</Typography>
          <Typography>ABC, XYZ</Typography>
          <Typography>Bàn 1, Bàn 2, Bàn 3</Typography>

          <ChipLabel label='Chờ xác nhận' variant='info' />
        </Grid>
      </Grid>
      <div style={{ display: "flex", float: "right", marginTop: "1rem" }}>
        <Button variant='contained' color='secondary'>
          Hủy đặt lịch
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
}

function OrderList(props) {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const actionButtons = [
    {
      name: "Chi tiết",
      variant: "contained",
      color: "primary",
      clickHandler: (id) => {
        setSelected(id);
      },
    },
  ];

  return (
    <div>
      <OrderDetail
        reservationId={selected}
        isModalVisible={selected !== null}
        handleCloseModal={() => setSelected(null)}
      />
      <CustomTabs
        labels={["Chờ xử lý", "Đã chế biến", "Đã giao", "Đã giao", "Đã hủy"]}
        activeTab={activeTab}
        onChangeActiveTab={(val) => setActiveTab(val)}
      >
        <TabPanel value={activeTab} index={0}>
          <div>Chờ xử lý</div>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <div>Đang chế biến</div>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <div>Đang giao</div>
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <div>Đã giao</div>
        </TabPanel>
        <TabPanel value={activeTab} index={4}>
          <div>Đã hủy</div>
        </TabPanel>
      </CustomTabs>
    </div>
  );
}

function OrderDetail(props) {
  const { reservationId, isModalVisible, handleCloseModal } = props;
  return (
    <Modal
      isModalVisible={isModalVisible}
      handleCloseModal={handleCloseModal}
      title='Thông tin đặt lịch'
    >
      <Grid container>
        <Grid item xs={3}>
          <Typography style={{ fontWeight: 500 }}>Khách hàng</Typography>
          <Typography style={{ fontWeight: 500 }}>SĐT</Typography>
          <Typography style={{ fontWeight: 500 }}>SL khách</Typography>
          <Typography style={{ fontWeight: 500 }}>Thời gian</Typography>
          <Typography style={{ fontWeight: 500 }}>Địa chỉ</Typography>
          <Typography style={{ fontWeight: 500 }}>Bàn được xếp</Typography>
          <Typography style={{ fontWeight: 500 }}>Trạng thái</Typography>
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <Typography>A Quân</Typography>
          <Typography>0384426529</Typography>
          <Typography>10</Typography>

          <Typography>14/8/2022 18:30</Typography>
          <Typography>ABC, XYZ</Typography>
          <Typography>Bàn 1, Bàn 2, Bàn 3</Typography>

          <ChipLabel label='Chờ xác nhận' variant='info' />
        </Grid>
      </Grid>
      <div style={{ display: "flex", float: "right", marginTop: "1rem" }}>
        <Button variant='contained' color='secondary'>
          Hủy đặt lịch
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
}

function Profile(props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <CustomerMain>
      <div
        style={{
          padding: "3rem 6rem",
          height: "100%",
        }}
      >
        <Paper
          style={{
            display: "flex",
            height: "100%",
          }}
        >
          <div className='edit__options__container'>
            <List>
              {["Thông tin chung", "Đặt lịch của tôi", "Đơn đặt của tôi"].map(
                (text, index) => (
                  <MenuItem
                    button
                    key={text}
                    className='sidebar__item'
                    selected={selectedIndex === index}
                  >
                    <ListItemText
                      primary={text}
                      onClick={() => setSelectedIndex(index)}
                    />
                  </MenuItem>
                )
              )}
            </List>
          </div>
          <div style={{ marginLeft: "1rem", flex: 1, padding: "2rem" }}>
            {selectedIndex === 0 ? (
              <>
                <div className='edit__info__form'>
                  <Box component='form' noValidate>
                    <TextField
                      margin='normal'
                      fullWidth
                      id='name'
                      label='Name'
                      name='name'
                    />
                    <TextField
                      margin='normal'
                      fullWidth
                      id='username'
                      label='Username'
                      name='username'
                    />
                    <TextField
                      margin='normal'
                      fullWidth
                      id='bio'
                      label='Bio'
                      name='bio'
                    />
                    <div className='submit__btn__container'>
                      <Button variant='contained' color='primary'>
                        Submit
                      </Button>
                    </div>
                  </Box>
                </div>
              </>
            ) : selectedIndex === 1 ? (
              <div>
                <ReservationList />
              </div>
            ) : (
              <div>
                <OrderList />
              </div>
            )}
          </div>
        </Paper>
      </div>
    </CustomerMain>
  );
}

export default Profile;

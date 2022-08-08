import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
} from "@material-ui/core";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ReceiptIcon from "@material-ui/icons/Receipt";
import PeopleIcon from "@material-ui/icons/People";

import Main from "../../../containers/Main/Main";
import CustomAccordion from "../../../components/CustomAccordion/CustomAccordion";
import VerticalBarChart from "../../../components/Chart/VerticalBarChart";
import LineChart from "../../../components/Chart/LineChart";
import HorizontalBarChart from "../../../components/Chart/HorizontalBarChart";
import PieChart from "../../../components/Chart/PieChart";

const defaultData = {
  todayResult: {
    finishedOrders: {
      quantity: 4,
      revenue: 1800000,
    },
    ongoingOrders: {
      quantity: 2,
      revenue: 500000,
    },
    customerQuantity: 30,
  },
  monthRevenues: {
    colType: "hourly",
    type: "monthly",
    cols: [],
    data: [
      {
        label: "Đơn phục vụ tại nhà hàng",
        data: [100, 200, 300, 400, 500, 600, 700],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Đơn mang về",
        data: [200, 200, 400, 400, 500, 600, 700],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Đơn giao đi",
        data: [700, 200, 900, 400, 500, 600, 700],
        backgroundColor: "rgba(0, 128, 0, 0.5)",
      },
    ],
  },
  branchBasedRevenues: {
    type: "monthly",
    labels: [],
    data: [],
  },
  customerQuantities: {
    colType: "hourly",
    type: "monthly",
    cols: [],
    data: [
      {
        label: "Chi nhánh Hà Nội",
        data: [100, 200, 300, 400, 500, 600, 300],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Chi nhánh Đà Nẵng",
        data: [200, 200, 400, 400, 500, 600, 400],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Chi nhánh TP.HCM",
        data: [700, 200, 900, 400, 500, 600, 200],
        borderColor: "rgb(0, 128, 0)",
        backgroundColor: "rgba(0, 128, 0, 0.5)",
      },
    ],
  },
  trendingGoods: {
    cols: [],
    data: [],
  },
};

const defaultCols = {
  hourly: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
  dayInWeek: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
};

function Dashboard(props) {
  const [dashboardData, setDashboardData] = useState(defaultData);
  return (
    <Main>
      <Card style={{ marginBottom: "1rem" }}>
        <CardHeader title='Kết quả bán hàng hôm nay' />
        <CardContent>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                marginRight: "1rem",
                borderRight: "1px solid",
              }}
            >
              <MonetizationOnIcon />
              <div style={{ marginLeft: "1rem" }}>
                <Typography>{`${dashboardData.todayResult.finishedOrders.quantity} đơn đã xong`}</Typography>
                <Typography variant='h6' color='primary'>
                  {dashboardData.todayResult.finishedOrders.revenue}
                </Typography>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                marginRight: "1rem",
                borderRight: "1px solid",
              }}
            >
              <ReceiptIcon />
              <div style={{ marginLeft: "1rem" }}>
                <Typography>{`${dashboardData.todayResult.ongoingOrders.quantity} đơn đang phục vụ`}</Typography>
                <Typography variant='h6' color='primary'>
                  {dashboardData.todayResult.ongoingOrders.revenue}
                </Typography>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                marginRight: "1rem",
                borderRight: "1px solid",
              }}
            >
              <PeopleIcon />
              <div style={{ marginLeft: "1rem" }}>
                <Typography>Khách hàng</Typography>
                <Typography variant='h6' color='primary'>
                  {dashboardData.todayResult.customerQuantity}
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <CustomAccordion
        style={{ marginBottom: "2rem" }}
        title='DOANH THU THÁNG NÀY'
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <TextField select SelectProps={{ native: true }}>
              <option>Theo ngày</option>
              <option>Theo giờ</option>
              <option>Theo thứ</option>
            </TextField>
            <TextField select SelectProps={{ native: true }}>
              <option>Tháng này</option>
              <option>7 ngày vừa qua</option>
              <option>Hôm nay</option>
            </TextField>
          </div>
          <VerticalBarChart
            title='Doanh số tháng này'
            labels={defaultCols[dashboardData.monthRevenues.colType]}
            data={dashboardData.monthRevenues.data}
          />
        </div>
      </CustomAccordion>
      <CustomAccordion
        style={{ marginBottom: "2rem" }}
        title='SỐ LƯỢNG KHÁCH THÁNG NÀY'
      >
        <div style={{ flex: 1 }}>
          <LineChart
            title='Số lượng khách'
            labels={defaultCols[dashboardData.customerQuantities.colType]}
            data={dashboardData.customerQuantities.data}
          />
        </div>
      </CustomAccordion>
      <CustomAccordion
        style={{ marginBottom: "2rem" }}
        title='HÀNG HÓA BÁN CHẠY'
      >
        <div style={{ flex: 1 }}>
          <HorizontalBarChart
            title='Món bán chạy'
            labels={[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
            ]}
            data={[
              {
                label: "Dataset 1",
                data: [1, 2, 3, 4, 5, 6, 7],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
            ]}
          />
        </div>
      </CustomAccordion>
    </Main>
  );
}

export default Dashboard;

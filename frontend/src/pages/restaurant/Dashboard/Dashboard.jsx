import React, { useCallback, useEffect, useState } from "react";

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
import {
  getFavoriteItems,
  getMonthlyCustomerReport,
  getMonthlyRevenueReport,
  getTodayReport,
} from "../../../apis/report";

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
  favoriteItems: {
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
  const [filterParams, setFilterParams] = useState({
    monthRevenues: {
      colType: "dayInMonth",
      type: "monthly",
    },
    customerQuantities: {
      colType: "dayInMonth",
      type: "monthly",
    },
    favoriteItems: {
      type: "quantity",
    },
  });

  const fetchDashboardData = useCallback(async () => {
    const todayReportRes = await getTodayReport();
    const monthlyCustomerReportRes = await getMonthlyCustomerReport();
    const monthlyRevenueReportRes = await getMonthlyRevenueReport();
    const favoriteItemsRes = await getFavoriteItems();

    setDashboardData({
      ...dashboardData,
      todayResult: todayReportRes.data,
      monthRevenues: {
        labels:
          filterParams.monthRevenues.colType === "dayInMonth"
            ? Array(monthlyRevenueReportRes.data.length)
                .fill(0)
                .map((_, idx) => idx + 1)
            : defaultCols[filterParams.monthRevenues.colType],
        data: [
          {
            label: "Đơn phục vụ tại nhà hàng",
            data: monthlyRevenueReportRes.data,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      },
      customerQuantities: {
        labels:
          filterParams.customerQuantities.colType === "dayInMonth"
            ? Array(monthlyRevenueReportRes.data.length)
                .fill(0)
                .map((_, idx) => idx + 1)
            : defaultCols[filterParams.customerQuantities.colType],
        data: [
          {
            label: "Số lượng khách",
            data: monthlyCustomerReportRes.data,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      },
      favoriteItems: {
        labels: favoriteItemsRes.data.map((item) => item.name),
        data: [
          {
            label:
              filterParams.favoriteItems.type === "quantity"
                ? "Số lượng bán"
                : "Doanh thu",
            data:
              filterParams.favoriteItems.type === "quantity"
                ? favoriteItemsRes.data.map((item) => item.quantity)
                : favoriteItemsRes.data.map(
                    (item) => item.sale_price * item.quantity
                  ),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      },
    });
  }, [filterParams, dashboardData]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("dashboardr data: ", dashboardData);
  }, [dashboardData]);

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
            <TextField
              select
              value={filterParams.monthRevenues.colType}
              onChange={(e) =>
                setFilterParams({
                  ...filterParams,
                  monthRevenues: {
                    ...filterParams.monthRevenues,
                    colType: e.target.value,
                  },
                })
              }
              SelectProps={{ native: true }}
            >
              <option value='dayInMonth'>Theo ngày</option>
              <option value='hourly'>Theo giờ</option>
              <option value='dayInWeek'>Theo thứ</option>
            </TextField>
            <TextField
              select
              value={filterParams.monthRevenues.type}
              onChange={(e) =>
                setFilterParams({
                  ...filterParams,
                  monthRevenues: {
                    ...filterParams.monthRevenues,
                    type: e.target.value,
                  },
                })
              }
              SelectProps={{ native: true }}
            >
              <option value='month'>Tháng này</option>
              <option value='week'>7 ngày vừa qua</option>
              <option value='today'>Hôm nay</option>
            </TextField>
          </div>
          <VerticalBarChart
            title='Doanh số tháng này'
            labels={dashboardData.monthRevenues.labels}
            data={dashboardData.monthRevenues.data}
          />
        </div>
      </CustomAccordion>
      <CustomAccordion
        style={{ marginBottom: "2rem" }}
        title='SỐ LƯỢNG KHÁCH THÁNG NÀY'
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <TextField
              select
              value={filterParams.customerQuantities.colType}
              onChange={(e) =>
                setFilterParams({
                  ...filterParams,
                  customerQuantities: {
                    ...filterParams.customerQuantities,
                    colType: e.target.value,
                  },
                })
              }
              SelectProps={{ native: true }}
            >
              <option value='dayInMonth'>Theo ngày</option>
              <option value='hourly'>Theo giờ</option>
              <option value='dayInWeek'>Theo thứ</option>
            </TextField>
            <TextField
              select
              value={filterParams.customerQuantities.type}
              onChange={(e) =>
                setFilterParams({
                  ...filterParams,
                  customerQuantities: {
                    ...filterParams.customerQuantities,
                    type: e.target.value,
                  },
                })
              }
              SelectProps={{ native: true }}
            >
              <option value='month'>Tháng này</option>
              <option value='week'>7 ngày vừa qua</option>
              <option value='today'>Hôm nay</option>
            </TextField>
          </div>
          <VerticalBarChart
            title='Số lượng khách'
            labels={dashboardData.customerQuantities.labels}
            data={dashboardData.customerQuantities.data}
          />
        </div>
      </CustomAccordion>
      <CustomAccordion
        style={{ marginBottom: "2rem" }}
        title='HÀNG HÓA BÁN CHẠY'
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <TextField
              select
              value={filterParams.favoriteItems.type}
              onChange={(e) =>
                setFilterParams({
                  ...filterParams,
                  favoriteItems: {
                    ...filterParams.favoriteItems,
                    type: e.target.value,
                  },
                })
              }
              SelectProps={{ native: true }}
            >
              <option value='quantity'>Theo số lượng</option>
              <option value='revenue'>Theo doanh thu</option>
            </TextField>
          </div>
          <HorizontalBarChart
            title='Món bán chạy'
            labels={dashboardData.favoriteItems.labels}
            data={dashboardData.favoriteItems.data}
          />
        </div>
      </CustomAccordion>
    </Main>
  );
}

export default Dashboard;

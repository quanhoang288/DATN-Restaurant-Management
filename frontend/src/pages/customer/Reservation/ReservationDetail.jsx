import React, { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import CustomerMain from "../../../containers/CustomerMain/CustomerMain";
import { Autocomplete } from "@material-ui/lab";
import { useCallback } from "react";
import { createReservation, getReservation } from "../../../apis/reservation";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { borderRadius } from "@mui/system";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ChipLabel from "../../../components/ChipLabel/ChipLabel";
import { formatDate } from "../../../utils/date";

const defaultReservationData = {
  arriveTime: null,
  customerId: null,
  customerName: null,
  phoneNumber: null,
  numPeople: null,
  note: "",
  status: "pending",
};

export default function ReservationDetail(props) {
  const [reservationData, setReservationData] = useState(
    defaultReservationData
  );

  const { id } = useParams();

  const history = useHistory();

  const fetchReservationData = async (id) => {
    if (id) {
      const reservation = (await getReservation(id)).data;
      if (reservation) {
        setReservationData({
          arriveTime: formatDate(reservation.arrive_time, "DD/MM/YYYY hh:mm"),
          customerId: reservation.customer_id,
          customerName: reservation.customer_name,
          phoneNumber: reservation.customer_phone_number,
          numPeople: reservation.num_people,
          note: reservation.note,
          status:
            reservation.status === "pending"
              ? { name: "Đang xử lý", variant: "info" }
              : reservationData.status === "confirmed"
              ? { name: "Đã xác nhận", variant: "primary" }
              : { name: "Đã nhận bàn", variant: "success" },
        });
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchReservationData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <CustomerMain>
      <Paper
        style={{
          // background: "#f5f5f5",
          height: "100%",
          // width: "100%",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          padding: "2rem 5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card style={{ flex: 1, height: "90%" }}>
          <CardHeader title='Thông tin đặt chỗ' />
          <CardContent>
            <Grid container>
              <Grid item xs={4}>
                <Typography style={{ fontWeight: 500 }}>
                  Tên khách hàng{" "}
                </Typography>
                <Typography style={{ fontWeight: 500 }}>SĐT </Typography>
                <Typography style={{ fontWeight: 500 }}>
                  Thời gian đến{" "}
                </Typography>
                <Typography style={{ fontWeight: 500 }}>
                  Số lượng khách{" "}
                </Typography>
                <Typography style={{ fontWeight: 500 }}>
                  Ghi chú cho nhà hàng{" "}
                </Typography>
                <Typography style={{ fontWeight: 500 }}>Trạng thái </Typography>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={4}>
                <Typography>{reservationData.customerName}</Typography>
                <Typography>{reservationData.phoneNumber}</Typography>
                <Typography>{reservationData.arriveTime}</Typography>
                <Typography>{reservationData.numPeople}</Typography>
                <Typography>{reservationData.note || "Không"}</Typography>
                <ChipLabel
                  label={reservationData.status?.name}
                  variant={reservationData.status?.variant}
                />
              </Grid>
            </Grid>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Button variant='contained' onClick={() => history.push("/home")}>
                Về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </Paper>
    </CustomerMain>
  );
}

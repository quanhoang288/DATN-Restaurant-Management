import React, { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  TextField,
} from "@material-ui/core";
import CustomerMain from "../../../containers/CustomerMain/CustomerMain";
import { Autocomplete } from "@material-ui/lab";
import { useCallback } from "react";
import { createReservation } from "../../../apis/reservation";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const defaultReservationData = {
  arriveTime: null,
  customerId: null,
  customerName: null,
  phoneNumber: null,
  numPeople: null,
  note: "",
  status: "pending",
};

export default function Reservation(props) {
  const [reservationData, setReservationData] = useState(
    defaultReservationData
  );
  const [errors, setErrors] = useState({});
  const [isValidationFailedBefore, setValidationFailedBefore] = useState(false);

  const authUser = useSelector((state) => state.auth.user);
  const history = useHistory();

  const validateReservationData = useCallback(
    (data) => {
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

      if (!isValid && !isValidationFailedBefore) {
        setValidationFailedBefore(true);
      }
      setErrors(newErrors);
      return isValid;
    },
    [isValidationFailedBefore]
  );

  const handleSubmit = useCallback(async () => {
    if (!validateReservationData(reservationData)) {
      return;
    }

    const postData = {
      arrive_time: reservationData.arriveTime,
      customer_id: reservationData.customerId,
      customer_name: reservationData.customerName,
      customer_phone_number: reservationData.phoneNumber,
      num_people: reservationData.numPeople,
      note: reservationData.note,
      status: reservationData.status,
    };
    const reservation = (await createReservation(postData)).data;
    if (reservation) {
      history.push(`/reservations/${reservation.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationData]);

  useEffect(() => {
    if (authUser) {
      setReservationData({
        ...defaultReservationData,
        customerName: authUser.full_name,
        customerId: authUser.id,
        phoneNumber: authUser.phone_number,
      });
    }
  }, [authUser]);

  useEffect(() => {
    if (isValidationFailedBefore) {
      validateReservationData(reservationData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationData, isValidationFailedBefore]);

  return (
    <CustomerMain>
      <div style={{ padding: "2rem 5rem" }}>
        <Card>
          <CardHeader title='Đặt chỗ' />
          <CardContent>
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
                required
                error={errors.arriveTime !== undefined}
                helperText={errors.arriveTime}
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
                required
                error={errors.numPeople !== undefined}
                helperText={errors.numPeople}
              />
            </div>
            <div style={{ display: "flex", marginTop: 20, marginBottom: 20 }}>
              <TextField
                label='Khách hàng'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                required
                style={{ minWidth: 250 }}
                // margin='normal'
                value={reservationData.customerName}
                error={errors.customerName !== undefined}
                helperText={errors.customerName}
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
                style={{ marginLeft: 50, minWidth: 250 }}
                required
                error={errors.phoneNumber !== undefined}
                helperText={errors.phoneNumber}
              />
            </div>
            <TextField
              label='Ghi chú cho nhà hàng'
              value={reservationData.note}
              onChange={(e) =>
                setReservationData({ ...reservationData, note: e.target.value })
              }
              variant='outlined'
              fullWidth
              multiline
              rows={4}
              style={{ marginTop: 10 }}
            />
            <div
              style={{
                display: "flex",
                marginTop: "1rem",
                justifyContent: "center",
              }}
            >
              <Button
                variant='contained'
                color='primary'
                onClick={handleSubmit}
              >
                Lưu
              </Button>
              <Button
                variant='contained'
                onClick={() => setReservationData(defaultReservationData)}
              >
                Tạo lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerMain>
  );
}

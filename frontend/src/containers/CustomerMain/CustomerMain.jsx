import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerFooter from "../../components/Footer/CustomerFooter";
import CustomerHeader from "../../components/Header/CustomerHeader";
import Toast from "../../components/Toast/Toast";
import { registerReset } from "../../redux/actions/authActions";

function CustomerMain({ includeFooter, children }) {
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  return (
    <>
      {authState.registerSuccess && (
        <Toast
          variant='success'
          message='Đăng ký tài khoản thành công'
          handleClose={() => dispatch(registerReset())}
        />
      )}
      <section>
        <header>
          <CustomerHeader />
        </header>
      </section>
      <section style={{ height: "90vh" }}>
        <div style={{ background: "#f5f5f5", height: "100%" }}>{children}</div>
      </section>
      {includeFooter && <section>{/* <CustomerFooter /> */}</section>}
    </>
  );
}

CustomerMain.defaultProps = {
  includeFooter: true,
};

export default CustomerMain;

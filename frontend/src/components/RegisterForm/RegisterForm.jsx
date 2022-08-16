import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
} from "@material-ui/core";
import Layout from "../../containers/Layout/Layout";
import { REGISTER_MODAL } from "../../constants";
import { useSelector } from "react-redux";

function RegisterForm(props) {
  const {
    registerInfo,
    registerErrors,
    handleLoginClick,
    handleSubmit,
    handleTextChange,
  } = props;

  const isRegistering = useSelector((state) => state.auth.isRegistering);

  return (
    <Layout>
      <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email'
          name='email'
          value={registerInfo.email}
          onChange={(e) =>
            handleTextChange(REGISTER_MODAL, e.target.name, e.target.value)
          }
          error={registerErrors.email !== undefined}
          helperText={registerErrors.email}
          autoFocus
        />
        <div style={{ display: "flex" }}>
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Mật khẩu'
            type='password'
            id='password'
            value={registerInfo.password}
            onChange={(e) =>
              handleTextChange(REGISTER_MODAL, e.target.name, e.target.value)
            }
            style={{ marginRight: "2rem" }}
            error={registerErrors.password !== undefined}
            helperText={registerErrors.password}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='confirmPassword'
            label='Xác nhận mật khẩu'
            type='password'
            id='confirm-password'
            value={registerInfo.confirmPassword}
            onChange={(e) =>
              handleTextChange(REGISTER_MODAL, e.target.name, e.target.value)
            }
            error={registerErrors.confirmPassword !== undefined}
            helperText={registerErrors.confirmPassword}
          />
        </div>
        <div style={{ display: "flex" }}>
          <TextField
            margin='normal'
            required
            fullWidth
            name='full_name'
            label='Tên'
            value={registerInfo.full_name}
            onChange={(e) =>
              handleTextChange(REGISTER_MODAL, e.target.name, e.target.value)
            }
            style={{ marginRight: "2rem" }}
            error={registerErrors.full_name !== undefined}
            helperText={registerErrors.full_name}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='phone_number'
            label='SĐT'
            value={registerInfo.phone_number}
            onChange={(e) =>
              handleTextChange(REGISTER_MODAL, e.target.name, e.target.value)
            }
            error={registerErrors.phone_number !== undefined}
            helperText={registerErrors.phone_number}
          />
        </div>

        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='secondary'
          className='submit__btn'
          onClick={handleSubmit}
          disabled={
            !(
              registerInfo.email &&
              registerInfo.password &&
              registerInfo.confirmPassword &&
              registerInfo.full_name &&
              registerInfo.phone_number
            )
          }
        >
          {isRegistering && <CircularProgress />}
          {!isRegistering && "Đăng ký"}
        </Button>
        <div className='text__center'>
          <Link href='#' variant='body2' onClick={handleLoginClick}>
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </Box>
    </Layout>
  );
}

export default RegisterForm;

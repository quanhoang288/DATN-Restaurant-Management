import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Box, Button, CircularProgress, Container, CssBaseline, Link, TextField, Typography } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../../../redux/actions'
import { authApi } from '../../../apis'
import { loginSuccess } from '../../../redux/actions/authActions'
import { errorMessages } from '../../../constants/messages'
import Toast from '../../../components/Toast/Toast'
import { useHistory } from 'react-router-dom'
import routes from '../../../constants/route'

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        Quản lý nhà hàng
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function AdminAuth() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const authState = useSelector((state) => state.auth)

  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false)

  const history = useHistory()
  const classes = useStyles()
  const dispatch = useDispatch()

  const isValidCredentials = (credentials) => {
    const { email, password } = credentials
    return email !== '' && password !== '' && password.length > 5 && password.length < 256
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    dispatch(authActions.loginRequest())
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
    try {
      const loginResult = await authApi.login(credentials)
      const { data } = loginResult
      const user = {
        ...data.user,
        token: data.token,
      }
      dispatch(loginSuccess(user))
    } catch (err) {
      const res = err.response
      let errMsg
      if (res && res.status === 400) {
        errMsg = errorMessages.INCORRECT_EMAIL_OR_PASSWORD
      } else {
        errMsg = errorMessages.INTERNAL_SERVER_ERROR
      }
      dispatch(authActions.loginFailure(errMsg))
    }
  }

  useEffect(() => {
    setLoginButtonDisabled(!isValidCredentials(credentials))
  }, [credentials])

  useEffect(() => {
    if (authState.user) {
      history.push(routes.DASHBOARD)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState])

  return (
    <Container component='main' maxWidth='xs'>
      {authState.error && <Toast variant='error' message={authState.error} />}

      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Đăng nhập
        </Typography>

        <form className={classes.form} onSubmit={handleLogin}>
          <TextField
            margin='normal'
            fullWidth
            id='email'
            label='Email'
            name='email'
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            autoFocus
          />
          <TextField
            margin='normal'
            fullWidth
            name='password'
            label='Mật khẩu'
            type='password'
            id='password'
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            autoComplete='current-password'
          />
          <Button
            type='submit'
            fullWidth
            className='submit__btn'
            variant='contained'
            color='primary'
            sx={{ mt: 3, mb: 2 }}
            disabled={loginButtonDisabled}
          >
            {authState.isLoggingIn ? <CircularProgress size={30} style={{ color: 'white' }} /> : 'Đăng nhập'}
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}


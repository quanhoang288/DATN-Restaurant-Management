import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../components/Modal/Modal'
import LoginForm from '../../components/LoginForm/LoginForm'
import RegisterForm from '../../components/RegisterForm/RegisterForm'
import { LOGIN_MODAL, REGISTER_MODAL } from '../../constants'
import { hideModal } from '../../redux/actions/modalActions'
import { authActions } from '../../redux/actions'
import { authApi } from '../../apis'
import { loginSuccess, registerSuccess } from '../../redux/actions/authActions'
import { errorMessages } from '../../constants/messages'

function AuthHandler(props) {
  const { isAdminAuthentication } = props
  const [curModal, setCurModal] = useState(LOGIN_MODAL)
  const [registerInfo, setRegisterInfo] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false)
  const [registerErrors, setRegisterErrors] = useState({})
  const [registerFailedBefore, setRegisterFailedBefore] = useState(false)

  const isModalVisible = useSelector((state) => state.modal.isModalVisible)
  const authenticatedUser = useSelector((state) => state.auth.user)

  const dispatch = useDispatch()

  const isValidCredentials = () => {
    const { email, password } = credentials
    return email !== '' && password !== '' && password.length > 5 && password.length < 256
  }

  const validateRegisterInfo = () => {
    const { email, password, confirmPassword } = registerInfo
    const errors = {}
    let isValid = true
    if (email === '') {
      isValid = false
      errors.email = errorMessages.EMAIL_REQUIRED
    }

    if (password === '') {
      isValid = false
      errors.password = errorMessages.PASSWORD_REQUIRED
    } else if (password.length < 6 || password.length > 255) {
      isValid = false
      errors.password = errorMessages.PASSWORD_LENGTH_INVALID
    }

    if (confirmPassword === '') {
      isValid = false
      errors.confirmPassword = errorMessages.CONFIRM_PASSWORD_REQUIRED
    } else if (confirmPassword !== password) {
      isValid = false
      errors.confirmPassword = errorMessages.CONFIRM_PASSWORD_NOT_MATCH
    }
    setRegisterErrors({
      ...errors,
    })
    return isValid
  }

  const resetInputAndErrorStates = () => {
    setCredentials({
      email: '',
      password: '',
    })
    setRegisterInfo({
      email: '',
      password: '',
      confirmPassword: '',
    })
    setRegisterErrors({})
    setRegisterFailedBefore(false)
  }

  const handleCloseModal = () => {
    dispatch(hideModal())
  }

  useEffect(() => {
    if (authenticatedUser) {
      handleCloseModal()
    }
  }, [authenticatedUser])

  useEffect(() => {
    if (isModalVisible) {
      setCurModal(LOGIN_MODAL)
      resetInputAndErrorStates()
    }
  }, [isModalVisible])

  useEffect(() => {
    setLoginButtonDisabled(!isValidCredentials())
  }, [credentials])

  useEffect(() => {
    if (registerFailedBefore) {
      validateRegisterInfo()
    }
  }, [registerInfo])

  const handleTextChange = (modalType, name, val) => {
    if (modalType === LOGIN_MODAL) {
      setCredentials({
        ...credentials,
        [name]: val,
      })
    } else {
      setRegisterInfo({
        ...registerInfo,
        [name]: val,
      })
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    dispatch(authActions.loginRequest())
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
        errMsg = errorMessages.INCORRECT_email_OR_PASSWORD
      } else {
        errMsg = errorMessages.INTERNAL_SERVER_ERROR
      }
      dispatch(authActions.loginFailure(errMsg))
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const isValidRegisterInfo = validateRegisterInfo()
    if (!isValidRegisterInfo) {
      setRegisterFailedBefore(true)
      return
    }

    dispatch(authActions.registerRequest())
    try {
      const registerData = {
        email: registerInfo.email,
        password: registerInfo.password,
      }
      const registerResult = await authApi.register(registerData)
      const { data } = registerResult
      const user = {
        ...data.user,
        token: data.token,
      }
      dispatch(registerSuccess(user))
    } catch (err) {
      const res = err.response
      let errMsg
      if (res && res.status === 400) {
        errMsg = errorMessages.email_ALREADY_EXIST
      } else {
        errMsg = errorMessages.INTERNAL_SERVER_ERROR
      }
      dispatch(authActions.registerFailure(errMsg))
    }
  }

  return (
    <Modal isModalVisible={isModalVisible} handleClose={handleCloseModal} title={curModal === LOGIN_MODAL ? 'Đăng nhập' : 'Đăng ký'}>
      {curModal === LOGIN_MODAL ? (
        <LoginForm
          credentials={credentials}
          handleTextChange={handleTextChange}
          handleRegisterClick={() => setCurModal(REGISTER_MODAL)}
          handleSubmit={handleLogin}
          submitButtonDisabled={loginButtonDisabled}
          isAdminAuthentication={isAdminAuthentication}
        />
      ) : (
        <RegisterForm
          registerInfo={registerInfo}
          registerErrors={registerErrors}
          handleTextChange={handleTextChange}
          handleSubmit={handleRegister}
          handleLoginClick={() => setCurModal(LOGIN_MODAL)}
        />
      )}
    </Modal>
  )
}

AuthHandler.defaultProps = {
  isAdminAuthentication: false,
}

export default AuthHandler


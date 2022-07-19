import api from './api'

const register = async (registerInfo) => {
  const registerResult = await api({
    method: 'POST',
    url: '/auth/register',
    data: registerInfo,
  })
  return registerResult
}

const login = async (credentials) => {
  const loginResult = await api({
    method: 'POST',
    url: '/auth/login',
    data: credentials,
  })
  return loginResult
}

export { register, login }


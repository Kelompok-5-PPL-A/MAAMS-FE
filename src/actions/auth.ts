import axios, { AxiosRequestConfig } from 'axios'

const customHeaders = {
  Accept: '*/*',
  'Content-Type': 'application/json'
}

export const login = async (username: string, password: string) => {
  const config: AxiosRequestConfig = {
    headers: customHeaders
  }

  return await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login/`, { username, password }, config)
}

export const register = async (username: string, email: string, password: string, password2: string) => {
  const config: AxiosRequestConfig = {
    headers: customHeaders
  }

  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register/`,
    { username, email, password, password2 },
    config
  )
}

export const logout = async (refresh_token: string) => {
  const config: AxiosRequestConfig = {
    headers: customHeaders
  }

  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/logout/`,
    { refresh: refresh_token },
    config
  )
}

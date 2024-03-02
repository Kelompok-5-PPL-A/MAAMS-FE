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

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { login, register, logout, refreshToken } from '../../actions/auth'

const mock = new MockAdapter(axios)

describe('Authentication API', () => {
  afterEach(() => {
    mock.reset()
  })

  it('should login successfully', async () => {
    const mockResponse = { access: 'mock_access_token', refresh: 'mock_refresh_token' }
    mock.onPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login/`).reply(200, mockResponse)

    const response = await login('mock_username', 'mock_password')
    expect(response.data).toEqual(mockResponse)
  })

  it('should register successfully', async () => {
    const mockResponse = { message: 'User registered successfully' }
    mock.onPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register/`).reply(200, mockResponse)

    const response = await register('mock_username', 'mock_email', 'mock_password', 'mock_password2')
    expect(response.data).toEqual(mockResponse)
  })

  it('should logout successfully', async () => {
    const mockResponse = { message: 'Logout successful' }
    mock.onPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/logout/`).reply(200, mockResponse)

    const response = await logout('mock_refresh_token')
    expect(response.data).toEqual(mockResponse)
  })

  it('should refresh token successfully', async () => {
    const mockResponse = { access: 'mock_new_access_token' }
    mock.onPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/token/refresh/`).reply(200, mockResponse)

    const response = await refreshToken('mock_refresh_token')
    expect(response.data).toEqual(mockResponse)
  })
})

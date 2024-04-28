import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import mockNextRouter from 'next-router-mock'
import Login from '../../pages/login/index'

jest.mock('next/router', () => require('next-router-mock'))

jest.mock('../../actions/auth', () => ({
  login: jest.fn()
}))

jest.mock('../../assets/maams.png', () => ({
  src: 'fake-maams-image'
}))

class LocalStorageMock {
  store: { [key: string]: any }
  length: number

  constructor() {
    this.store = {}
    this.length = 0
  }

  getItem(key: string) {
    return this.store[key] || null
  }

  setItem(key: string, value: string) {
    this.store[key] = value.toString()
    this.length = Object.keys(this.store).length
  }

  clear() {
    this.store = {}
    this.length = 0
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null
  }

  removeItem(key: string) {
    delete this.store[key]
    this.length = Object.keys(this.store).length
  }
}
global.localStorage = new LocalStorageMock()

describe('Login Page', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders the login form', async () => {
    const { getByLabelText, getByText } = render(<Login />)

    expect(getByLabelText('Username')).toBeInTheDocument()
    expect(getByLabelText('Password')).toBeInTheDocument()
    expect(getByText('Masuk', { exact: true })).toBeInTheDocument()
  })

  test('handles form submission', async () => {
    const routerPushMock = jest.fn()
    mockNextRouter.push = routerPushMock

    const { getByLabelText, getByText } = render(<Login />)
    const usernameInput = getByLabelText('Username')
    const passwordInput = getByLabelText('Password')

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })

    jest.requireMock('../../actions/auth').login.mockResolvedValueOnce({
      status: 200,
      data: {
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
        data: {
          uuid: 'mockUUID',
          username: 'mockUsername',
          email: 'mockEmail',
          first_name: 'mockFirstName',
          last_name: 'mockLastName',
          date_joined: 'mockDateJoined',
          is_active: 'mockIsActive'
        },
        detail: 'Successfully logged in.'
      }
    })

    fireEvent.click(getByText('Masuk', { exact: true }))
    waitFor(() => {
      setTimeout(function () {
        expect(routerPushMock).toHaveBeenCalledWith('/')
      }, 500)
    })
  })

  test('displays error message for invalid login', async () => {
    jest.requireMock('../../actions/auth').login.mockRejectedValueOnce({
      response: {
        data: { detail: 'Invalid credentials' }
      }
    })
    const routerPushMock = jest.fn()
    mockNextRouter.push = routerPushMock

    const { getByLabelText, getByText } = render(<Login />)
    const usernameInput = getByLabelText('Username')
    const passwordInput = getByLabelText('Password')

    fireEvent.change(usernameInput, { target: { value: 'invaliduser' } })
    fireEvent.change(passwordInput, { target: { value: 'invalidpassword' } })
    fireEvent.click(getByText('Masuk', { exact: true }))

    setTimeout(function () {
      expect(getByText('Invalid credentials')).toBeInTheDocument()
      expect(routerPushMock).not.toHaveBeenCalled()
    }, 500)
  })

  test('calls onBlur handler when username input loses focus', () => {
    localStorage.setItem('usernameFocus', 'true')

    const { getByLabelText } = render(<Login />)
    const usernameInput = getByLabelText('Username')
    const passwordInput = getByLabelText('Password')

    fireEvent.blur(usernameInput)
    fireEvent.change(passwordInput, { target: { value: 'Sample Pass' } })

    waitFor(() => {
      expect(localStorage.getItem('usernameFocus')).toBe('false')
    })
  })

  test('calls onBlur handler when password input loses focus', () => {
    localStorage.setItem('passwordFocus', 'true')

    const { getByLabelText } = render(<Login />)
    const passwordInput = getByLabelText('Password')
    const usernameInput = getByLabelText('Username')

    fireEvent.blur(passwordInput)
    fireEvent.change(usernameInput, { target: { value: 'Sample Username' } })

    waitFor(() => {
      expect(localStorage.getItem('passwordFocus')).toBe('false')
    })
  })

  test('calls onFocus for password input', () => {
    localStorage.setItem('passwordFocus', 'true')

    const { getByLabelText } = render(<Login />)
    const passwordInput = getByLabelText('Password')

    fireEvent.focus(passwordInput)
    setTimeout(() => {
      expect(localStorage.getItem('passwordFocus')).toBe('true')
    }, 0)
  })

  test('redirects to register page when "Belum punya akun?" is clicked', async () => {
    const routerPushMock = jest.fn()
    mockNextRouter.push = routerPushMock

    const { getByText } = render(<Login />)
    const belumPunyaAkunLink = getByText('Daftar Sekarang')

    fireEvent.click(belumPunyaAkunLink)

    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith('/register')
    })
  })
})

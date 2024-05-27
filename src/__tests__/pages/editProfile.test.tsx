import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Index from '../../pages/editProfile/index'
import axios from 'axios'
import toast from 'react-hot-toast'

const mockPush = jest.fn()
const mockReload = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    reload: mockReload
  })
}))

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

beforeEach(() => {
  localStorage.clear()
  jest.clearAllMocks()
})

afterEach(() => {
  localStorage.clear()
  jest.clearAllMocks()
})

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

describe('Index Component', () => {
  it('should render with initial state', () => {
    const { getByText, getByPlaceholderText } = render(<Index />)

    expect(getByText('Profil')).toBeInTheDocument()
    expect(getByPlaceholderText('Username')).toBeInTheDocument()
    expect(getByPlaceholderText('Email')).toBeInTheDocument()
    expect(getByPlaceholderText('Password baru')).toBeInTheDocument()
    expect(getByPlaceholderText('Ulangi password baru')).toBeInTheDocument()
  })

  it('should update input values correctly', () => {
    const { getByPlaceholderText } = render(<Index />)
    const usernameInput = getByPlaceholderText('Username')
    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password baru')
    const confirmPasswordInput = getByPlaceholderText('Ulangi password baru')

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword' } })

    expect(usernameInput).toHaveValue('testuser')
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('newpassword')
    expect(confirmPasswordInput).toHaveValue('newpassword')
  })

  it('should handle save button click when only username is filled', async () => {
    const mockResponseData = { username: 'newuser', email: 'test@example.com' }
    mockedAxios.patch.mockResolvedValue({ data: mockResponseData })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    const { getByText, getByPlaceholderText } = render(<Index />)
    const saveButton = getByText('Simpan')
    const usernameInput = getByPlaceholderText('Username')

    fireEvent.change(usernameInput, { target: { value: 'newuser' } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(Object.getPrototypeOf(window.localStorage).setItem).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(mockResponseData)
      )
    })
  })

  it('should handle save button click when only email is filled', async () => {
    const mockResponseData = { username: 'testuser', email: 'newemail@example.com' }
    mockedAxios.patch.mockResolvedValue({ data: mockResponseData })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    const { getByText, getByPlaceholderText } = render(<Index />)
    const saveButton = getByText('Simpan')
    const emailInput = getByPlaceholderText('Email')

    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(Object.getPrototypeOf(window.localStorage).setItem).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(mockResponseData)
      )
    })
  })

  it('should handle save button click correctly with password match', async () => {
    const mockResponseData = { username: 'testuser', email: 'test@example.com' }
    mockedAxios.patch.mockResolvedValue({ data: mockResponseData })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    const { getByText, getByPlaceholderText } = render(<Index />)
    const saveButton = getByText('Simpan')

    const passwordInput = getByPlaceholderText('Password baru')
    const confirmPasswordInput = getByPlaceholderText('Ulangi password baru')

    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'testpassword' } })

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(Object.getPrototypeOf(window.localStorage).setItem).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(mockResponseData)
      )
    })
  })

  it('should handle save button click correctly with password mismatch', async () => {
    const { getByText, getByPlaceholderText } = render(<Index />)
    const saveButton = getByText('Simpan')
    const passwordInput = getByPlaceholderText('Password baru')
    const confirmPasswordInput = getByPlaceholderText('Ulangi password baru')

    fireEvent.change(passwordInput, { target: { value: 'newpassword' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'wrongpassword' } })

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(window.localStorage.setItem).not.toHaveBeenCalled()
    })
  })

  it('should handle cancel button click correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Index />)
    const cancelButton = getByText('Batal')
    const usernameInput = getByPlaceholderText('Username')

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.click(cancelButton)

    expect(usernameInput).toHaveValue('')
  })

  it('should handle save button click correctly with no changes', async () => {
    const { getByText } = render(<Index />)
    const saveButton = getByText('Simpan')

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(window.localStorage.setItem).not.toHaveBeenCalled()
    })
  })

  it('should handle save button click when error response 401', async () => {
    const errorResponse = {
      response: {
        status: 401,
        request: {
          responseText: JSON.stringify({ case_error: 'Unauthorized' })
        }
      }
    }
    mockedAxios.patch.mockRejectedValueOnce(errorResponse)

    localStorage.setItem('refresh', 'mock')

    const { getByText, getByPlaceholderText } = render(<Index />)
    const usernameInput = getByPlaceholderText('Username')
    fireEvent.change(usernameInput, { target: { value: 'newuser' } })

    const saveButton = getByText('Simpan')

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should handle save button and reload the page if provided a refresh token', async () => {
    const errorResponse = {
      response: {
        status: 401,
        request: {
          responseText: JSON.stringify({ case_error: 'Unauthorized' })
        }
      }
    }
    mockedAxios.patch.mockRejectedValueOnce(errorResponse)

    const mockNewRefreshToken = 'newRefreshToken'
    mockedAxios.post.mockResolvedValueOnce({ data: { refresh: mockNewRefreshToken } })

    localStorage.setItem('refresh', 'mock')

    const { getByText, getByPlaceholderText } = render(<Index />)
    const usernameInput = getByPlaceholderText('Username')
    fireEvent.change(usernameInput, { target: { value: 'newuser' } })

    const saveButton = getByText('Simpan')

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockReload).toHaveBeenCalled()
    })
  })

  it('should show error message when save button click with error response', async () => {
    const errorResponse = {
      response: {
        request: {
          responseText: JSON.stringify({ case_error: 'Backend Error Message' })
        }
      }
    }
    mockedAxios.patch.mockRejectedValueOnce(errorResponse)

    const { getByText, getByPlaceholderText } = render(<Index />)
    const usernameInput = getByPlaceholderText('Username')
    fireEvent.change(usernameInput, { target: { value: 'newuser' } })

    const saveButton = getByText('Simpan')

    fireEvent.click(saveButton)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Backend Error Message')
      }, 2000)
    })
  })
})

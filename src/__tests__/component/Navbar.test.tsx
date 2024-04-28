import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import Navbar from '../../components/navbar/navbar'
import '@testing-library/jest-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockPush = jest.fn()
const mockReload = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    reload: mockReload
  })
}))

const sampleUserData = {
  date_joined: '2024-04-27T08:00:00Z',
  email: 'john.doe@example.com',
  first_name: 'John',
  is_active: true,
  is_staff: false,
  last_name: 'Doe',
  username: 'johndoe',
  uuid: '123e4567-e89b-12d3-a456-426614174000'
}

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

describe('Navbar component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly when user is logged in', () => {
    localStorage.setItem('isLoggedIn', 'true')

    const { getByText } = render(<Navbar />)

    expect(getByText('Riwayat')).toBeInTheDocument()
    expect(getByText('Username')).toBeInTheDocument()
    expect(getByText('Tambahkan Analisis')).toBeInTheDocument()
  })

  test('renders correctly when user is not logged in', () => {
    localStorage.setItem('isLoggedIn', 'false')

    const { getByText } = render(<Navbar />)

    expect(getByText('Login')).toBeInTheDocument()
  })

  test('toggles menu when menu button is clicked on mobile layout', async () => {
    global.innerWidth = 480

    const { container } = render(<Navbar />)

    const menuButton = container.querySelector(
      'button[aria-controls="navbar-dropdown"][aria-expanded="false"][class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"]'
    )

    if (menuButton) {
      fireEvent.click(menuButton)
    }

    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    global.innerWidth = 1096
  })

  test('toggles dropdown when dropdown button is clicked', () => {
    localStorage.setItem('isLoggedIn', 'true')

    const { getByRole, getByText } = render(<Navbar />)

    const dropdownButton = getByRole('button', { name: /username/i })
    fireEvent.click(dropdownButton)

    expect(getByText('Edit Profile')).toBeInTheDocument()
    expect(getByText('Sign out')).toBeInTheDocument()
  })

  test('does not render Analisis Publik button when user is logged in but not is_superuser', () => {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('isStaff', 'false')
    const { queryByText } = render(<Navbar />)

    expect(queryByText('Analisis Publik')).toBeNull()
  })

  test('does not render Analisis Publik button when user is not logged in', () => {
    const { queryByText } = render(<Navbar />)
    localStorage.setItem('isLoggedIn', 'false')

    expect(queryByText('Analisis Publik')).toBeNull()
  })

  test('logs out successfully when refresh token exists', async () => {
    localStorage.setItem('isLoggedIn', 'true')
    const clearMock = jest.fn()

    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => {
      if (key === 'refresh') {
        return 'fake_refresh_token'
      } else if (key === 'userData') {
        return JSON.stringify(sampleUserData)
      } else if (key === 'isLoggedIn') {
        return 'true'
      } else {
        return null
      }
    })
    jest.spyOn(window.localStorage.__proto__, 'clear').mockImplementation(clearMock)

    mockedAxios.post.mockResolvedValueOnce({})

    const { getByText } = render(<Navbar />)

    fireEvent.click(getByText(sampleUserData.username))
    fireEvent.click(getByText('Sign out'))

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Logout successful', expect.any(Object))
      }, 10000)
    })

    expect(clearMock).toHaveBeenCalled()

    await waitFor(() => {
      setTimeout(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      }, 10000)
    })
  })

  test('redirects to login page when refresh token does not exist', async () => {
    localStorage.setItem('isLoggedIn', 'true')

    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => {
      if (key === 'userData') {
        return JSON.stringify(sampleUserData)
      } else if (key === 'isLoggedIn') {
        return 'true'
      } else {
        return null
      }
    })

    const { getByText } = render(<Navbar />)

    fireEvent.click(getByText(sampleUserData.username))
    fireEvent.click(getByText('Sign out'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  test('logs error when logout fails', async () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => {
      if (key === 'refresh') {
        return 'fake_refresh_token'
      } else if (key === 'userData') {
        return JSON.stringify(sampleUserData)
      } else if (key === 'isLoggedIn') {
        return 'true'
      } else {
        return null
      }
    })

    jest.spyOn(window.localStorage.__proto__, 'clear').mockImplementation(jest.fn())

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn())

    const error = new Error('Logout failed')
    jest.spyOn(axios, 'post').mockRejectedValueOnce(error)

    const { getByText } = render(<Navbar />)

    fireEvent.click(getByText(sampleUserData.username))
    fireEvent.click(getByText('Sign out'))

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error logging out:', error)
    })
  })
})

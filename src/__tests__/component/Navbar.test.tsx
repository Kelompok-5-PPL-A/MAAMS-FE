import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import Navbar from '../../components/navbar/navbar'
import '@testing-library/jest-dom'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush
  })
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

describe('Navbar component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly when user is logged in', () => {
    localStorage.setItem('isLoggedIn', 'true')

    const { getByText } = render(<Navbar />)

    expect(getByText('Riwayat')).toBeInTheDocument()
    expect(getByText('Username')).toBeInTheDocument()
    expect(getByText('Tambahkan Analisis')).toBeInTheDocument()
  })

  it('renders correctly when user is not logged in', () => {
    localStorage.setItem('isLoggedIn', 'false')

    const { getByText } = render(<Navbar />)

    expect(getByText('Login')).toBeInTheDocument()
  })

  it('toggles menu when menu button is clicked on mobile layout', async () => {
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

  it('toggles dropdown when dropdown button is clicked', () => {
    localStorage.setItem('isLoggedIn', 'true')

    const { getByRole, getByText } = render(<Navbar />)

    const dropdownButton = getByRole('button', { name: /username/i })
    fireEvent.click(dropdownButton)

    expect(getByText('Edit Profile')).toBeInTheDocument()
    expect(getByText('Sign out')).toBeInTheDocument()
  })

  it('renders Analisis Publik button when user is logged in and is_superuser', async () => {
    const { getByText } = render(<Navbar />)
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('isSuperUser', 'true')

    await waitFor(() => {
      expect(getByText('Analisis Publik')).toBeInTheDocument()
    })
  })

  it('does not render Analisis Publik button when user is logged in but not is_superuser', () => {
    const { queryByText } = render(<Navbar />)
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('isSuperUser', 'false')

    expect(queryByText('Analisis Publik')).toBeNull()
  })

  it('does not render Analisis Publik button when user is not logged in', () => {
    const { queryByText } = render(<Navbar />)
    localStorage.setItem('isLoggedIn', 'false')

    expect(queryByText('Analisis Publik')).toBeNull()
  })
})

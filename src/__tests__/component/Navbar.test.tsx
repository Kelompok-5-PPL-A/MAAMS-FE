import React from 'react'
import { render, fireEvent } from '@testing-library/react'
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

  it('toggles menu when menu button is clicked on mobile layout', () => {
    global.innerWidth = 480

    const { getByRole } = render(<Navbar />)

    const menuButton = getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)

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
})

import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Login from '../../pages/login/index'

// Mock the next/router module
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

// Mock the login function
jest.mock('../../actions/auth', () => ({
  login: jest.fn()
}))

// Mock the maams image
jest.mock('../../assets/maams.png', () => ({
  src: 'fake-maams-image'
}))

describe('Login Page', () => {
  it('renders the login form', async () => {
    render(<Login />)

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByText('Masuk', { exact: true })).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    render(<Login />)

    // Mock user input
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } })

    // Mock login response
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

    fireEvent.click(screen.getByText('Masuk', { exact: true }))
    waitFor(() => {
      jest.requireMock('next/router').useRouter().push('/')
    })
    setTimeout(function () {
      // Check if router.push is called
      expect(jest.requireMock('next/router').useRouter().push).toHaveBeenCalledWith('/')
    }, 500)
  })

  it('displays error message for invalid login', async () => {
    // Mock login function to reject the promise
    jest.requireMock('../../actions/auth').login.mockRejectedValueOnce({
      response: {
        data: { detail: 'Invalid credentials' }
      }
    })

    render(<Login />)

    // Mock user input
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'invaliduser' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'invalidpassword' } })

    fireEvent.click(screen.getByText('Masuk', { exact: true }))

    setTimeout(function () {
      // Check if feedback present
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      // Check if router.push is not called
      expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
    }, 500)
  })
})

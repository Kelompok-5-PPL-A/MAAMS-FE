import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Import the component you want to test
import Register from '../../pages/register/index'

// Mock the next/router module
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

// Mock the register function
jest.mock('../../actions/auth', () => ({
  register: jest.fn()
}))

// Mock the maams image
jest.mock('../../assets/maams.png', () => ({
  src: 'fake-maams-image'
}))

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks() // Clear mock calls before each test
  })

  it('renders the registration form', async () => {
    render(<Register />)

    // Test if all form elements are rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/password/i)[0]).toBeInTheDocument() // Select the first matching element
    expect(screen.getAllByLabelText(/password/i)[1]).toBeInTheDocument() // Select the first matching element
    expect(screen.getByTestId('register-button', { exact: true })).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    render(<Register />)

    // Mock user input
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: 'testpassword' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[1], { target: { value: 'testpassword' } })

    // Mock register response
    jest.requireMock('../../actions/auth').register.mockResolvedValueOnce({
      status: 201,
      data: {
        detail: 'User registered successfully.'
      }
    })

    fireEvent.click(screen.getByTestId('register-button'))

    // Wait for router.push to be called
    waitFor(() => {
      expect(jest.requireMock('next/router').useRouter().push).toHaveBeenCalledWith('/login')
    })
  })

  it('displays error message for exist email invalid registration', async () => {
    // Mock register function to reject the promise
    jest.requireMock('../../actions/auth').register.mockRejectedValueOnce({
      response: {
        data: {
          email: ['This field must be unique.']
        }
      }
    })

    render(<Register />)

    // Mock user input
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: 'testpassword' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[1], { target: { value: 'testpassword' } })
    fireEvent.click(screen.getByTestId('register-button'))

    // Wait for feedback to appear
    waitFor(() => {
      expect(screen.getByText(/username is already taken/i)).toBeInTheDocument()
      expect(screen.getByText(/This field must be unique./i)).toBeInTheDocument()
      // Check if router.push is not called
      expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
    })
  })
  it('displays error message for exist username invalid registration', async () => {
    // Mock register function to reject the promise
    jest.requireMock('../../actions/auth').register.mockRejectedValueOnce({
      response: {
        data: {
          username: ['Username is already in use']
        }
      }
    })

    render(<Register />)

    // Mock user input
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'exitinguser' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test2@example.com' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: 'testpassword' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[1], { target: { value: 'testpassword' } })
    fireEvent.click(screen.getByTestId('register-button'))

    // Wait for feedback to appear
    waitFor(() => {
      expect(screen.getByText(/ Username is already in use/i)).toBeInTheDocument()
      // Check if router.push is not called
      expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
    })
  })

  it('displays error message for password mismatch', async () => {
    render(<Register />)

    // Mock user input with mismatched passwords
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: 'testpassword' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[1], { target: { value: 'testpassword123' } }) // Mismatched password

    // Mock register function to resolve with an error response
    jest.requireMock('../../actions/auth').register.mockRejectedValueOnce({
      response: {
        data: {
          password: ["Password fields didn't match."]
        }
      }
    })

    fireEvent.click(screen.getByTestId('register-button'))

    // Wait for the error message to appear
    waitFor(() => {
      expect(screen.getByText(/Password fields didn't match./i)).toBeInTheDocument()
    })

    // Check if router.push is not called
    expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
  })
  it('displays error message for empty email field', async () => {
    render(<Register />)

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement
    const passwordInputs = screen.getAllByLabelText(/password/i) as HTMLInputElement[]
    const registerButton = screen.getByTestId('register-button')

    usernameInput.value = 'tesuser'
    passwordInputs[0].value = 'inipass123'
    passwordInputs[1].value = 'inipass123'

    fireEvent.click(registerButton)

    waitFor(() => {
      expect(screen.getByText(/Please enter this field/i)).toBeInTheDocument()
      expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
    }).then(() => {
      setTimeout(() => {
        expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
      }, 500)
    })
  })
  it('displays error message for empty username field', async () => {
    render(<Register />)

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInputs = screen.getAllByLabelText(/password/i) as HTMLInputElement[]
    const registerButton = screen.getByTestId('register-button')
    emailInput.value = 'tes@gmail.com'
    passwordInputs[0].value = 'inipass123'
    passwordInputs[1].value = 'inipass123'

    fireEvent.click(registerButton)

    waitFor(() => {
      expect(screen.getByText(/Please enter this field/i)).toBeInTheDocument()
      expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
    }).then(() => {
      setTimeout(() => {
        expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
      }, 500)
    })
  })
  it('displays error message for empty password field', async () => {
    render(<Register />)

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const registerButton = screen.getByTestId('register-button')

    usernameInput.value = 'tesuser'
    emailInput.value = 'tes@gmail.com'

    fireEvent.click(registerButton)

    waitFor(() => {
      expect(screen.getByText(/Please enter this field/i)).toBeInTheDocument()
      expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
    }).then(() => {
      setTimeout(() => {
        expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
      }, 500)
    })
  })
  it('displays error message for empty confirmation password field', async () => {
    render(<Register />)

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getAllByLabelText(/password/i)[0] as HTMLInputElement
    const registerButton = screen.getByTestId('register-button')

    usernameInput.value = 'tesuser'
    emailInput.value = 'tes@gmail.com'
    passwordInput.value = 'inipass123'

    fireEvent.click(registerButton)
    waitFor(() => {
      expect(screen.getByText(/Please enter this field/i)).toBeInTheDocument()
      expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
    }).then(() => {
      setTimeout(() => {
        expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
      }, 500)
    })
  })
})

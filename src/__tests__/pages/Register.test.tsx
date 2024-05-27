import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Register from '../../pages/register/index'

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

jest.mock('../../actions/auth', () => ({
  register: jest.fn()
}))

jest.mock('../../assets/maams.png', () => ({
  src: 'fake-maams-image'
}))

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

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the registration form', async () => {
    render(<Register />)

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/password/i)[0]).toBeInTheDocument()
    expect(screen.getAllByLabelText(/password/i)[1]).toBeInTheDocument()
    expect(screen.getByTestId('register-button', { exact: true })).toBeInTheDocument()
  })

  it('Confirm password input field renders correctly', () => {
    render(<Register />)
    const confirmPasswordInput = screen.getByTestId('confirmPassword')
    expect(confirmPasswordInput).toBeInTheDocument()
  })

  it('Goes to homepage when refresh token is present', async () => {
    localStorage.setItem('refresh', 'mock')

    render(<Register />)
    await waitFor(() => {
      setTimeout(() => {
        expect(jest.requireMock('next/router').useRouter().push).toHaveBeenCalledWith('/')
      }, 1000)
    })
  })

  it('Submit button renders correctly', () => {
    render(<Register />)
    const submitButton = screen.getByTestId('register-button')
    expect(submitButton).toBeInTheDocument()
  })

  it('Click event on "Masuk Ke Akun" navigates to login page', async () => {
    render(<Register />)
    const loginLink = screen.getByText('Masuk Ke Akun')

    fireEvent.click(loginLink)
    await waitFor(() => {
      setTimeout(() => {
        expect(jest.requireMock('next/router').useRouter().push).toHaveBeenCalledWith('/login')
      }, 1000)
    })
  })

  it('handles form submission', async () => {
    render(<Register />)

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: 'testpassword' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[1], { target: { value: 'testpassword' } })

    jest.requireMock('../../actions/auth').register.mockResolvedValueOnce({
      status: 201,
      data: {
        detail: 'User registered successfully.'
      }
    })

    fireEvent.click(screen.getByTestId('register-button'))

    await waitFor(() => {
      setTimeout(() => {
        expect(jest.requireMock('next/router').useRouter().push).toHaveBeenCalledWith('/login')
      }, 2000)
    })
  })

  it('Username input field onBlur event', () => {
    render(<Register />)
    const usernameInput = screen.getByPlaceholderText('Username...')

    fireEvent.focus(usernameInput)
    expect(usernameInput).toHaveClass('border-blue-500')

    fireEvent.blur(usernameInput)
    expect(usernameInput).toHaveClass('border-gray-300')
  })

  it('Email input field onBlur event', () => {
    render(<Register />)
    const emailInput = screen.getByPlaceholderText('Email')

    fireEvent.focus(emailInput)
    expect(emailInput).toHaveClass('border-blue-500')

    fireEvent.blur(emailInput)
    expect(emailInput).toHaveClass('border-gray-300')
  })

  it('Password input field onBlur event', () => {
    render(<Register />)
    const passwordInput = screen.getByTestId('password')

    fireEvent.focus(passwordInput)
    expect(passwordInput).toHaveClass('border-blue-500')

    fireEvent.blur(passwordInput)
    expect(passwordInput).toHaveClass('border-gray-300')
  })

  it('Confirm password input field onBlur event', () => {
    render(<Register />)
    const confirmPasswordInput = screen.getByTestId('confirmPassword')

    fireEvent.focus(confirmPasswordInput)
    expect(confirmPasswordInput).toHaveClass('border-blue-500')

    fireEvent.blur(confirmPasswordInput)
    expect(confirmPasswordInput).toHaveClass('border-gray-300')
  })

  it('Input username has the className as expected', () => {
    render(<Register />)
    const usernameInput = screen.getByPlaceholderText('Username...')
    fireEvent.focus(usernameInput)
    expect(usernameInput).toHaveClass('w-full px-3 py-3 border')
  })

  it('Input email has the className as expected', () => {
    render(<Register />)
    const emailInput = screen.getByPlaceholderText('Email')
    fireEvent.focus(emailInput)
    expect(emailInput).toHaveClass('w-full px-3 py-3 border')
    expect(emailInput).toEqual(expect.any(HTMLInputElement))
  })

  it('Input password has the className as expected', () => {
    render(<Register />)
    const passwordInput = screen.getByTestId('password')
    fireEvent.focus(passwordInput)
    expect(passwordInput).toHaveClass('w-full px-3 py-3 border')
    expect(passwordInput).toEqual(expect.any(HTMLInputElement))
  })

  it('displays error message for exist email invalid registration', async () => {
    jest.requireMock('../../actions/auth').register.mockRejectedValueOnce({
      response: {
        data: {
          email: ['This field must be unique.']
        }
      }
    })

    render(<Register />)

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: 'testpassword' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[1], { target: { value: 'testpassword' } })
    fireEvent.click(screen.getByTestId('register-button'))

    waitFor(() => {
      expect(screen.getByText(/username is already taken/i)).toBeInTheDocument()
      expect(screen.getByText(/This field must be unique./i)).toBeInTheDocument()
      expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
    })
  })
  it('displays error message for exist username invalid registration', async () => {
    jest.requireMock('../../actions/auth').register.mockRejectedValueOnce({
      response: {
        data: {
          username: ['Username is already in use']
        }
      }
    })

    render(<Register />)

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'exitinguser' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test2@example.com' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: 'testpassword' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[1], { target: { value: 'testpassword' } })
    fireEvent.click(screen.getByTestId('register-button'))

    waitFor(() => {
      expect(screen.getByText(/ Username is already in use/i)).toBeInTheDocument()
      expect(jest.requireMock('next/router').useRouter().push).not.toHaveBeenCalled()
    })
  })

  it('displays error message for password mismatch', async () => {
    render(<Register />)

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: 'testpassword' } })
    fireEvent.change(screen.getAllByLabelText(/password/i)[1], { target: { value: 'testpassword123' } })

    jest.requireMock('../../actions/auth').register.mockRejectedValueOnce({
      response: {
        data: {
          password: ["Password fields didn't match."]
        }
      }
    })

    fireEvent.click(screen.getByTestId('register-button'))

    waitFor(() => {
      expect(screen.getByText(/Password fields didn't match./i)).toBeInTheDocument()
    })

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

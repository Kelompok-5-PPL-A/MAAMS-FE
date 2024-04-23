import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import axiosInstance from '../../services/axiosInstance'
import toast from 'react-hot-toast'
import CreateLanding from '../../components/CreateLanding/index'

jest.mock('../../services/axiosInstance')
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

const mockPush = jest.fn()
const mockReload = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    reload: mockReload
  })
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

describe('CreateLanding', () => {
  it('should render CreateLanding component when not logged in', () => {
    const { getByText } = render(<CreateLanding />)
    expect(getByText('Belum Memiliki Akun?')).toBeInTheDocument()
  })

  it('should render CreateLanding component when logged in', () => {
    localStorage.setItem('isLoggedIn', 'true')
    const { getByText } = render(<CreateLanding />)
    expect(getByText('Apa masalah yang ingin dianalisis hari ini?')).toBeInTheDocument()
  })

  it('updates question correctly when input value is changed', () => {
    localStorage.setItem('isLoggedIn', 'true')
    const { getByPlaceholderText } = render(<CreateLanding />)

    const input = getByPlaceholderText('ingin menganalisis apa hari ini ...')

    fireEvent.change(input, { target: { value: 'Pertanyaan baru' } })

    expect(input.getAttribute('value')).toBe('Pertanyaan baru')
  })

  it('displays error when question is not filled', async () => {
    jest.requireMock('next/router').useRouter().push('/')

    localStorage.setItem('isLoggedIn', 'true')
    const { getByPlaceholderText, getByTitle } = render(<CreateLanding />)
    const input = getByPlaceholderText('ingin menganalisis apa hari ini ...')
    const button = getByTitle('submit_button')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.submit(button)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Pertanyaan harus diisi')
      }, 2000)
    })
  })

  it('displays success message and redirects on successful API call', async () => {
    const mockResponseData = {
      mode: 'mode',
      question: 'question'
    }
    mockedAxios.post.mockResolvedValue({ data: mockResponseData })

    localStorage.setItem('isLoggedIn', 'true')
    const { getByPlaceholderText, getByTitle } = render(<CreateLanding />)

    const input = getByPlaceholderText('ingin menganalisis apa hari ini ...')
    fireEvent.change(input, { target: { value: 'question' } })

    const button = getByTitle('submit_button')

    fireEvent.submit(button)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Analisis berhasil ditambahkan')
      }, 2000)
    })
  })

  it('displays error message when fail to post', async () => {
    const errorResponse = {
      response: {
        request: {
          responseText: 'Gagal menambahkan analisis'
        }
      }
    }
    mockedAxios.post.mockRejectedValueOnce({ data: errorResponse })

    localStorage.setItem('isLoggedIn', 'true')
    const { getByPlaceholderText, getByTitle } = render(<CreateLanding />)

    const input = getByPlaceholderText('ingin menganalisis apa hari ini ...')
    fireEvent.change(input, { target: { value: 'question' } })

    const button = getByTitle('submit_button')

    fireEvent.submit(button)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Gagal menambahkan analisis')
      }, 2000)
    })
  })

  it('displays error message from backend when fail to post', async () => {
    const errorResponse = {
      data: {
        detail: 'Backend Error Message'
      }
    }
    mockedAxios.post.mockRejectedValueOnce({ response: errorResponse })

    localStorage.setItem('isLoggedIn', 'true')
    const { getByPlaceholderText, getByTitle } = render(<CreateLanding />)

    const input = getByPlaceholderText('ingin menganalisis apa hari ini ...')
    fireEvent.change(input, { target: { value: 'question' } })

    const button = getByTitle('submit_button')

    fireEvent.submit(button)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Backend Error Message')
      }, 2000)
    })
  })
})

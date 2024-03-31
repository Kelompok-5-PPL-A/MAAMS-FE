/* eslint-disable */
import { ValidatorQuestionForm } from '../../components/validatorQuestionForm'
import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import MockAdapter from 'axios-mock-adapter'
import Mode from '../../constants/mode'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-hot-toast'

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

describe('ValidatorQuestionForm Component', () => {
  let mock: any

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders form correctly', () => {
    jest.requireMock('next/router').useRouter().push('/')

    const { getByText, getByPlaceholderText } = render(<ValidatorQuestionForm />)

    expect(getByText('Ingin menganalisis masalah apa hari ini?')).toBeInTheDocument()
    expect(getByPlaceholderText('Isi pertanyaan anda di sini')).toBeInTheDocument()
  })

  test('calls handleModeChange when mode is changed directly', () => {
    const { getByText } = render(<ValidatorQuestionForm />)

    const dropdown = getByText(Mode.pribadi)

    fireEvent.click(dropdown)

    const option = getByText(Mode.pengawasan)
    fireEvent.click(option)

    expect(dropdown.textContent).toBe(Mode.pengawasan)
  })

  test('calls handleModeChangeGet when an option is selected in the dropdown and id is provided', () => {
    const validatorData = { mode: Mode.pribadi, question: 'Contoh pertanyaan', username: 'test', created_at: 'test' }
    const id = 1
    const { getByText } = render(<ValidatorQuestionForm id='{id}' validatorData={validatorData} />)

    const dropdown = getByText(Mode.pribadi)

    fireEvent.click(dropdown)

    const option = getByText(Mode.pengawasan)
    fireEvent.click(option)

    expect(dropdown.textContent).toBe(Mode.pengawasan)
  })

  test('updates question correctly when input value is changed', () => {
    const { getByPlaceholderText, getByText } = render(<ValidatorQuestionForm />)

    const input = getByPlaceholderText('Isi pertanyaan anda di sini')

    fireEvent.change(input, { target: { value: 'Pertanyaan baru' } })

    expect(input.getAttribute('value')).toBe('Pertanyaan baru')
  })

  test('displays error when question is not filled', async () => {
    jest.requireMock('next/router').useRouter().push('/')

    const { getByPlaceholderText, getByTestId } = render(<ValidatorQuestionForm />)
    const input = getByPlaceholderText('Isi pertanyaan anda di sini')
    const button = getByTestId('submit-question')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.submit(button)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Pertanyaan harus diisi')
      }, 2000)
    })
  })

  test('displays success message and redirects on successful API call', async () => {
    const mockResponseData = {
      mode: 'mode',
      question: 'question'
    }
    mockedAxios.post.mockResolvedValue({ data: mockResponseData })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    const { getByPlaceholderText, getByTestId } = render(<ValidatorQuestionForm />)

    const input = getByPlaceholderText('Isi pertanyaan anda di sini')
    fireEvent.change(input, { target: { value: 'question' } })

    const button = getByTestId('submit-question')

    fireEvent.submit(button)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Analisis berhasil ditambahkan')
      }, 2000)
    })
  })

  test('displays error message when fail to post', async () => {
    const errorResponse = {
      response: {
        request: {
          responseText: 'Gagal menambahkan analisis'
        }
      }
    }
    mockedAxios.post.mockRejectedValueOnce({ data: errorResponse })

    const { getByPlaceholderText, getByTestId } = render(<ValidatorQuestionForm />)

    const input = getByPlaceholderText('Isi pertanyaan anda di sini')
    fireEvent.change(input, { target: { value: 'question' } })

    const button = getByTestId('submit-question')

    fireEvent.submit(button)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Gagal menambahkan analisis')
      }, 2000)
    })
  })

  test('displays error message from backend when fail to post', async () => {
    const errorResponse = {
      data: {
        detail: 'Backend Error Message'
      }
    }
    mockedAxios.post.mockRejectedValueOnce({ response: errorResponse })

    const { getByPlaceholderText, getByTestId } = render(<ValidatorQuestionForm />)

    const input = getByPlaceholderText('Isi pertanyaan anda di sini')
    fireEvent.change(input, { target: { value: 'question' } })

    const button = getByTestId('submit-question')

    fireEvent.submit(button)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Backend Error Message')
      }, 2000)
    })
  })
})

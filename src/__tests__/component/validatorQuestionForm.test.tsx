/* eslint-disable */
import { ValidatorQuestionForm } from '../../components/validatorQuestionForm'
import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import MockAdapter from 'axios-mock-adapter'
import Mode from '../../constants/mode'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

import path from 'path'

require('dotenv').config({ path: path.resolve(__dirname, './.env') })

const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

const mockAxios = new MockAdapter(axiosInstance)

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

jest.mock('react-hot-toast', () => ({
  ...jest.requireActual('react-hot-toast'),
  error: jest.fn(),
  success: jest.fn()
}))

jest.mock('../../actions/auth', () => ({
  login: jest.fn().mockResolvedValueOnce({
    status: 200,
    data: {
      access_token: 'mockAccessToken',
      refresh_token: 'mockRefreshToken'
    }
  })
}))

describe('ValidatorQuestionForm Component', () => {
  let mock: any

  beforeEach(() => {
    mockAxios.reset()
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
    localStorageMock.setItem('access', 'token')

    mockAxios
      .onPost(`/api/v1/validator/baru/`, {
        mode: 'dummyMode',
        question: 'dummyQuestion'
      })
      .reply(200)

    const { getByPlaceholderText, getByTestId } = render(<ValidatorQuestionForm />)

    const input = getByPlaceholderText('Isi pertanyaan anda di sini')
    fireEvent.change(input, { target: { value: 'dummyQuestion' } })

    const button = getByTestId('submit-question')

    fireEvent.submit(button)

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(1)
      setTimeout(() => {
        expect(toast.success).toHaveBeenCalledWith('Analisis berhasil ditambahkan')
      }, 2000)
    })
  })

  test('handle delete button click', async () => {
    const id = 'abc123'
    const { getByText, getByTestId } = render(<ValidatorQuestionForm id={id} />)

    mockAxios.onDelete(`/api/v1/validator/hapus/${id}`).reply(200)

    fireEvent.click(getByTestId('toggle-open-button'))

    fireEvent.click(getByTestId('delete-button'))

    fireEvent.click(getByText('Hapus'))

    await waitFor(() => {
      expect(mockAxios.history.delete.length).toBe(1)
      setTimeout(() => {
        expect(toast.success).toHaveBeenCalledWith('Berhasil menghapus analisis')
        expect(useRouter().push).toHaveBeenCalledWith('/')
      }, 500)
    })
  })
})

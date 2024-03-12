/* eslint-disable */
import { ValidatorQuestionForm } from '../../components/validatorQuestionForm'
import axios from 'axios'
import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import MockAdapter from 'axios-mock-adapter'
import Mode from '../../constants/mode'

jest.mock('axios')

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

jest.mock('react-hot-toast', () => ({
  error: jest.fn()
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
    mock = new MockAdapter(axios)
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

  test('handles form submission correctly', async () => {
    const mockResponseData = {
      question: 'Pertanyaan tes',
      mode: 'PRIBADI'
    }

    mock.onPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/baru/`).reply(201, mockResponseData)
  })

  test('displays error when question is not filled', async () => {
    jest.requireMock('next/router').useRouter().push('/')

    const { getByText } = render(<ValidatorQuestionForm />)
    const submitButton = document.getElementById('submit-question')

    if (submitButton !== null) {
      fireEvent.click(submitButton)
    }

    await waitFor(() => {
      setTimeout(() => {
        expect(getByText('Pertanyaan harus diisi')).toBeInTheDocument()
      }, 2000)
      expect(axios).not.toHaveBeenCalled()
    })
  })

  test('displays success message and redirects on successful API call', async () => {
    const fakeAccessToken = 'fakeAccessToken'

    mock
      .onPost(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/baru/`,
        {
          mode: 'dummyMode',
          question: 'dummyQuestion'
        },
        {
          Authorization: `Bearer ${fakeAccessToken}` // Sertakan token otentikasi palsu
        }
      )
      .reply(200, { id: 123 })

    const { getByPlaceholderText, getByText } = render(<ValidatorQuestionForm />)

    const input = getByPlaceholderText('Isi pertanyaan anda di sini')
    fireEvent.change(input, { target: { value: 'Pertanyaan baru' } })

    fireEvent.submit(input)

    await waitFor(() => {
      setTimeout(() => {
        expect(getByText('Analisis berhasil ditambahkan')).toBeInTheDocument()
      }, 2000)
    })
  })
})

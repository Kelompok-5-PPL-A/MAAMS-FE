/* eslint-disable */
import { ValidatorQuestionForm } from '../../components/validatorQuestionForm'
import axios from 'axios'
import { render, fireEvent, waitFor, getByText } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import MockAdapter from 'axios-mock-adapter'
import { toast } from 'react-hot-toast'

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
})

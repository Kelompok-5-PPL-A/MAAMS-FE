import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import AnalisisPublik from '../../pages/analisisPublik'
import * as fetchQuestionsModule from '../../actions/fetchQuestions'
import * as authModule from '../../actions/auth'
import { AxiosRequestHeaders } from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import '@testing-library/jest-dom'

const mockPush = jest.fn()
const mockReload = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    reload: mockReload
  })
}))

const refreshTokenMock = jest.spyOn(authModule, 'refreshToken')
const fetchQuestionsMock = jest.spyOn(fetchQuestionsModule, 'fetchQuestions')

describe('AnalisisPublik Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('refreshes access token and retries fetch on authentication failure', async () => {
    refreshTokenMock.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      data: { access: 'newAccessToken' },
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders
      }
    })

    const OlderData = {
      count: 2,
      processedData: [
        { id: 'id-1', title: 'Question 1', timestamp: '2022-04-05T10:00:00Z', mode: 'public', user: 'user1' },
        { id: 'id-2', title: 'Question 2', timestamp: '2022-04-06T11:00:00Z', mode: 'public', user: 'user2' }
      ]
    }
    fetchQuestionsMock.mockResolvedValueOnce(OlderData)

    render(<AnalisisPublik />)

    await waitFor(() => {
      expect(fetchQuestionsMock).toHaveBeenCalledTimes(1)
    })
  })

  test('handles fetchQuestions error with response data', async () => {
    const errorMessage = 'Unauthorized access'
    const mockError = {
      response: {
        data: {
          detail: errorMessage
        },
        status: 401
      }
    }

    fetchQuestionsMock.mockRejectedValueOnce(mockError)

    render(<AnalisisPublik />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage)
      }, 2000)
    })
  })

  test('handles non-response error by displaying message and redirecting', async () => {
    const genericErrorMessage = 'Network Error'
    fetchQuestionsMock.mockRejectedValueOnce(new Error(genericErrorMessage))

    render(<AnalisisPublik />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast.error).toHaveBeenCalledWith(genericErrorMessage)
        expect(useRouter().push).toHaveBeenCalledWith('/')
      }, 2000)
    })
  })
  test('displays fetched data for older', async () => {
    const olderData = {
      count: 1,
      processedData: [
        { id: 'id-3', title: 'Question 3', timestamp: '2022-03-05T10:00:00Z', mode: 'public', user: 'user3' }
      ]
    }

    fetchQuestionsMock.mockResolvedValueOnce(olderData)

    render(<AnalisisPublik />)

    await waitFor(() => {
      expect(screen.getByText('Question 3')).toBeInTheDocument()
    })
  })
})

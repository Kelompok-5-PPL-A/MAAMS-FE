import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import History from '../../pages/history'
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

describe('History Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('fetches and displays data for last week', async () => {
    const lastWeekData = {
      count: 2,
      processedData: [
        { title: 'Question 1', timestamp: '2022-04-05T10:00:00Z', mode: 'public', user: 'user1' },
        { title: 'Question 2', timestamp: '2022-04-06T11:00:00Z', mode: 'private', user: 'user2' }
      ]
    }
    fetchQuestionsMock.mockResolvedValueOnce(lastWeekData)

    render(<History />)
    expect(fetchQuestionsMock).toHaveBeenCalledWith(expect.any(Object), 'last_week', '?count=3')
  })

  test('performs search without keyword', async () => {
    render(<History />)

    fireEvent.submit(screen.getByRole('button', { name: /search/i }))

    expect(fetchQuestionsMock).toHaveBeenCalledWith(expect.any(Object), 'last_week', '?count=3')
  })

  test('refreshes token successfully', async () => {
    refreshTokenMock.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      data: { access: 'newAccessToken' },
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders
      }
    })

    const lastWeekData = {
      count: 2,
      processedData: [
        { title: 'Question 1', timestamp: '2022-04-05T10:00:00Z', mode: 'public', user: 'user1' },
        { title: 'Question 2', timestamp: '2022-04-06T11:00:00Z', mode: 'private', user: 'user2' }
      ]
    }
    fetchQuestionsMock.mockResolvedValueOnce(lastWeekData)

    render(<History />)

    await waitFor(() => {
      expect(fetchQuestionsMock).toHaveBeenCalledTimes(2)
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

    render(<History />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage)
      }, 2000)
    })
  })

  test('handles non-response error by displaying message and redirecting', async () => {
    const genericErrorMessage = 'Network Error'
    fetchQuestionsMock.mockRejectedValueOnce(new Error(genericErrorMessage))

    render(<History />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast.error).toHaveBeenCalledWith(genericErrorMessage)
        expect(useRouter().push).toHaveBeenCalledWith('/')
      }, 2000)
    })
  })
  test('displays fetched data for last week and older', async () => {
    const lastWeekData = {
      count: 2,
      processedData: [
        { id: 'id-1', title: 'Question 1', timestamp: '2022-04-05T10:00:00Z', mode: 'public', user: 'user1' },
        { id: 'id-2', title: 'Question 2', timestamp: '2022-04-06T11:00:00Z', mode: 'public', user: 'user2' }
      ]
    }

    const olderData = {
      count: 1,
      processedData: [
        { id: 'id-3', title: 'Question 3', timestamp: '2022-03-05T10:00:00Z', mode: 'public', user: 'user3' }
      ]
    }

    fetchQuestionsMock.mockResolvedValueOnce(lastWeekData).mockResolvedValueOnce(olderData)

    render(<History />)

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument()
      expect(screen.getByText('Question 2')).toBeInTheDocument()
      expect(screen.getByText('Question 3')).toBeInTheDocument()
    })
  })
})

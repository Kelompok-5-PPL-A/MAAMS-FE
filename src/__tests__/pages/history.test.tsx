import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import History from '../../pages/history'
import * as fetchQuestionsModule from '../../actions/fetchQuestions'
import * as authModule from '../../actions/auth'
import { AxiosRequestHeaders } from 'axios'

jest.mock('next/router', () => require('next-router-mock'))

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
})

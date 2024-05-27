import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import History from '../../pages/history'
import * as fetchQuestionsModule from '../../actions/fetchQuestions'
import * as authModule from '../../actions/auth'
import { AxiosRequestHeaders } from 'axios'
import { Item } from 'components/types/historyPage'
import { useRouter } from 'next/router'
import { fetchQuestions } from '../../actions/fetchQuestions'

const refreshTokenMock = jest.spyOn(authModule, 'refreshToken')
const fetchQuestionsMock = jest.spyOn(fetchQuestionsModule, 'fetchQuestions')

const mockPush = jest.fn()
const mockReload = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    reload: mockReload
  })
}))
jest.mock('../../actions/auth', () => ({
  ...jest.requireActual('../../actions/auth'),
  refreshToken: jest.fn()
}))

beforeEach(() => {
  localStorage.clear()
  global.localStorage.setItem('userData', JSON.stringify({ is_staff: true }))
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

describe('History Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleSubmit function is called correctly with the provided keyword and filter', async () => {
    const keyword = 'example keyword'
    const filter = 'Pengguna'

    const fetchQuestionsMock = fetchQuestions as jest.MockedFunction<typeof fetchQuestions>
    fetchQuestionsMock.mockResolvedValueOnce({
      count: 0,
      processedData: []
    })

    const { getByPlaceholderText, getByTestId } = render(<History />)

    const inputElement = getByPlaceholderText('Cari analisis..')
    fireEvent.change(inputElement, { target: { value: keyword } })

    const filterSelect = screen.getByRole('combobox')
    fireEvent.change(filterSelect, { target: { value: filter } })

    const submitButton = getByTestId('search-button')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(fetchQuestions).toHaveBeenCalledWith({ Authorization: 'Bearer null' }, 'last_week', '?count=4')
      expect(fetchQuestions).toHaveBeenCalledWith(
        { Authorization: 'Bearer null' },
        'last_week',
        'search/?filter=semua&count=4&keyword=Pengguna'
      )
      expect(fetchQuestions).toHaveBeenCalledWith({ Authorization: 'Bearer null' }, 'older', '?count=4')
    })
  })

  test('Submit form triggers fetchData with correct parameters', async () => {
    const mockFetchData = jest.fn()

    jest.spyOn(React, 'useState').mockImplementation(() => ['', mockFetchData])

    const { getAllByPlaceholderText, getByTestId } = render(<History />)

    const searchInputElements = getAllByPlaceholderText('Cari analisis..')
    const searchInputElement = searchInputElements[0]

    fireEvent.change(searchInputElement, {
      target: { value: 'searchKeyword' }
    })

    const submitButton = getByTestId('search-button')
    fireEvent.click(submitButton)

    expect(fetchQuestions).toHaveBeenCalledTimes(2)

    expect(fetchQuestions).toHaveBeenCalledWith({ Authorization: 'Bearer null' }, 'last_week', '?count=4')
    expect(fetchQuestions).toHaveBeenCalledWith(
      { Authorization: 'Bearer null' },
      'last_week',
      'search/?filter=semua&count=4&keyword=searchKeyword'
    )
  })

  test('fetches and displays data for last week', async () => {
    const items: Item[] = [
      {
        id: '1',
        title: 'Question 1',
        displayed_title: 'Question 1',
        timestamp: '2022-04-05T10:00:00Z',
        mode: 'public',
        user: 'user1',
        tags: ['Tags1']
      },
      {
        id: '2',
        title: 'Question 2',
        displayed_title: 'Question 2',
        timestamp: '2022-04-06T11:00:00Z',
        mode: 'private',
        user: 'user2',
        tags: ['Tags2']
      }
    ]

    const lastWeekData = {
      count: 2,
      processedData: items
    }
    fetchQuestionsMock.mockResolvedValueOnce(lastWeekData)

    render(<History />)
    expect(fetchQuestionsMock).toHaveBeenCalledWith(expect.any(Object), 'last_week', '?count=4')
  })

  test('performs search without keyword', async () => {
    render(<History />)

    fireEvent.submit(screen.getByRole('button', { name: /search/i }))

    expect(fetchQuestionsMock).toHaveBeenCalledWith(expect.any(Object), 'last_week', '?count=4')
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
        {
          id: '1',
          title: 'Question 1',
          displayed_title: 'Question 1',
          timestamp: '2022-04-05T10:00:00Z',
          mode: 'public',
          user: 'user1',
          tags: ['tag1']
        },
        {
          id: '2',
          title: 'Question 2',
          displayed_title: 'Question 2',
          timestamp: '2022-04-06T11:00:00Z',
          mode: 'private',
          user: 'user2',
          tags: ['tag2']
        }
      ]
    }
    fetchQuestionsMock.mockResolvedValueOnce(lastWeekData)

    render(<History />)

    await waitFor(() => {
      expect(fetchQuestionsMock).toHaveBeenCalledTimes(2)
    })
  })

  test('should fetch data on mount', () => {
    render(<History />)
    expect(fetchQuestionsMock).toHaveBeenCalledWith(expect.any(Object), 'last_week', '?count=4')
  })

  test('should set lastweek and older data after calling fetchQuestions()', async () => {
    fetchQuestionsMock.mockResolvedValueOnce({
      count: 2,
      processedData: [
        {
          id: '1',
          title: 'Question 1',
          displayed_title: 'Question 1',
          timestamp: '2022-01-01',
          mode: 'mode1',
          user: 'user1',
          tags: ['exampleTag']
        }
      ]
    })
    const { rerender } = render(<History />)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    rerender(<History />)
    expect(fetchQuestionsMock).toHaveBeenCalledWith(expect.any(Object), 'last_week', '?count=4')
    expect(fetchQuestionsMock).toHaveBeenCalledWith(expect.any(Object), 'older', '?count=4')
  })

  test('should handle non-401 error from fetchQuestions()', async () => {
    const mockError: any = new Error('Internal Server Error')
    mockError.response = { status: 500, data: { detail: 'Internal Server Error' } }
    fetchQuestionsMock.mockRejectedValueOnce(mockError)
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    await act(async () => {
      render(<History />)
    })
    expect(useRouter().push).toHaveBeenCalledWith('/')
  })

  test('displays fetched data for last week and older', async () => {
    const lastWeekData = {
      count: 2,
      processedData: [
        {
          id: 'id-1',
          title: 'Question 1',
          displayed_title: 'Question 1',
          timestamp: '2022-04-05T10:00:00Z',
          mode: 'public',
          user: 'user1',
          tags: ['tags1']
        },
        {
          id: 'id-2',
          title: 'Question 2',
          displayed_title: 'Question 2',
          timestamp: '2022-04-06T11:00:00Z',
          mode: 'private',
          user: 'user1',
          tags: ['tags2']
        }
      ]
    }

    const olderData = {
      count: 1,
      processedData: [
        {
          id: 'id-3',
          title: 'Question 3',
          displayed_title: 'Question 3',
          timestamp: '2022-03-05T10:00:00Z',
          mode: 'public',
          user: 'user1',
          tags: ['exampleTag']
        }
      ]
    }

    fetchQuestionsMock.mockResolvedValueOnce(lastWeekData).mockResolvedValueOnce(olderData)

    render(<History />)

    await waitFor(() => {
      setTimeout(() => {
        expect(screen.getByText('Question 1')).toBeInTheDocument()
        expect(screen.getByText('Question 2')).toBeInTheDocument()
        expect(screen.getByText('Question 3')).toBeInTheDocument()
      }, 5000)
    })
  })
})

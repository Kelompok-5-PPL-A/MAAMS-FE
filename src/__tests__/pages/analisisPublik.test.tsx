import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AnalisisPublik from '../../pages/analisisPublik'
import { fetchQuestions } from '../../actions/fetchQuestions'
import { fetchFilters } from '../../actions/fetchFilters'

import { useRouter } from 'next/router'

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: jest.fn(),
    reload: jest.fn(),
    pathname: '/analisis-publik'
  })
}))

jest.mock('../../actions/fetchQuestions', () => ({
  fetchQuestions: jest.fn(() =>
    Promise.resolve({
      processedData: [],
      count: 0
    })
  )
}))

jest.mock('../../actions/fetchFilters', () => ({
  fetchFilters: jest.fn().mockResolvedValue({
    pengguna: ['User1', 'User2'],
    judul: ['Title1', 'Title2'],
    topik: ['Topic1', 'Topic2']
  })
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

  getItem = jest.fn((key: string) => {
    return this.store[key] || null
  })

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

describe('AnalisisPublik Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('search bar interaction', async () => {
    render(<AnalisisPublik />)

    const searchBarInput = screen.getByPlaceholderText('Cari analisis..')
    fireEvent.change(searchBarInput, { target: { value: 'test keyword' } })

    const searchBarSubmitButton = screen.getByTestId('search-button')
    fireEvent.click(searchBarSubmitButton)

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledTimes(0)
    })
  })
  test('renders AnalisisPublik component', async () => {
    render(<AnalisisPublik />)

    expect(screen.getByTestId('public-analysis-title')).toBeInTheDocument()
  })

  test('fetches data on initial render', async () => {
    render(<AnalisisPublik />)
    await waitFor(() => {
      expect(fetchQuestions).toHaveBeenCalled()
      expect(fetchFilters).toHaveBeenCalled()
    })
  })

  test('updates keyword state when typing in search bar', async () => {
    render(<AnalisisPublik />)
    const searchInput = screen.getByPlaceholderText('Cari analisis..')
    fireEvent.change(searchInput, { target: { value: 'test keyword' } })
    expect(searchInput).toHaveValue('test keyword')
  })
  test('handles pagination change', async () => {
    render(<AnalisisPublik />)
    const paginationButton = screen.getByText('1')

    fireEvent.click(paginationButton)

    await waitFor(() => {
      expect(fetchQuestions).toHaveBeenCalledWith({ Authorization: 'Bearer null' }, '', 'pengawasan/?count=5&p=1')
      expect(fetchQuestions).toHaveBeenCalledWith({ Authorization: 'Bearer null' }, '', 'pengawasan/?count=5&p=1')
      expect(fetchQuestions).toHaveBeenCalledWith({ Authorization: 'Bearer null' }, '', 'pengawasan/?count=5&p=1')
    })
  })

  test('selecting other filter sets suggestion to empty array', async () => {
    const { getByTestId } = render(<AnalisisPublik />)
    const filterSelect = getByTestId('filter-select')

    fireEvent.change(filterSelect, { target: { value: 'other' } })

    await waitFor(() => {
      const suggestionList = getByTestId('suggestion-list')
      expect(suggestionList.children.length).toBe(0)
    })
  })
})

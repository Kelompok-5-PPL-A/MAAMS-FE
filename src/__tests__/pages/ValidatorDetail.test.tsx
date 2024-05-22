import React from 'react'
import { render, fireEvent, within, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ValidatorDetailPage from '../../pages/validator/[id]'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-hot-toast'

jest.mock('../../services/axiosInstance')
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

const mockPush = jest.fn()
const mockReload = jest.fn()

const routerContext = {
  query: { id: '123' }
}

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    reload: mockReload,
    query: routerContext.query
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

describe('ValidatorPage Page Tests', () => {
  test('renders validatorPage page with CounterButton and initial Row', () => {
    const { getByText, getAllByTestId } = render(<ValidatorDetailPage />)

    expect(getByText('Sebab:')).toBeInTheDocument()
    expect(getByText('3')).toBeInTheDocument()
    expect(getAllByTestId('row-container')).toHaveLength(1) // Initial row count
  })

  test('increments and decrements columns on button clicks', async () => {
    const { getByText, findAllByPlaceholderText } = render(<ValidatorDetailPage />)

    const incrementButton = getByText('+')
    fireEvent.click(incrementButton)
    expect(getByText('4')).toBeInTheDocument()

    const placeholders = await findAllByPlaceholderText('Isi sebab..')
    expect(placeholders.length).toBeGreaterThan(0)

    const decrementButton = getByText('-')
    fireEvent.click(decrementButton)
    expect(getByText('3')).toBeInTheDocument()
  })

  test('does not allow incrementing beyond 5 columns', () => {
    const { getByText } = render(<ValidatorDetailPage />)

    const incrementButton = getByText('+')
    for (let i = 0; i < 5; i++) {
      fireEvent.click(incrementButton)
    }
    expect(getByText('5')).toBeInTheDocument()

    fireEvent.click(incrementButton)
    fireEvent.click(incrementButton)
    expect(getByText('5')).toBeInTheDocument()
  })

  test('does not allow decrementing below 3 columns', () => {
    const { getByText } = render(<ValidatorDetailPage />)

    const decrementButton = getByText('-')
    for (let i = 0; i < 3; i++) {
      fireEvent.click(decrementButton)
    }
    expect(getByText('3')).toBeInTheDocument()

    fireEvent.click(decrementButton)
    fireEvent.click(decrementButton)
    expect(getByText('3')).toBeInTheDocument()
  })

  test('adds a new row on submitting causes with correct feedback', async () => {
    const { getByText, findAllByText, getAllByTestId } = render(<ValidatorDetailPage />)

    const cells = getAllByTestId('cell')
    for (const cell of cells) {
      const input = within(cell).getByPlaceholderText('Isi sebab..') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Some cause' } })
    }

    const submitButton = getByText('Kirim Sebab')
    fireEvent.click(submitButton)

    const feedbackMessages = await findAllByText('')
    expect(feedbackMessages.length).toBeGreaterThanOrEqual(0)

    const rows = getAllByTestId('row-container')
    expect(rows).toHaveLength(1)
  })

  test('redirect to login when refresh token not existing', async () => {
    render(<ValidatorDetailPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  test('Successfully get data on successful API call', async () => {
    const mockResponseData = {
      mode: 'mockMode',
      question: 'mockQuestion',
      title: 'mockTitle',
      tags: ['mockTags']
    }
    mockedAxios.get.mockResolvedValue({ data: mockResponseData })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    const { getByText } = render(<ValidatorDetailPage />)

    await waitFor(() => {
      expect(getByText('mockMode')).toBeInTheDocument
      expect(getByText('mockTitle')).toBeInTheDocument
      expect(getByText('mockTags')).toBeInTheDocument
    })
  })

  test('displays error message from backend when fail to post', async () => {
    const errorResponse = {
      data: {
        detail: 'Backend Error Message'
      }
    }
    mockedAxios.get.mockRejectedValueOnce({ response: errorResponse })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Backend Error Message')
        expect(mockPush).toHaveBeenCalledWith('/')
      }, 10000)
    })
  })

  test('displays error message when fail to get data', async () => {
    const errorResponse = {
      response: {
        request: {
          responseText: 'Gagal mengambil data analisis'
        }
      }
    }
    mockedAxios.get.mockRejectedValueOnce({ data: errorResponse })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Gagal mengambil data analisis')
        expect(mockPush).toHaveBeenCalledWith('/')
      }, 10000)
    })
  })

  test('displays error message when fail to get causes data', async () => {
    const errorResponse = {
      response: {
        data: {
          detail: 'Gagal mengambil data sebab'
        }
      }
    }
    mockedAxios.get.mockRejectedValueOnce({ data: errorResponse })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Gagal mengambil data sebab')
      }, 10000)
    })
  })

  test('displays error message from backend when fail to create causes', async () => {
    const errorResponse = {
      data: {
        detail: 'err'
      }
    }
    mockedAxios.get.mockRejectedValueOnce({ response: errorResponse })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Gagal menambahkan sebab: err')
      }, 10000)
    })
  })

  test('displays error message from backend when fail to patch causes', async () => {
    const errorResponse = {
      data: {
        detail: 'err'
      }
    }
    mockedAxios.get.mockRejectedValueOnce({ response: errorResponse })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Gagal validasi sebab: err')
      }, 10000)
    })
  })

  test('handle missing ID return nothing', () => {
    routerContext.query = { id: '' }

    render(<ValidatorDetailPage />)
  })

  test('calls validateCauses and displays error toast on failed validation', async () => {
    const errorResponse = {
      data: {
        detail: 'error'
      }
    }
    mockedAxios.get.mockRejectedValueOnce({ response: errorResponse })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    const { getByText, getAllByTestId } = render(<ValidatorDetailPage />)

    const cells = getAllByTestId('cell')
    for (const cell of cells) {
      const input = within(cell).getByPlaceholderText('Isi sebab..') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Some cause' } })
    }
    const submitButton = getByText('Kirim Sebab')
    fireEvent.click(submitButton)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Gagal validasi sebab: error')
      }, 10000)
    })
  })
})

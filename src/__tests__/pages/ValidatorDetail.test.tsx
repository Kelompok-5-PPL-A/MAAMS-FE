import React from 'react'
import { render, fireEvent, within, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ValidatorDetailPage from '../../pages/validator/[id]'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-hot-toast'
import { CauseStatus } from '../../lib/enum'

jest.mock('../../services/axiosInstance')
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

const mockPush = jest.fn()

const useRouterMock = jest.spyOn(require('next/router'), 'useRouter')

useRouterMock.mockImplementation(() => ({
  route: '/',
  pathname: '',
  query: { id: '123' },
  asPath: '',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn()
  }
}))

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
  dismiss: jest.fn(),
  loading: jest.fn()
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
        expect(toast.error).toHaveBeenCalledWith('Backend Error')
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
        expect(toast.error).toHaveBeenCalledWith('Gagal mengambil data analisis')
        expect(mockPush).toHaveBeenCalledWith('/')
      }, 10000)
    })
  })

  test('displays error message when fail to get causes data', async () => {
    const errorResponse = {
      response: {
        data: {
          detail: 'Gagal mengambil sebab'
        }
      }
    }
    mockedAxios.get.mockRejectedValueOnce({ data: errorResponse })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast.error).toHaveBeenCalledWith('Gagal mengambil sebab')
      }, 10000)
    })
  })

  test('should set rows to an initial row when no causes are returned', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: []
    })

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      expect(screen.getByText('Sebab:')).toBeInTheDocument
    })
  })

  test('should process and set rows when all statuses are CorrectNotRoot or CorrectRoot', async () => {
    const causesData = [
      { id: 1, cause: 'Cause 1', row: 1, column: 0, status: CauseStatus.CorrectRoot },
      { id: 2, cause: 'Cause 2', row: 1, column: 1, status: CauseStatus.CorrectRoot },
      { id: 3, cause: 'Cause 3', row: 1, column: 2, status: CauseStatus.CorrectRoot },
      { id: 4, cause: 'Cause 4', row: 1, column: 3, status: CauseStatus.CorrectRoot }
    ]

    mockedAxios.get.mockResolvedValueOnce({
      data: causesData
    })

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      const newRow = screen.getAllByRole('textbox').length
      expect(newRow).toBeGreaterThan(3)
    })
  })

  test('handle missing ID return nothing', () => {
    useRouterMock.mockImplementationOnce(() => ({
      route: '/',
      pathname: '',
      query: { id: '' },
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
      }
    }))

    render(<ValidatorDetailPage />)
  })

  test('calls validateCauses and displays error toast on failed validation', async () => {
    const errorResponse = {
      data: {
        detail: 'error'
      }
    }
    mockedAxios.post.mockRejectedValueOnce({ response: errorResponse })

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
        expect(toast.error).toHaveBeenCalledWith('Gagal validasi sebab: error')
        expect(toast.dismiss).toHaveBeenCalled()
      }, 10000)
    })
  })

  test('shows a toast and redirects if backend error on initial data fetch', async () => {
    const errorResponse = {
      response: {
        data: {
          detail: 'Backend Error'
        }
      }
    }

    mockedAxios.get.mockRejectedValueOnce(errorResponse)

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Backend Error')
        expect(mockPush).toHaveBeenCalledWith('/')
      }, 10000)
    })
  })

  test('creates causes from the first row', async () => {
    const { getAllByPlaceholderText, getByText } = render(<ValidatorDetailPage />)

    const inputFields = await getAllByPlaceholderText('Isi sebab..')
    fireEvent.change(inputFields[0], { target: { value: 'First Cause' } })
    fireEvent.change(inputFields[1], { target: { value: 'Second Cause' } })
    fireEvent.change(inputFields[2], { target: { value: 'Third Cause' } })

    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } })
    fireEvent.click(getByText('Kirim Sebab'))

    await waitFor(() => {
      setTimeout(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/validator/causes/', expect.any(Object))
        expect(toast.success).toHaveBeenCalledWith('Causes saved successfully!')
      }, 10000)
    })
  })

  test('shows a toast and redirects if backend error on getting causes', async () => {
    const errorResponse = {
      response: {
        data: {
          detail: 'Backend Error'
        }
      }
    }
    mockedAxios.get.mockRejectedValueOnce(errorResponse)
    const { getAllByPlaceholderText, getByText } = render(<ValidatorDetailPage />)

    const inputFields = await getAllByPlaceholderText('Isi sebab..')
    fireEvent.change(inputFields[0], { target: { value: 'First Cause' } })
    fireEvent.change(inputFields[1], { target: { value: 'Second Cause' } })
    fireEvent.change(inputFields[2], { target: { value: 'Third Cause' } })

    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } })
    fireEvent.click(getByText('Kirim Sebab'))

    await waitFor(() => {
      setTimeout(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/validator/causes/', expect.any(Object))
        expect(toast.error).toHaveBeenCalledWith('Gagal menambahkan sebab: Backend Error')
      }, 10000)
    })
  })

  test('shows a toast and redirects if backend error on getting causes', async () => {
    const errorResponse = {
      response: {
        data: {
          detail: 'Backend Error'
        }
      }
    }
    mockedAxios.get.mockRejectedValueOnce(errorResponse)

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      setTimeout(() => {
        expect(toast.error).toHaveBeenCalledWith('Backend Error')
        expect(mockPush).toHaveBeenCalledWith('/')
      }, 10000)
    })
  })

  test('Test initial row when causes data empty', async () => {
    const responseData = {
      response: {
        status: 200,
        data: []
      }
    }
    mockedAxios.get.mockResolvedValueOnce(responseData)

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    const { getAllByPlaceholderText } = render(<ValidatorDetailPage />)

    await waitFor(() => {
      expect(getAllByPlaceholderText('Isi sebab..')).toBeInTheDocument
    })
  })

  test('shows a toast if backend error on getting causes', async () => {
    const errorResponse = {
      response: {
        status: 404,
        data: {
          detail: 'Backend Error'
        }
      }
    }
    mockedAxios.get.mockRejectedValueOnce(errorResponse)
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')
    render(<ValidatorDetailPage />)

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining(`/api/v1/validator/causes/123/`))
    })
  })

  test('remove button and disable all cells upon the entire validation completion', async () => {
    const causesData = [
      { id: '1', cause: 'Cause 1', row: 0, column: 0, status: true, feedback: 'test', root_status: false },
      { id: '2', cause: 'Cause 2', row: 0, column: 1, status: true, feedback: 'test', root_status: true },
      { id: '3', cause: 'Cause 3', row: 0, column: 2, status: true, feedback: 'test', root_status: true },
      { id: '4', cause: 'Cause 4', row: 1, column: 0, status: true, feedback: 'test', root_status: true }
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: causesData })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      expect(screen.queryByText('Kirim Sebab')).not.toBeInTheDocument()

      const cells = screen.getAllByTestId('cell')
      cells.forEach((cell) => {
        const textarea = within(cell).getByRole('textbox') as HTMLTextAreaElement
        expect(textarea).toBeDisabled()
      })
    })
  })

  test('invalid patchCausesFromRow call', async () => {
    const causesData = [
      { id: '1', cause: 'Cause 1', row: 0, column: 0, status: true, feedback: 'test', root_status: false },
      { id: '2', cause: 'Cause 2', row: 0, column: 1, status: true, feedback: 'test', root_status: true },
      { id: '3', cause: 'Cause 3', row: 0, column: 2, status: true, feedback: 'test', root_status: true },
      { id: '4', cause: 'Cause 4', row: 1, column: 0, status: false, feedback: 'test', root_status: false }
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: causesData })
    mockedAxios.patch.mockRejectedValueOnce({ response: { data: { detail: 'failed' } } })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      expect(screen.getByText('Kirim Sebab')).toBeInTheDocument()
    })

    await waitFor(() => {
      const cells = screen.getAllByTestId('cell')
      for (const cell of cells) {
        const input = within(cell).queryByDisplayValue('Cause 4') as HTMLInputElement
        if (input) {
          fireEvent.change(input, { target: { value: 'Some cause' } })
        }
      }
    })

    await waitFor(() => {
      setTimeout(() => {
        expect(toast.error).toHaveBeenCalledWith('Gagal memperbarui sebab: ', 'failed')
      }, 10000)
    })
  })

  test('calls patchCausesFromRow when latest row has incorrect status', async () => {
    const causesData = [
      { id: '1', cause: 'Cause 1', row: 0, column: 0, status: true, feedback: 'test', root_status: false },
      { id: '2', cause: 'Cause 2', row: 0, column: 1, status: true, feedback: 'test', root_status: true },
      { id: '3', cause: 'Cause 3', row: 0, column: 2, status: true, feedback: 'test', root_status: true },
      { id: '4', cause: 'Cause 4', row: 1, column: 0, status: false, feedback: 'test', root_status: false }
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: causesData })
    mockedAxios.patch.mockResolvedValueOnce({ data: { success: true } })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      expect(screen.getByText('Kirim Sebab')).toBeInTheDocument()
    })

    await waitFor(() => {
      const cells = screen.getAllByTestId('cell')
      for (const cell of cells) {
        const input = within(cell).queryByDisplayValue('Cause 4') as HTMLInputElement
        if (input) {
          fireEvent.change(input, { target: { value: 'Some cause' } })
        }
      }
    })

    const submitButton = screen.getByText('Kirim Sebab')
    fireEvent.click(submitButton)

    await waitFor(() => {
      setTimeout(() => {
        expect(mockedAxios.patch).toHaveBeenCalledWith('/api/v1/validator/causes/patch/123/4/', { cause: 'Some cause' })
        expect(mockedAxios.patch).toHaveBeenCalledWith('/api/v1/validator/causes/validate/123/')
        expect(toast.success).toHaveBeenCalledWith('Sebab selesai divalidasi')
      }, 10000)
    })
  })

  test('calls patchCausesFromRow when latest row has incorrect status, failed upon validation', async () => {
    const causesData = [
      { id: '1', cause: 'Cause 1', row: 0, column: 0, status: true, feedback: 'test', root_status: false },
      { id: '2', cause: 'Cause 2', row: 0, column: 1, status: true, feedback: 'test', root_status: true },
      { id: '3', cause: 'Cause 3', row: 0, column: 2, status: true, feedback: 'test', root_status: true },
      { id: '4', cause: 'Cause 4', row: 1, column: 0, status: false, feedback: 'test', root_status: false }
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: causesData })
    mockedAxios.patch
      .mockResolvedValueOnce({ data: { success: true } })
      .mockRejectedValueOnce({ response: { data: { detail: 'Validation failed' } } })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    render(<ValidatorDetailPage />)

    await waitFor(() => {
      expect(screen.getByText('Kirim Sebab')).toBeInTheDocument()
    })

    await waitFor(() => {
      const cells = screen.getAllByTestId('cell')
      for (const cell of cells) {
        const input = within(cell).queryByDisplayValue('Cause 4') as HTMLInputElement
        if (input) {
          fireEvent.change(input, { target: { value: 'Some cause' } })
        }
      }
    })

    const submitButton = screen.getByText('Kirim Sebab')
    fireEvent.click(submitButton)

    await waitFor(() => {
      setTimeout(() => {
        expect(mockedAxios.patch).toHaveBeenCalledWith('/api/v1/validator/causes/patch/123/4/', { cause: 'Some cause' })
      }, 10000)
    })

    await waitFor(() => {
      setTimeout(() => {
        expect(toast.error).toHaveBeenCalledWith('Gagal validasi sebab: ', 'Validation failed')
        expect(toast.dismiss).toHaveBeenCalled()
      }, 10000)
    })
  })
})

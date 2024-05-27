import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { DeleteButton } from '../../components/deleteButton'
import axiosInstance from '../../services/axiosInstance'
import toast from 'react-hot-toast'

jest.mock('../../services/axiosInstance')
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

const mockPush = jest.fn()
const mockUsePathname = jest.fn()
const mockReload = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    reload: mockReload
  }),
  usePathName: () => ({
    pathname: mockUsePathname
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

describe('DeleteButton', () => {
  const idQuestion = 'exampleId'
  const pathname = 'example'

  it('should render without errors', () => {
    render(<DeleteButton idQuestion={idQuestion} pathname={pathname} />)
  })

  it('should open dropdown menu on button click', () => {
    const { getByTestId } = render(<DeleteButton idQuestion={idQuestion} pathname={pathname} />)

    const toggleButton = getByTestId('toggle-open-button')
    fireEvent.click(toggleButton)

    const deleteAnalysis = getByTestId('delete-button')
    expect(deleteAnalysis).toBeInTheDocument
  })

  it('should close dropdown when clicked outside', () => {
    const { getByTestId } = render(<DeleteButton idQuestion={idQuestion} pathname={pathname} />)

    const toggleButton = getByTestId('toggle-open-button')
    fireEvent.click(toggleButton)
    const deleteAnalysis = getByTestId('delete-button')

    fireEvent.mouseDown(document.body)
    expect(deleteAnalysis).not.toBeInTheDocument
  })

  it('should delete successfully', async () => {
    const mockResponseData = {
      message: 'Analisis berhasil dihapus'
    }
    mockedAxios.delete.mockResolvedValue({ data: mockResponseData })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    const { getByTestId, getByText } = render(<DeleteButton idQuestion={idQuestion} pathname={pathname} />)

    const toggleButton = getByTestId('toggle-open-button')
    fireEvent.click(toggleButton)

    const deleteAnalysis = getByTestId('delete-button')
    fireEvent.click(deleteAnalysis)

    fireEvent.click(getByText('Hapus'))

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Berhasil menghapus analisis')
      }, 3000)
    })
  })

  it('should delete successfully from history page', async () => {
    const mockResponseData = {
      message: 'Analisis berhasil dihapus'
    }
    mockedAxios.delete.mockResolvedValue({ data: mockResponseData })

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce('mockAccessToken')
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')

    const { getByTestId, getByText } = render(<DeleteButton idQuestion={idQuestion} pathname='/history' />)

    const toggleButton = getByTestId('toggle-open-button')
    fireEvent.click(toggleButton)

    const deleteAnalysis = getByTestId('delete-button')
    fireEvent.click(deleteAnalysis)

    fireEvent.click(getByText('Hapus'))

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Berhasil menghapus analisis')
      }, 2000)
    })
  })

  it('should show error message when failed', async () => {
    const errorResponse = {
      data: {
        detail: 'Backend Error Message'
      }
    }
    mockedAxios.delete.mockRejectedValueOnce({ response: errorResponse })

    const { getByTestId, getByText } = render(<DeleteButton idQuestion={idQuestion} pathname={pathname} />)

    const toggleButton = getByTestId('toggle-open-button')
    fireEvent.click(toggleButton)

    const deleteAnalysis = getByTestId('delete-button')
    fireEvent.click(deleteAnalysis)

    fireEvent.click(getByText('Hapus'))

    await waitFor(() => {
      setTimeout(() => {
        expect(toast).toHaveBeenCalledWith('Backend Error Message')
      }, 2000)
    })
  })
})

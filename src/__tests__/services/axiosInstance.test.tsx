import MockAdapter from 'axios-mock-adapter'
import axiosInstance from '../../services/axiosInstance'

const mock = new MockAdapter(axiosInstance)

const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

test('should handle successful request', async () => {
  const responseData = { message: 'Success' }

  localStorageMock.setItem('access', 'token')

  mock.onGet('/api/data').reply(200, responseData)

  const response = await axiosInstance.get('/api/data')

  expect(response.status).toBe(200)
  expect(response.data).toEqual(responseData)
})

test('should handle failed request', async () => {
  mock.onGet('/api/data').reply(500, { error: 'Internal Server Error' })

  try {
    await axiosInstance.get('/api/data')
  } catch (error: any) {
    expect(error.response.status).toBe(500)
    expect(error.response.data).toEqual({ error: 'Internal Server Error' })
  }
})

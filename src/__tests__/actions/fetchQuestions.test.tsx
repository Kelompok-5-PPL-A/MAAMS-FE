import axios from 'axios'
import { fetchQuestions } from '../../actions/fetchQuestions' // Sesuaikan path sesuai struktur proyek Anda
import { formatTimestamp } from '../../utils/dateFormatter'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('fetchQuestions function', () => {
  const mockHeaders = { Authorization: 'Bearer token' }
  const mockTimeRange = 'last_week'
  const mockAdditionalParam = 'some_param'

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch questions successfully and process the data', async () => {
    const mockData = {
      count: 2,
      results: [
        {
          id: '1',
          question: 'Question 1',
          title: 'Title 1',
          created_at: '2024-03-31T12:00:00',
          mode: 'PENGAWASAN',
          username: 'user1',
          tags: ['tag1']
        },
        {
          id: '2',
          question: 'Question 2',
          title: 'Title 2',
          created_at: '2024-03-30T12:00:00',
          mode: 'PENGAWASAN',
          username: 'user2',
          tags: ['tag2']
        }
      ]
    }

    const expectedProcessedData = [
      {
        id: '1',
        title: 'Question 1',
        displayed_title: 'Title 1',
        timestamp: formatTimestamp('2024-03-31T12:00:00'),
        mode: 'PENGAWASAN',
        user: 'user1',
        tags: ['tag1']
      },
      {
        id: '2',
        title: 'Question 2',
        displayed_title: 'Title 2',
        timestamp: formatTimestamp('2024-03-30T12:00:00'),
        mode: 'PENGAWASAN',
        user: 'user2',
        tags: ['tag2']
      }
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: mockData })

    const result = await fetchQuestions(mockHeaders, mockTimeRange, mockAdditionalParam)

    expect(result).toEqual({
      count: 2,
      processedData: expectedProcessedData
    })

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/some_param&time_range=last_week`,
      {
        withCredentials: false,
        headers: mockHeaders
      }
    )
  })

  it('should throw an error when the fetching process fails', async () => {
    const errorMessage = 'Failed to fetch questions'
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage))
    await expect(fetchQuestions(mockHeaders, mockTimeRange, mockAdditionalParam)).rejects.toThrow(errorMessage)

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/some_param&time_range=last_week`,
      {
        withCredentials: false,
        headers: mockHeaders
      }
    )
  })
  it('should include time_range in URL when it is not empty', async () => {
    const mockData = {
      count: 0,
      results: []
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockData })

    const timeRange = 'this_week'
    const result = await fetchQuestions(mockHeaders, timeRange, mockAdditionalParam)

    expect(result).toEqual({
      count: 0,
      processedData: []
    })

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/some_param&time_range=${timeRange}`, // assert URL includes time_range
      {
        withCredentials: false,
        headers: mockHeaders
      }
    )
  })
})

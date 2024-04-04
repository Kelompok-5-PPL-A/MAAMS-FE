import axios from 'axios'
import { fetchQuestions } from '../../actions/fetchQuestions'
import { formatTimestamp } from '../../utils/dateFormatter'

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
        { question: 'Question 1', created_at: '2024-03-31T12:00:00', mode: 'PENGAWASAN', username: 'user1' },
        { question: 'Question 2', created_at: '2024-03-30T12:00:00', mode: 'PENGAWASAN', username: 'user2' }
      ]
    }
    const expectedProcessedData = [
      {
        title: 'Question 1',
        timestamp: formatTimestamp('2024-03-31T12:00:00'),
        mode: 'PENGAWASAN',
        user: 'user1'
      },
      {
        title: 'Question 2',
        timestamp: formatTimestamp('2024-03-30T12:00:00'),
        mode: 'PENGAWASAN',
        user: 'user2'
      }
    ]

    // Mock axios.get to return a resolved promise with mockData
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

    // Mock axios.get to return a rejected promise with an error object
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage))

    // Ensure that fetchQuestions throws the error
    await expect(fetchQuestions(mockHeaders, mockTimeRange, mockAdditionalParam)).rejects.toThrow(errorMessage)
  })
})

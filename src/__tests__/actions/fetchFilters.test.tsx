import axios from 'axios'
import { fetchFilters } from '../../actions/fetchFilters'
// import { FilterData } from '../../components/types/filterData';

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('fetchFilters', () => {
  it('should fetch filters successfully', async () => {
    const headers = {
      Authorization: 'Bearer token'
    }
    const response = {
      data: {
        pengguna: 'pengguna',
        judul: 'judul',
        topik: 'topik'
      }
    }
    mockedAxios.get.mockResolvedValue(response)

    const result = await fetchFilters(headers)

    expect(result).toEqual({
      pengguna: 'pengguna',
      judul: 'judul',
      topik: 'topik'
    })
  })

  it('should throw an error if axios request fails', async () => {
    const headers = {
      Authorization: 'Bearer token'
    }
    mockedAxios.get.mockRejectedValue(new Error('Error fetching filters'))

    await expect(fetchFilters(headers)).rejects.toThrow('Error fetching filters')
  })
})

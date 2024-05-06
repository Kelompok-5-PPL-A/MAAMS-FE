import axios from 'axios'
import { FilterData } from 'components/types/filterData'

interface CustomHeader {
  [key: string]: string
}

export const fetchFilters = async (headers: CustomHeader) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/field-values`

  const response = await axios.get(url, {
    withCredentials: false,
    headers: headers
  })

  const data: FilterData = {
    pengguna: response.data.pengguna,
    judul: response.data.judul,
    topik: response.data.topik
  }

  return data
}

export default fetchFilters

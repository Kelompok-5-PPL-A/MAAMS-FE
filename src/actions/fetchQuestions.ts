import axios from 'axios'
import { formatTimestamp } from '../utils/dateFormatter'
import { Item } from 'components/types/historyPage'

interface CustomHeader {
  [key: string]: string
}

interface historyData {
  count: number
  previous: string
  next: string
  results: Item[]
}

export const fetchQuestions = async (headers: CustomHeader, time_range?: string, additional_param?: string) => {
  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/${additional_param}`
  if (time_range !== '') {
    url += `&time_range=${time_range}`
  }

  const response = await axios.get(url, {
    withCredentials: false,
    headers: headers
  })

  const data: historyData = response.data
  console.log(data)

  const processedData: Item[] = data.results.map((item: any) => ({
    id: item.id,
    title: item.question,
    timestamp: formatTimestamp(item.created_at),
    mode: item.mode,
    user: item.username,
    tags: item.tags
  }))

  return {
    count: data.count,
    processedData: processedData
  }
}

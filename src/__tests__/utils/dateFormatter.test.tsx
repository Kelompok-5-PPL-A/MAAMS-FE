import { formatTimestamp } from '../../utils/dateFormatter'

describe('formatTimestamp function', () => {
  test('should format timestamp correctly', () => {
    const timestamp = '2024-04-01T08:30:00.000Z'
    const formattedTimestamp = formatTimestamp(timestamp)
    expect(formattedTimestamp).toBe('15:30 01/04/2024')
  })
})

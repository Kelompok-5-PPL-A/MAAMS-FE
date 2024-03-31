import { formatTimestamp } from '../../utils/dateFormatter'

describe('formatTimestamp function', () => {
  it('should format timestamp correctly', () => {
    const timestamp = '2024-04-01T08:30:00.000Z'
    const formattedTimestamp = formatTimestamp(timestamp)
    expect(formattedTimestamp).toBe('08:30 01/04/2024')
  })
})

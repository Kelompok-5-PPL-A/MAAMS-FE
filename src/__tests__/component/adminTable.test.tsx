import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import AdminTable from '../../components/adminTable'
import '@testing-library/jest-dom'

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn()
  })
}))

describe('AdminTable Component', () => {
  const mockData = [
    {
      id: '1',
      title: 'Test Title 1',
      displayed_title: 'Test Displayed Title 1',
      user: 'Test User 1',
      tags: ['tag1', 'tag2'],
      timestamp: '2024-04-29'
    }
  ]

  it('renders table rows correctly', () => {
    const { getByText } = render(<AdminTable data={mockData} />)

    expect(getByText('Test Displayed Title 1')).toBeInTheDocument()
    expect(getByText('Test User ...')).toBeInTheDocument()
    expect(getByText('tag1')).toBeInTheDocument()
    expect(getByText('tag2')).toBeInTheDocument()
    expect(getByText('2024-04-29')).toBeInTheDocument()
  })

  it('navigates to correct URL when row is clicked', () => {
    const { getByTestId } = render(<AdminTable data={mockData} />)

    fireEvent.click(getByTestId('view-button-1'))

    expect(require('next/router').useRouter().push).toHaveBeenCalledWith('/validator/1')
  })
})

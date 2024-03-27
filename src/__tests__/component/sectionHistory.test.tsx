import React from 'react'
import { render } from '@testing-library/react'
import Section from '../../components/sectionHistory'
import { SectionHistoryProps } from '../../components/types/sectionHistory'
import '@testing-library/jest-dom'
// Mock useRouter hook
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

describe('Section Component', () => {
  it('renders section with items correctly', () => {
    const items = [
      { title: 'Item 1', timestamp: '2024-03-25', mode: 'read' },
      { title: 'Item 2', timestamp: '2024-03-26', mode: 'write' }
    ]

    const { getByTestId, getByText } = render(<Section title='History' items={items} />)

    // Ensure section title renders
    expect(getByTestId('History-section')).toBeInTheDocument()

    // Ensure each item title renders
    expect(getByText('Item 1')).toBeInTheDocument()
    expect(getByText('Item 2')).toBeInTheDocument()

    // You can add more assertions for timestamps, modes, etc.
  })

  it('renders section with no items when items array is empty', () => {
    const items: SectionHistoryProps['items'] = [] // empty array

    const { getByTestId, queryByText } = render(<Section title='History' items={items} />)

    // Ensure section title renders
    expect(getByTestId('History-section')).toBeInTheDocument()

    // Ensure no item is rendered
    expect(queryByText('Item 1')).toBeNull()
    expect(queryByText('Item 2')).toBeNull()

    // You can add more assertions if necessary.
  })
})

import React from 'react'
import { render } from '@testing-library/react'
import Section from '../../components/sectionHistory'
import '@testing-library/jest-dom'

jest.mock('../../components/itemListHistory', () => () => <div data-testid='mock-list-item'></div>)

describe('Section component', () => {
  const sectionTitle = 'Test Section'
  const sectionItems = [
    { title: 'Item 1', timestamp: '2024-03-24', mode: 'test' },
    { title: 'Item 2', timestamp: '2024-03-25', mode: 'test' }
  ]

  it('renders list items', () => {
    const { getAllByTestId } = render(<Section title={sectionTitle} items={sectionItems} />)
    const listItems = getAllByTestId('mock-list-item')
    expect(listItems.length).toBe(sectionItems.length)
  })
})

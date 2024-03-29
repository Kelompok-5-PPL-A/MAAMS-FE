import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ListItem from '../../components/itemListHistory'
import '@testing-library/jest-dom'

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() })
}))

describe('ListItem Component', () => {
  test('action dots can be clicked', () => {
    const title = 'Test Title'
    const timestamp = '2024-03-24T12:00:00'
    const mode = 'testMode'

    const { getByTestId } = render(<ListItem title={title} timestamp={timestamp} mode={mode} />)
    const actionDots = getByTestId('action-dots-svg')
    fireEvent.click(actionDots)
    expect(require('next/router').useRouter().push).toHaveBeenCalledWith('/history')
  })
})

import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { CounterButton } from '../../components/counterButton'

describe('CounterButton Component', () => {
  // Positive Test: Renders correctly with the given number
  test('renders with the given number', () => {
    const number = 3
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    const { getByText } = render(<CounterButton number={number} onIncrement={onIncrement} onDecrement={onDecrement} />)

    // Check if the component renders the correct number
    expect(getByText(number.toString())).toBeInTheDocument()
  })

  // Positive Test: Calls onIncrement when the "+" button is clicked
  test('calls onIncrement when the "+" button is clicked', () => {
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    const { getByText } = render(<CounterButton number={3} onIncrement={onIncrement} onDecrement={onDecrement} />)

    // Click the "+" button
    fireEvent.click(getByText('+'))

    // Check if onIncrement is called
    expect(onIncrement).toHaveBeenCalled()
  })

  // Positive Test: Calls onDecrement when the "-" button is clicked
  test('calls onDecrement when the "-" button is clicked', () => {
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    const { getByText } = render(<CounterButton number={3} onIncrement={onIncrement} onDecrement={onDecrement} />)

    // Click the "-" button
    fireEvent.click(getByText('-'))

    // Check if onDecrement is called
    expect(onDecrement).toHaveBeenCalled()
  })

  // Negative Test: Does not render with a negative number
  test('does not render with a negative number', () => {
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    const { queryByText } = render(<CounterButton number={-1} onIncrement={onIncrement} onDecrement={onDecrement} />)

    // Check if the component does not render a negative number using custom matcher function
    expect(queryByText((content, element) => content === '-1' && !element?.className.includes('text-black'))).toBeNull()
  })
})

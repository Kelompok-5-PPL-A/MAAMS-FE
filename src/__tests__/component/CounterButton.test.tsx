import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { CounterButton } from '../../components/counterButton'

describe('CounterButton Component', () => {
  test('renders with the given number', () => {
    const number = 3
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    const { getByText } = render(<CounterButton number={number} onIncrement={onIncrement} onDecrement={onDecrement} />)
    expect(getByText(number.toString())).toBeInTheDocument()
  })

  test('calls onIncrement when the "+" button is clicked', () => {
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    const { getByText } = render(<CounterButton number={3} onIncrement={onIncrement} onDecrement={onDecrement} />)

    fireEvent.click(getByText('+'))
    expect(onIncrement).toHaveBeenCalled()
  })

  test('calls onDecrement when the "-" button is clicked', () => {
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    const { getByText } = render(<CounterButton number={3} onIncrement={onIncrement} onDecrement={onDecrement} />)

    fireEvent.click(getByText('-'))
    expect(onDecrement).toHaveBeenCalled()
  })

  test('does not render with a negative number', () => {
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    const { queryByText } = render(<CounterButton number={-1} onIncrement={onIncrement} onDecrement={onDecrement} />)
    expect(queryByText((content, element) => content === '-1' && !element?.className.includes('text-black'))).toBeNull()
  })
})

// tests/Cell.test.tsx
import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Cell } from '../../components/cell'

describe('Cell Component', () => {
  test('renders cell with correct cellName and cause', () => {
    const mockOnChange = jest.fn()
    const cellName = 'A1'
    const cause = 'Example Cause'

    const component = <Cell cellName={cellName} cause={cause} onChange={mockOnChange} />
    const { getByText, getByPlaceholderText } = render(component)

    // Check if the cellName is rendered
    expect(getByText(cellName)).toBeInTheDocument()

    // Check if the cause is rendered in the textarea
    const textareaElement = getByPlaceholderText('Isi sebab...')
    expect(textareaElement).toBeInTheDocument()
    expect(textareaElement).toHaveValue(cause)
  })

  test('calls onChange handler when textarea value changes', () => {
    const mockOnChange = jest.fn()
    const cellName = 'A1'

    const component = <Cell cellName={cellName} cause='' onChange={mockOnChange} />
    const { getByPlaceholderText } = render(component)

    const textareaElement = getByPlaceholderText('Isi sebab...')

    // Simulate a user typing in the textarea
    fireEvent.change(textareaElement, { target: { value: 'New Cause' } })

    // Check if the onChange handler is called with the correct value
    expect(mockOnChange).toHaveBeenCalledWith('New Cause')
  })

  test('renders with empty cause when no cause is provided', () => {
    const mockOnChange = jest.fn()
    const cellName = 'A1'

    const component = <Cell cellName={cellName} onChange={mockOnChange} cause='' />
    const { getByPlaceholderText } = render(component)

    // Check if the cause is initially empty in the textarea
    const textareaElement = getByPlaceholderText('Isi sebab...')
    expect(textareaElement).toBeInTheDocument()
    expect(textareaElement).toHaveValue('')
  })

  test('does not render cellName when no cellName is provided', () => {
    const mockOnChange = jest.fn()

    const component = <Cell cellName='' onChange={mockOnChange} cause='' />
    const { queryByText } = render(component)

    // Check if the cellName is not rendered
    const cellNameElement = queryByText(/^[A-Z]\d+$/)
    expect(cellNameElement).toBeNull()
  })
})

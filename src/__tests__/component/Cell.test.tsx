import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Cell } from '../../components/cell'
import { CauseStatus } from '../../lib/enum'

describe('Cell Component', () => {
  const mockOnChange = jest.fn()
  const cellName = 'A1'
  const cause = 'Example Cause'
  const placeholder = 'Enter cause..'

  test('renders cell with correct cellName, cause, and placeholder', () => {
    const component = (
      <Cell
        cellName={cellName}
        cause={cause}
        onChange={mockOnChange}
        causeStatus={CauseStatus.Unchecked}
        disabled={false}
        placeholder={placeholder}
      />
    )
    const { getByText, getByPlaceholderText } = render(component)

    expect(getByText(cellName)).toBeInTheDocument()

    const textareaElement = getByPlaceholderText(placeholder) as HTMLTextAreaElement
    expect(textareaElement).toBeInTheDocument()
    expect(textareaElement.value).toBe(cause)
  })

  test('calls onChange handler when textarea value changes', () => {
    const component = (
      <Cell
        cellName={cellName}
        cause=''
        onChange={mockOnChange}
        causeStatus={CauseStatus.Unchecked}
        disabled={false}
        placeholder={placeholder}
      />
    )
    const { getByPlaceholderText } = render(component)

    const textareaElement = getByPlaceholderText(placeholder) as HTMLTextAreaElement

    fireEvent.change(textareaElement, { target: { value: 'New Cause' } })
    expect(mockOnChange).toHaveBeenCalledWith('New Cause')
  })

  test('renders correctly with no cause provided', () => {
    const component = (
      <Cell
        cellName={cellName}
        cause=''
        onChange={mockOnChange}
        causeStatus={CauseStatus.Unchecked}
        disabled={false}
        placeholder={placeholder}
      />
    )
    const { getByPlaceholderText } = render(component)

    const textareaElement = getByPlaceholderText(placeholder) as HTMLTextAreaElement
    expect(textareaElement.value).toBe('')
  })

  test('does not render cellName when no cellName is provided', () => {
    const component = (
      <Cell
        cellName=''
        cause={cause}
        onChange={mockOnChange}
        causeStatus={CauseStatus.Unchecked}
        disabled={false}
        placeholder={placeholder}
      />
    )
    const { queryByText } = render(component)

    const cellNameElement = queryByText(/^[A-Z]\d+$/)
    expect(cellNameElement).not.toBeInTheDocument()
  })

  test('textarea is disabled when disabled prop is true', () => {
    const component = (
      <Cell
        cellName={cellName}
        cause={cause}
        onChange={mockOnChange}
        causeStatus={CauseStatus.Unchecked}
        disabled={true}
        placeholder={placeholder}
      />
    )
    const { getByPlaceholderText } = render(component)

    const textareaElement = getByPlaceholderText(placeholder) as HTMLTextAreaElement
    expect(textareaElement.disabled).toBe(true)
  })

  test.each([
    { status: CauseStatus.Incorrect, expectedClass: 'border-red-500' },
    { status: CauseStatus.CorrectNotRoot, expectedClass: 'border-green-500' },
    { status: CauseStatus.CorrectRoot, expectedClass: 'border-purple-500' },
    { status: CauseStatus.Unchecked, expectedClass: 'border-black' }
  ])('applies correct outline class based on causeStatus', ({ status, expectedClass }) => {
    const component = (
      <Cell
        cellName={cellName}
        cause={cause}
        onChange={mockOnChange}
        causeStatus={status}
        disabled={false}
        placeholder={placeholder}
      />
    )
    const { getByPlaceholderText } = render(component)

    const textareaElement = getByPlaceholderText(placeholder) as HTMLTextAreaElement
    expect(textareaElement.className).toContain(expectedClass)
  })

  test.each([
    { disabled: true, expected: true },
    { disabled: false, expected: false }
  ])('textarea disabled state is $expected when disabled prop is $disabled', ({ disabled, expected }) => {
    const component = (
      <Cell
        cellName={cellName}
        cause={cause}
        onChange={mockOnChange}
        causeStatus={CauseStatus.Unchecked}
        disabled={disabled}
        placeholder={placeholder}
      />
    )
    const { getByPlaceholderText } = render(component)

    const textareaElement = getByPlaceholderText(placeholder) as HTMLTextAreaElement
    expect(textareaElement.disabled).toBe(expected)
  })

  test('updates placeholder text based on placeholder prop', () => {
    const newPlaceholder = 'Updated Placeholder'
    const component = (
      <Cell
        cellName={cellName}
        cause={cause}
        onChange={mockOnChange}
        causeStatus={CauseStatus.Unchecked}
        disabled={false}
        placeholder={newPlaceholder}
      />
    )
    const { getByPlaceholderText } = render(component)

    expect(getByPlaceholderText(newPlaceholder)).toBeInTheDocument()
  })
})

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CustomInput } from '../../components/customInput'

describe('CustomInput Component', () => {
  test('renders input with placeholder and calls onChange when input value changes', () => {
    const setQuestion = jest.fn()
    const placeholder = 'Enter something'
    const { getByPlaceholderText } = render(
      <CustomInput placeholder={placeholder} onChange={(e) => setQuestion(e.target.value)} />
    )
    const inputElement = getByPlaceholderText(placeholder)
    expect(inputElement.getAttribute('value')).toBe('')
    fireEvent.change(inputElement, { target: { value: 'test' } })
    expect(setQuestion).toHaveBeenCalledWith('test')
  })

  test('renders label when provided', () => {
    const onChange = jest.fn()
    const label = 'Name'
    const { getByText } = render(<CustomInput label={label} onChange={onChange} />)
    const labelElement = getByText(label)
    expect(labelElement).toBeInTheDocument()
  })

  test('renders error message when error is provided', () => {
    const onChange = jest.fn()
    const errorMessage = 'Invalid input'
    const { getByText } = render(<CustomInput error={errorMessage} onChange={onChange} />)
    const errorElement = getByText(errorMessage)
    expect(errorElement).toBeInTheDocument()
  })

  test('renders disabled input when isDisabled is true', () => {
    const onChange = jest.fn()
    const placeholder = 'Enter something'
    const { getByPlaceholderText } = render(
      <CustomInput placeholder={placeholder} isDisabled={true} onChange={onChange} />
    )
    const inputElement = getByPlaceholderText('Enter something')
    expect(inputElement).toBeDisabled()
  })

  test('renders error icon when error is provided', () => {
    const onChange = jest.fn()
    const errorMessage = 'Invalid input'
    const { getByText } = render(<CustomInput error={errorMessage} onChange={onChange} />)
    const errorIcon = getByText(errorMessage).previousElementSibling // Mendapatkan elemen sebelumnya (yang harusnya ikon error)
    expect(errorIcon).toBeInTheDocument()
  })
})

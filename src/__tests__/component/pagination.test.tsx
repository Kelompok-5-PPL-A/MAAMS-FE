import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Pagination from '../../components/pagination'
import '@testing-library/jest-dom'

describe('Pagination Component', () => {
  const onPageChangeMock = jest.fn()

  beforeEach(() => {
    onPageChangeMock.mockClear()
  })

  it('renders pagination correctly with given props', () => {
    const { getByText } = render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />)
    expect(getByText('1')).toBeInTheDocument()
    expect(getByText('2')).toBeInTheDocument()
    expect(getByText('4')).toBeInTheDocument()
    expect(getByText('5')).toBeInTheDocument()
  })

  it('calls onPageChange when clicking on a page button', () => {
    const { getByText } = render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />)
    fireEvent.click(getByText('1'))
    expect(onPageChangeMock).toHaveBeenCalledWith(1)
  })

  it('disables previous button on first page', () => {
    const { getByLabelText } = render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChangeMock} />)
    const previousButton = getByLabelText(/previous/i)
    expect(previousButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChangeMock} />)
    const nextButton = getByLabelText(/next/i)
    expect(nextButton).toBeDisabled()
  })

  it('enables input mode when ellipsis button is clicked', () => {
    const { getByText, getByDisplayValue } = render(
      <Pagination currentPage={3} totalPages={10} onPageChange={onPageChangeMock} />
    )
    fireEvent.click(getByText('...'))
    expect(getByDisplayValue('3')).toBeInTheDocument()
  })

  it('updates input field correctly and submits the new page number on Enter', () => {
    const { getByText, getByDisplayValue } = render(
      <Pagination currentPage={3} totalPages={10} onPageChange={onPageChangeMock} />
    )
    fireEvent.click(getByText('...'))
    const input = getByDisplayValue('3')
    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(onPageChangeMock).toHaveBeenCalledWith(5)
  })

  it('does not submit page change if input value is invalid', () => {
    const { getByText, getByDisplayValue } = render(
      <Pagination currentPage={3} totalPages={10} onPageChange={onPageChangeMock} />
    )
    fireEvent.click(getByText('...'))
    const input = getByDisplayValue('3')
    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(onPageChangeMock).not.toHaveBeenCalled()
  })

  it('exits input mode when input loses focus', () => {
    const { getByText, queryByDisplayValue } = render(
      <Pagination currentPage={3} totalPages={10} onPageChange={onPageChangeMock} />
    )
    fireEvent.click(getByText('...'))
    const input = queryByDisplayValue('3')
    fireEvent.blur(input)
    expect(queryByDisplayValue('3')).toBeNull()
  })

  it('prevents entering non-numeric characters in the input field', () => {
    const { getByText, getByRole } = render(
      <Pagination currentPage={2} totalPages={10} onPageChange={onPageChangeMock} />
    )
    fireEvent.click(getByText('...'))
    const input = getByRole('spinbutton')
    fireEvent.change(input, { target: { value: 'abc' } })
    expect(input.value).toBe('')
  })

  it('retains the last valid number if an invalid number is entered', () => {
    const { getByText, getByRole } = render(
      <Pagination currentPage={2} totalPages={10} onPageChange={onPageChangeMock} />
    )
    fireEvent.click(getByText('...'))
    const input = getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '11' } })
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(input.value).toBe('')
  })
})

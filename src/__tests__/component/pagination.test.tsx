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
    expect(getByText('3')).toBeInTheDocument()
    expect(getByText('4')).toBeInTheDocument()
    expect(getByText('5')).toBeInTheDocument()
  })

  it('calls onPageChange when clicking on a page button', () => {
    const { getByText } = render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />)

    fireEvent.click(getByText('3'))
    expect(onPageChangeMock).toHaveBeenCalledWith(3)
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

  it('calls onPageChange with correct page number on previous button click', () => {
    const { getByLabelText } = render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChangeMock} />)

    const previousButton = getByLabelText(/previous/i)
    fireEvent.click(previousButton)
    expect(onPageChangeMock).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with correct page number on next button click', () => {
    const { getByLabelText } = render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChangeMock} />)

    const nextButton = getByLabelText(/next/i)
    fireEvent.click(nextButton)
    expect(onPageChangeMock).toHaveBeenCalledWith(4)
  })

  it('disables ellipsis button when not needed', () => {
    const { queryByTestId } = render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChangeMock} />)

    const ellipsisButton = queryByTestId('ellipsis-button')
    expect(ellipsisButton).not.toBeInTheDocument()
  })

  it('disables ellipsis button when there are no more pages after maxButtonsToShow', () => {
    const { queryByTestId } = render(<Pagination currentPage={7} totalPages={10} onPageChange={onPageChangeMock} />)

    const ellipsisButton = queryByTestId('ellipsis-button')
    expect(ellipsisButton).not.toBeInTheDocument()
  })

  it('calls onPageChange with correct page number on ellipsis button click', () => {
    const { getByTestId } = render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChangeMock} />)

    const ellipsisButton = getByTestId('ellipsis-button')
    fireEvent.click(ellipsisButton)
    expect(onPageChangeMock).toHaveBeenCalledWith(4)
  })
})

import React from 'react'
import { render, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import ValidatorDetailPage from '../../pages/validator/[id]'

jest.mock('next/router', () => require('next-router-mock'))

describe('ValidatorPage Page Tests', () => {
  test('renders validatorPage page with CounterButton and initial Row', () => {
    const { getByText, getAllByTestId } = render(<ValidatorDetailPage />)

    expect(getByText('Sebab:')).toBeInTheDocument()
    expect(getByText('3')).toBeInTheDocument()
    expect(getAllByTestId('row-container')).toHaveLength(1) // Initial row count
  })

  test('increments and decrements columns on button clicks', async () => {
    const { getByText, findAllByPlaceholderText } = render(<ValidatorDetailPage />)

    const incrementButton = getByText('+')
    fireEvent.click(incrementButton)
    expect(getByText('4')).toBeInTheDocument()

    const placeholders = await findAllByPlaceholderText('Isi sebab..')
    expect(placeholders.length).toBeGreaterThan(0)

    const decrementButton = getByText('-')
    fireEvent.click(decrementButton)
    expect(getByText('3')).toBeInTheDocument()
  })

  test('does not allow incrementing beyond 5 columns', () => {
    const { getByText } = render(<ValidatorDetailPage />)

    const incrementButton = getByText('+')
    for (let i = 0; i < 5; i++) {
      fireEvent.click(incrementButton)
    }
    expect(getByText('5')).toBeInTheDocument()

    fireEvent.click(incrementButton) // Attempt to increment beyond the limit
    fireEvent.click(incrementButton)
    expect(getByText('5')).toBeInTheDocument() // Confirm the column count does not exceed 5
  })

  test('does not allow decrementing below 3 columns', () => {
    const { getByText } = render(<ValidatorDetailPage />)

    const decrementButton = getByText('-')
    for (let i = 0; i < 3; i++) {
      fireEvent.click(decrementButton)
    }
    expect(getByText('3')).toBeInTheDocument()

    fireEvent.click(decrementButton)
    fireEvent.click(decrementButton)
    expect(getByText('3')).toBeInTheDocument()
  })

  test('adds a new row on submitting causes with correct feedback', async () => {
    const { getByText, findAllByText, getAllByTestId } = render(<ValidatorDetailPage />)

    const cells = getAllByTestId('cell')
    for (const cell of cells) {
      const input = within(cell).getByPlaceholderText('Isi sebab..') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Some cause' } })
    }

    const submitButton = getByText('Kirim Sebab')
    fireEvent.click(submitButton)

    const feedbackMessages = await findAllByText(/Penyebab pada [ABCDE]\d sudah tepat/)
    expect(feedbackMessages.length).toBeGreaterThan(0)

    const rows = getAllByTestId('row-container')
    expect(rows).toHaveLength(2)
  })
})

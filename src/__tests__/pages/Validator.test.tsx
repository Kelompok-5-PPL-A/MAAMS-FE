import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import ValidatorPage from '../../pages/validator'

test('renders validator page with CounterButton and Row', () => {
  const { getByText, getByTestId } = render(<ValidatorPage />)

  // Check if the main heading is present
  expect(getByText('Sebab:')).toBeInTheDocument()

  // Check if CounterButton is rendered
  expect(getByText('Jumlah Kolom (Max 5)')).toBeInTheDocument()

  // Check if Row is rendered
  expect(getByTestId('row-container')).toBeInTheDocument()
})

test('increments and decrements columns on button clicks', () => {
  const { getByText } = render(<ValidatorPage />)

  // Check if the initial column count is correct
  expect(getByText('3')).toBeInTheDocument()

  // Click on the increment button
  fireEvent.click(getByText('+'))
  expect(getByText('4')).toBeInTheDocument()

  // Click on the decrement button
  fireEvent.click(getByText('-'))
  expect(getByText('3')).toBeInTheDocument()
})

test('does not allow incrementing beyond 5 columns', () => {
  const { getByText } = render(<ValidatorPage />)

  // Click on the increment button four times
  fireEvent.click(getByText('+'))
  fireEvent.click(getByText('+'))
  fireEvent.click(getByText('+'))
  fireEvent.click(getByText('+'))

  // The column count should be 5
  expect(getByText('5')).toBeInTheDocument()

  // Try clicking once more
  fireEvent.click(getByText('+'))

  // The column count should still be 5
  expect(getByText('5')).toBeInTheDocument()
})

test('does not allow decrementing below 3 columns', () => {
  const { getByText } = render(<ValidatorPage />)

  // Click on the decrement button two times
  fireEvent.click(getByText('-'))
  fireEvent.click(getByText('-'))

  // The column count should be 3
  expect(getByText('3')).toBeInTheDocument()

  // Try clicking once more
  fireEvent.click(getByText('-'))

  // The column count should still be 3
  expect(getByText('3')).toBeInTheDocument()
})

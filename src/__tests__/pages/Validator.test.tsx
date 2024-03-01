import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import ValidatorPage from '../../pages/validator'

test('renders validator page with CounterButton and Row', () => {
  const { getByText, getByTestId } = render(<ValidatorPage />)

  expect(getByText('Sebab:')).toBeInTheDocument()
  expect(getByText('Jumlah Kolom (Max 5)')).toBeInTheDocument()
  expect(getByTestId('row-container')).toBeInTheDocument()
})

test('increments and decrements columns on button clicks', () => {
  const { getByText } = render(<ValidatorPage />)

  expect(getByText('3')).toBeInTheDocument()

  fireEvent.click(getByText('+'))
  expect(getByText('4')).toBeInTheDocument()

  fireEvent.click(getByText('-'))
  expect(getByText('3')).toBeInTheDocument()
})

test('does not allow incrementing beyond 5 columns', () => {
  const { getByText } = render(<ValidatorPage />)

  fireEvent.click(getByText('+'))
  fireEvent.click(getByText('+'))
  fireEvent.click(getByText('+'))
  fireEvent.click(getByText('+'))
  expect(getByText('5')).toBeInTheDocument()

  fireEvent.click(getByText('+'))
  expect(getByText('5')).toBeInTheDocument()
})

test('does not allow decrementing below 3 columns', () => {
  const { getByText } = render(<ValidatorPage />)

  fireEvent.click(getByText('-'))
  fireEvent.click(getByText('-'))
  expect(getByText('3')).toBeInTheDocument()

  fireEvent.click(getByText('-'))
  expect(getByText('3')).toBeInTheDocument()
})

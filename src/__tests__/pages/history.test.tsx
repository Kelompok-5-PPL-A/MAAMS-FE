import React from 'react'
import { render, screen } from '@testing-library/react'
import History from '../../pages/history'
import '@testing-library/jest-dom'

// Mock useRouter from next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

describe('History component', () => {
  test('renders history title', () => {
    render(<History />)
    const historyTitle = screen.getByTestId('history-title')
    expect(historyTitle).toBeInTheDocument()
    expect(historyTitle.textContent).toBe('Riwayat Analisis')
  })

  test('renders past week section', () => {
    render(<History />)
    const pastWeekSection = screen.getByTestId('7 hari terakhir-section')
    expect(pastWeekSection).toBeInTheDocument()
    expect(pastWeekSection).toHaveTextContent('7 hari terakhir')
  })
})

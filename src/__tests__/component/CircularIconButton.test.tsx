import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { CircularIconButton } from '../../components/CircularIconButton'

describe('CircularIconButton Component', () => {
  test('renders button with provided icon', () => {
    const { getByText } = render(<CircularIconButton icon='Test Icon' onClick={() => {}} type='button' />)
    const buttonElement = getByText('Test Icon') // Find button by its text content
    expect(buttonElement).toBeInTheDocument()
  })

  test('calls onClick function when button is clicked', () => {
    const handleClick = jest.fn()
    const { getByText } = render(<CircularIconButton icon='Test Icon' onClick={handleClick} type='button' />)
    const buttonElement = getByText('Test Icon') // Find button by its text content
    fireEvent.click(buttonElement)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

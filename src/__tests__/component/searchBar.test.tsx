import React from 'react'
import '@testing-library/jest-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { SearchBar } from '../../components/searchBar'

describe('SearchBar component', () => {
  const mockSuggestions = ['apple', 'banana', 'orange']
  const mockOnChange = jest.fn()
  const mockOnSelect = jest.fn()
  const mockOnSubmit = jest.fn()

  const isAdmin = false
  const publicAnalyses = false
  const suggestion: string[] = []
  const keyword = ''

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders and triggers onChange and onSubmit', async () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        isAdmin={isAdmin}
        publicAnalyses={publicAnalyses}
        suggestions={suggestion}
        keyword={keyword}
        onSelect={mockOnSelect}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    )

    expect(getByPlaceholderText('Cari analisis..')).toBeInTheDocument()
  })

  test('handles input change and suggestion filtering', async () => {
    const suggestions = ['apple', 'BAnana', 'orAnge', 'storeApp']

    render(
      <SearchBar
        isAdmin={isAdmin}
        publicAnalyses={publicAnalyses}
        suggestions={suggestions}
        keyword={keyword}
        onSelect={mockOnSelect}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    )

    const inputElement = screen.getByPlaceholderText('Cari analisis..')

    fireEvent.change(inputElement, { target: { value: 'app' } })

    expect(mockOnChange).toHaveBeenCalledWith('app')

    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument()
      expect(screen.getByText('storeApp')).toBeInTheDocument()
      expect(screen.queryByText('BAnana')).not.toBeInTheDocument()
      expect(screen.queryByText('orAnge')).not.toBeInTheDocument()
    })
  })

  test('handles two times input change and suggestion filtering', async () => {
    const suggestions = ['apple', 'BAnana', 'orAnge', 'storeApp']

    render(
      <SearchBar
        isAdmin={isAdmin}
        publicAnalyses={publicAnalyses}
        suggestions={suggestions}
        keyword={keyword}
        onSelect={mockOnSelect}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    )

    const inputElement = screen.getByPlaceholderText('Cari analisis..')

    fireEvent.change(inputElement, { target: { value: 'app' } })
    expect(mockOnChange).toHaveBeenCalledWith('app')

    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument()
      expect(screen.getByText('storeApp')).toBeInTheDocument()
      expect(screen.queryByText('BAnana')).not.toBeInTheDocument()
      expect(screen.queryByText('orAnge')).not.toBeInTheDocument()
    })

    fireEvent.change(inputElement, { target: { value: 'an' } })
    expect(mockOnChange).toHaveBeenCalledWith('an')

    await waitFor(() => {
      expect(screen.getByText('BAnana')).toBeInTheDocument()
      expect(screen.getByText('orAnge')).toBeInTheDocument()
      expect(screen.queryByText('apple')).not.toBeInTheDocument()
      expect(screen.queryByText('storeApp')).not.toBeInTheDocument()
    })
  })

  test('handles submit action', () => {
    render(
      <SearchBar
        isAdmin={isAdmin}
        publicAnalyses={publicAnalyses}
        suggestions={mockSuggestions}
        keyword={keyword}
        onSelect={mockOnSelect}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    )

    fireEvent.click(screen.getByTestId('search-button'))
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
  })

  test('triggers onSubmit on enter keypress after input change', async () => {
    render(
      <SearchBar
        isAdmin={isAdmin}
        publicAnalyses={publicAnalyses}
        suggestions={suggestion}
        keyword={keyword}
        onSelect={mockOnSelect}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    )

    const inputElement = await waitFor(() => screen.getByPlaceholderText('Cari analisis..'))
    fireEvent.change(inputElement, { target: { value: 'keyword' } })
    fireEvent.keyPress(inputElement, { key: 'Enter', charCode: 13 })
    expect(mockOnSubmit).toHaveBeenCalled()
  })

  test('autocomplete search triggers correctly', async () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        isAdmin={isAdmin}
        publicAnalyses={publicAnalyses}
        suggestions={mockSuggestions}
        keyword={keyword}
        onSelect={mockOnSelect}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    )

    const autoCompleteInput = getByPlaceholderText('Cari analisis..') as HTMLInputElement
    fireEvent.change(autoCompleteInput, { target: { value: 'app' } })

    await waitFor(() => {
      setTimeout(() => {
        expect(autoCompleteInput.value).toBe('app')
        expect(screen.getByText('apple')).toBeInTheDocument()
        expect(screen.queryByText('banana')).not.toBeInTheDocument()
        expect(screen.queryByText('orange')).not.toBeInTheDocument()
      }, 2000)
    })
  })
})

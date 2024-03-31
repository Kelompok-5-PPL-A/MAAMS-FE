import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { SearchBar } from '../../components/searchBar'

describe('SearchBar component', () => {
  // Positive test: renders the component and triggers onChange and onSubmit
  test('renders and triggers onChange and onSubmit', () => {
    const keyword = ''
    const onChange = jest.fn()
    const onSubmit = jest.fn()

    const { getByPlaceholderText } = render(<SearchBar keyword={keyword} onChange={onChange} onSubmit={onSubmit} />)

    // Simulate input change
    const inputElement = getByPlaceholderText('Cari analisis...')
    fireEvent.change(inputElement, { target: { value: 'test' } })

    // Check if onChange is called with the correct value
    expect(onChange).toHaveBeenCalledWith('test')

    // Simulate enter key press
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' })

    // Check if onSubmit is called
    expect(onSubmit).toHaveBeenCalled()
  })

  // Negative test: checks if onSubmit is not triggered on input change
  test('does not trigger onSubmit on input change', () => {
    const keyword = ''
    const onChange = jest.fn()
    const onSubmit = jest.fn()

    const { getByPlaceholderText } = render(<SearchBar keyword={keyword} onChange={onChange} onSubmit={onSubmit} />)

    // Simulate input change
    const inputElement = getByPlaceholderText('Cari analisis...')
    fireEvent.change(inputElement, { target: { value: 'test' } })

    // Check if onSubmit is not called
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('triggers onSubmit on button click after input change', () => {
    const onSubmitMock = jest.fn()
    const onChangeMock = jest.fn()

    const { getByPlaceholderText, getByRole } = render(
      <SearchBar keyword='' onChange={onChangeMock} onSubmit={onSubmitMock} />
    )

    // Simulate user entering a keyword
    const inputElement = getByPlaceholderText('Cari analisis...')
    fireEvent.change(inputElement, { target: { value: 'keyword' } })

    // Simulate user clicking the search button
    const searchButton = getByRole('button', { name: 'Search Icon' })
    fireEvent.click(searchButton)

    // Verify that onSubmit is called
    expect(onSubmitMock).toHaveBeenCalled()
  })
})

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { SearchBar } from '../../components/searchBar'

describe('SearchBar component', () => {
  test('renders and triggers onChange and onSubmit', () => {
    const keyword = ''
    const onChange = jest.fn()
    const onSubmit = jest.fn()

    const { getByPlaceholderText } = render(<SearchBar keyword={keyword} onChange={onChange} onSubmit={onSubmit} />)

    const inputElement = getByPlaceholderText('Cari analisis...')
    fireEvent.change(inputElement, { target: { value: 'test' } })
    expect(onChange).toHaveBeenCalledWith('test')

    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' })
    expect(onSubmit).toHaveBeenCalled()
  })

  test('does not trigger onSubmit on input change', () => {
    const keyword = ''
    const onChange = jest.fn()
    const onSubmit = jest.fn()

    const { getByPlaceholderText } = render(<SearchBar keyword={keyword} onChange={onChange} onSubmit={onSubmit} />)

    const inputElement = getByPlaceholderText('Cari analisis...')
    fireEvent.change(inputElement, { target: { value: 'test' } })

    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('triggers onSubmit on button click after input change', () => {
    const onSubmitMock = jest.fn()
    const onChangeMock = jest.fn()

    const { getByPlaceholderText, getByRole } = render(
      <SearchBar keyword='' onChange={onChangeMock} onSubmit={onSubmitMock} />
    )

    const inputElement = getByPlaceholderText('Cari analisis...')
    fireEvent.change(inputElement, { target: { value: 'keyword' } })

    const searchButton = getByRole('button', { name: 'Search Icon' })
    fireEvent.click(searchButton)

    expect(onSubmitMock).toHaveBeenCalled()
  })
})

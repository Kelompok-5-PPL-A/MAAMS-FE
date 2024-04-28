import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { SearchBar } from '../../components/searchBar'

describe('SearchBar component', () => {
  test('renders and triggers onChange and onSubmit', async () => {
    const isAdmin = false
    const publicAnalyses = false
    const filter = ''
    const keyword = ''
    const onSelect = jest.fn()
    const onChange = jest.fn()
    const onSubmit = jest.fn()

    const { getByPlaceholderText } = render(
      <SearchBar
        isAdmin={isAdmin}
        publicAnalyses={publicAnalyses}
        filter={filter}
        keyword={keyword}
        onSelect={onSelect}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    )

    const inputElement = await waitFor(() => getByPlaceholderText('Cari analisis...'))
    fireEvent.change(inputElement, { target: { value: 'test' } })
    expect(onChange).toHaveBeenCalledWith('test')

    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' })
    expect(onSubmit).toHaveBeenCalled()
  })

  test('does not trigger onSubmit on input change', async () => {
    const isAdmin = false
    const publicAnalyses = false
    const filter = ''
    const keyword = ''
    const onSelect = jest.fn()
    const onChange = jest.fn()
    const onSubmit = jest.fn()

    const { getByPlaceholderText } = render(
      <SearchBar
        isAdmin={isAdmin}
        publicAnalyses={publicAnalyses}
        filter={filter}
        keyword={keyword}
        onSelect={onSelect}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    )

    const inputElement = await waitFor(() => getByPlaceholderText('Cari analisis...'))
    fireEvent.change(inputElement, { target: { value: 'test' } })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('triggers onSubmit on button click after input change', async () => {
    const isAdmin = false
    const publicAnalyses = false
    const filter = ''
    const keyword = ''
    const onSelectMock = jest.fn()
    const onChangeMock = jest.fn()
    const onSubmitMock = jest.fn()

    const { getByPlaceholderText, getByRole } = render(
      <SearchBar
        isAdmin={isAdmin}
        publicAnalyses={publicAnalyses}
        filter={filter}
        keyword={keyword}
        onSelect={onSelectMock}
        onChange={onChangeMock}
        onSubmit={onSubmitMock}
      />
    )

    const inputElement = await waitFor(() => getByPlaceholderText('Cari analisis...'))
    fireEvent.change(inputElement, { target: { value: 'keyword' } })

    const searchButton = getByRole('button', { name: 'Search Icon' })
    fireEvent.click(searchButton)

    expect(onSubmitMock).toHaveBeenCalled()
  })
})

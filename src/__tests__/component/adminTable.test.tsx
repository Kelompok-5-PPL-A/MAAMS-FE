import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import AdminTable from '../../components/adminTable'
import { Item } from 'components/types/adminTable'

describe('AdminTable', () => {
  it('renders table headers correctly', () => {
    const data: Item[] = []
    const { getByText } = render(<AdminTable data={data} />)

    expect(getByText('Judul')).toBeInTheDocument()
    expect(getByText('Pengguna')).toBeInTheDocument()
    expect(getByText('Topik')).toBeInTheDocument()
    expect(getByText('Waktu')).toBeInTheDocument()
    expect(getByText('Lihat')).toBeInTheDocument()
  })

  it('renders table rows with data correctly', () => {
    const data: Item[] = [
      { id: '1', title: 'Title 1', user: 'User 1', timestamp: '2024-04-23' },
      { id: '2', title: 'Title 2', user: 'User 2', timestamp: '2024-04-24' }
    ]
    const { getByText } = render(<AdminTable data={data} />)

    expect(getByText('Title 1')).toBeInTheDocument()
    expect(getByText('User 1')).toBeInTheDocument()
    expect(getByText('Title 2')).toBeInTheDocument()
    expect(getByText('User 2')).toBeInTheDocument()
  })

  it('renders correctly when provided with empty data', () => {
    const data: Item[] = []
    const { getByText } = render(<AdminTable data={data} />)

    expect(getByText('Judul')).toBeInTheDocument()
    expect(getByText('Pengguna')).toBeInTheDocument()
    expect(getByText('Topik')).toBeInTheDocument()
    expect(getByText('Waktu')).toBeInTheDocument()
    expect(getByText('Lihat')).toBeInTheDocument()
  })

  // Add more negative test cases as needed
})

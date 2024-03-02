import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Row } from '../../components/row'

describe('Row Component', () => {
  test('renders correctly with the given number of columns', () => {
    const rowNumber = '1'
    const cols = 3

    const { getByTestId, getAllByTestId } = render(<Row rowNumber={rowNumber} cols={cols} />)

    expect(getByTestId('row-container')).toHaveClass(`grid-cols-${cols}`)
    expect(getAllByTestId('cell')).toHaveLength(cols)
  })

  test('does not render with an invalid number of columns', () => {
    const rowNumber = '1'
    const cols = 6

    const { queryByTestId } = render(<Row rowNumber={rowNumber} cols={cols} />)

    expect(queryByTestId('row-container')).toBeNull()
  })
})

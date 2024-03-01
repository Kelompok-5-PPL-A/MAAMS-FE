import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Row } from '../../components/row'

describe('Row Component', () => {
  // Positive Test: Renders correctly with the given number of columns
  test('renders correctly with the given number of columns', () => {
    const rowNumber = '1'
    const cols = 3

    const { getByTestId, getAllByTestId } = render(<Row rowNumber={rowNumber} cols={cols} />)

    // Check if the component renders with the correct number of columns
    expect(getByTestId('row-container')).toHaveClass(`grid-cols-${cols}`)
    expect(getAllByTestId('cell')).toHaveLength(cols)
  })

  // Negative Test: Does not render with an invalid number of columns
  test('does not render with an invalid number of columns', () => {
    const rowNumber = '1'
    const cols = 6

    const { queryByTestId } = render(<Row rowNumber={rowNumber} cols={cols} />)

    // Check if the component does not render with an invalid number of columns
    expect(queryByTestId('row-container')).toBeNull()
  })
})

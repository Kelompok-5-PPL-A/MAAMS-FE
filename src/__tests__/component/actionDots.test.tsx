import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ActionDots from '../../components/actionDots'

describe('ActionDots component', () => {
  test('renders without crashing', () => {
    render(<ActionDots onClick={() => {}} />)
  })

  test('calls onClick handler when clicked', () => {
    const onClickMock = jest.fn()
    const { getByTestId } = render(<ActionDots onClick={onClickMock} />)
    const actionDotsSvg = getByTestId('action-dots-svg')

    fireEvent.click(actionDotsSvg)

    expect(onClickMock).toHaveBeenCalledTimes(1)
  })
})

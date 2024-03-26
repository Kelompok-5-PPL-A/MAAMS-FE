import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { DeleteButton } from '../../components/deleteButton'

describe('DeleteButton', () => {
  const onClickDeleteMock = jest.fn()
  const idQuestion = 'exampleId'

  it('should render without errors', () => {
    render(<DeleteButton idQuestion={idQuestion} setIdQuestion={() => {}} onClickDelete={onClickDeleteMock} />)
  })

  it('should open dropdown menu on button click', () => {
    const { getByTestId } = render(
      <DeleteButton idQuestion={idQuestion} setIdQuestion={() => {}} onClickDelete={onClickDeleteMock} />
    )

    const toggleButton = getByTestId('toggle-open-button')
    fireEvent.click(toggleButton)

    const deleteAnalysis = getByTestId('delete-button')
    expect(deleteAnalysis).toBeInTheDocument
  })

  it('should close dropdown when clicked outside', () => {
    const { getByTestId } = render(
      <DeleteButton idQuestion={idQuestion} setIdQuestion={() => {}} onClickDelete={onClickDeleteMock} />
    )

    const toggleButton = getByTestId('toggle-open-button')
    fireEvent.click(toggleButton)
    const deleteAnalysis = getByTestId('delete-button')

    fireEvent.mouseDown(document.body)
    expect(deleteAnalysis).not.toBeInTheDocument
  })

  it('should call onClickDelete when delete button is clicked', () => {
    const { getByTestId } = render(
      <DeleteButton idQuestion={idQuestion} setIdQuestion={() => {}} onClickDelete={onClickDeleteMock} />
    )

    const toggleButton = getByTestId('toggle-open-button')
    fireEvent.click(toggleButton)

    const deleteButton = getByTestId('delete-button')
    fireEvent.click(deleteButton)

    expect(onClickDeleteMock).toHaveBeenCalled()
  })
})

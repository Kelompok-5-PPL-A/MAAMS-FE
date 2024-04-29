import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ValidatorAdminHeader } from '../../components/validatorAdminHeader'
import Mode from '../../constants/mode'
import '@testing-library/jest-dom'

const validatorData = {
  title: 'Sample Title',
  question: 'Sample question',
  mode: Mode.pribadi,
  username: 'JohnDoe',
  created_at: '2022-04-27'
}

describe('ValidatorAdminHeader component', () => {
  it('renders with correct username and question', () => {
    const { getByText, getByRole } = render(<ValidatorAdminHeader id={'123'} validatorData={validatorData} />)
    const inputElement = getByRole('textbox') as HTMLInputElement

    expect(getByText(`Analisis ${validatorData.username}`)).toBeInTheDocument
    expect(inputElement.getAttribute('value')).toBe(validatorData.question)
  })

  it('displays disabled input field with correct value', () => {
    const { getByRole } = render(<ValidatorAdminHeader id={'123'} validatorData={validatorData} />)

    const inputElement = getByRole('textbox') as HTMLInputElement
    expect(inputElement.getAttribute('value')).toBe(validatorData.question)
    expect(inputElement).toBeDisabled
  })

  it('question state is disabled to be changed', () => {
    const { getByRole } = render(<ValidatorAdminHeader id={'123'} validatorData={validatorData} />)

    const inputElement = getByRole('textbox') as HTMLInputElement
    fireEvent.change(inputElement, { target: { value: 'New question' } })

    expect(inputElement.getAttribute('value')).toBe(validatorData.question)
  })

  it('should update the question state when input changes', () => {
    const { getByRole } = render(
      <ValidatorAdminHeader
        validatorData={{
          username: 'TestUser',
          question: 'Question test',
          created_at: '',
          mode: Mode.pengawasan,
          title: ''
        }}
      />
    )

    const questionInput = getByRole('textbox')
    fireEvent.change(questionInput, { target: { value: 'New question' } })

    expect(questionInput).toHaveValue('New question')
  })
})

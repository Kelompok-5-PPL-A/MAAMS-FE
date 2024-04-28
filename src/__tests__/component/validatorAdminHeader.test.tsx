import React from 'react'
import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'
import { ValidatorAdminHeader } from '../../components/validatorAdminHeader'
import Mode from '../../constants/mode'

describe('ValidatorAdminHeader', () => {
  const validatorData = {
    username: 'Test',
    question: 'Question test',
    created_at: '',
    mode: Mode.pengawasan,
    title: ''
  }

  it('should render the question input as disabled if id is provided', () => {
    const { getByRole } = render(<ValidatorAdminHeader id='Id' validatorData={validatorData} />)

    const questionInput = getByRole('textbox')
    expect(questionInput).toBeDisabled()
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

  it('should render with default values when validatorData is not provided', () => {
    const { getByRole } = render(<ValidatorAdminHeader />)

    const questionInput = getByRole('textbox')
    expect(questionInput).toHaveValue('')
  })
})

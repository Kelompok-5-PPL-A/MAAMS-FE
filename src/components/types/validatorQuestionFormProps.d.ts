export interface ValidatorQuestionFormProps {
  id?: string
  validatorData?: ValidatorData
}

export interface ValidatorData {
  question: string
  mode: Mode
  username: string
  created_at: string
}

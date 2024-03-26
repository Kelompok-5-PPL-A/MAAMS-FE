import { Dispatch } from 'react'

export interface DeleteButtonProps {
  idQuestion: string | string[]
  setIdQuestion: Dispatch<any>
  onClickDelete: () => void
}

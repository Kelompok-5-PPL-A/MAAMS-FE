import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { DeleteButtonProps } from 'components/types/deleteButtonProps'

export const DeleteButton = ({ idQuestion, setIdQuestion, onClickDelete }: DeleteButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef(null)

  useEffect(() => {
    setIsOpen(false)
  }, [])

  useOnClickOutside(ref, () => {
    setIsOpen(false)
  })

  const handleDeleteButton = () => {
    setIdQuestion(idQuestion)
    onClickDelete()
  }

  return <div onClick={handleDeleteButton}>{isOpen}</div>
}

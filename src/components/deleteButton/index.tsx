import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { HiDotsVertical, HiTrash } from 'react-icons/hi'
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

  return (
    <div className='relative' ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`cursor-pointer ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'} px-4 py-2 text-md font-bold flex items-center justify-between`}
      >
        <button className='w-fit h-fit' type='button' data-testid='toggle-open-button'>
          <HiDotsVertical className='w-4 h-4' />
        </button>
        {isOpen && (
          <div
            className='absolute w-[200px] rounded-xl top-8 right-0 mt-2 w-56 bg-slate-100 shadow-lg text-red'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            <div className='py-1'>
              <button
                onClick={handleDeleteButton}
                className='block px-4 py-4 text-sm cursor-pointer justify-center items-center w-full'
                data-testid='delete-button'
              >
                <div className='text-red-600 flex flex-row gap-2 justify-center items-center'>
                  <HiTrash className='w-6 h-6' />
                  <p>Hapus analisis</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import React from 'react'
import { ItemListHistoryProps } from '../types/itemListHistory'
import ModeButton from '../modeButton/index'
import { DeleteButton } from '../../components/deleteButton'
import Link from 'next/link'

const ListItem: React.FC<ItemListHistoryProps & { showModeButton?: boolean }> = ({
  title,
  timestamp,
  mode,
  user,
  idQuestion,
  showModeButton = true,
  showDeleteButton
}) => {
  return (
    <li className='flex justify-between border border-yellow-300 rounded-xl shadow-lg p-6 mb-4'>
      <Link href={`/validator/${idQuestion}`} className='z-0 relative w-full h-full'>
        <div className='min-w-0 gap-y-2'>
          <p className='text-sm font-semibold leading-6 text-gray-900'>{title}</p>
          {showModeButton ? <ModeButton mode={mode} /> : <p className='text-sm leading-6 text-gray-500 mt-6'>{user}</p>}
        </div>
      </Link>
      <div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end z-10 justify-end'>
        {showDeleteButton && <DeleteButton idQuestion={idQuestion} />}
        <p className='text-sm leading-6 text-gray-500 mt-4 '>{timestamp}</p>
      </div>
    </li>
  )
}

export default ListItem

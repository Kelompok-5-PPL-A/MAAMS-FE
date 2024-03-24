import React from 'react'
import ActionDots from '../actionDots/index'
import { ItemListHistoryProps } from '../types/itemListHistory'
import ModeButton from '../modeButton/index'
import { useRouter } from 'next/router'

const ListItem: React.FC<ItemListHistoryProps> = ({ title, timestamp, mode }) => {
  const router = useRouter()
  const handleDotsClick = () => {
    console.log('Action dots clicked!')
    router.push('/history')
  }

  return (
    <li className='flex justify-between border border-yellow-300 rounded-xl shadow-lg p-3 mb-4'>
      <div className='min-w-0 gap-y-2'>
        <p className='text-sm font-semibold leading-6 text-gray-900'>{title}</p>
        <ModeButton mode={mode} />
      </div>
      <div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
        <ActionDots onClick={handleDotsClick} data-testid='action-dots-svg' />
        <p className='text-sm leading-6 text-gray-500 mt-4'>{timestamp}</p>
      </div>
    </li>
  )
}

export default ListItem

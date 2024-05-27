import { ActionDotsProps } from 'components/types/actionDots'
import React from 'react'

const ActionDots: React.FC<ActionDotsProps> = ({ onClick }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={32}
      height={32}
      viewBox='0 0 24 24'
      onClick={onClick}
      data-testid='action-dots-svg'
      className='transform hover:scale-110 transition-transform duration-200 ease-in-out hover:bg-gray-100 rounded-full'
    >
      <path fill='none' stroke='currentColor' strokeLinecap='round' strokeWidth={3} d='M12 6h0m0 6h0m0 6h0' />
    </svg>
  )
}

export default ActionDots

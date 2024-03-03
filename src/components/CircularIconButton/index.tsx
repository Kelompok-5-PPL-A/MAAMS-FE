import { Button } from '@chakra-ui/react'
import React from 'react'
import { CircularIconButtonProps } from '../types/circularIconButtonProps'

export const CircularIconButton: React.FC<CircularIconButtonProps> = ({ icon, onClick, type }) => {
  return (
    <div className='w-[52px] h-[52px] bg-yellow-400 rounded-full flex justify-center items-center'>
      <Button type={type} borderRadius='full' bg='transparent' color='black' onClick={onClick}>
        {icon}
      </Button>
    </div>
  )
}

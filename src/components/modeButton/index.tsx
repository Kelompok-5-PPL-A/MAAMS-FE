import { ModeButtonProps } from 'components/types/modeButton'
import React from 'react'

const ModeButton: React.FC<ModeButtonProps> = ({ mode }) => {
  return <button className='mt-4 bg-[#FBC707] text-black px-3 py-1 rounded-xl text-xs font-bold'>{mode}</button>
}

export default ModeButton

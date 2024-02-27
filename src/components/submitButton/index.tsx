import React from 'react'

interface SubmitButtonProps {
  onClick: () => void
  disabled: boolean
  label: string
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, disabled, label }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        mt-4 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md 
        transition duration-150 ease-in-out 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-yellow-600'} 
        active:scale-95 transform`}
    >
      {label}
    </button>
  )
}

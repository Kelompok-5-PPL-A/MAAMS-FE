import React from 'react'

interface SubmitButtonProps {
  onClick: () => void
  disabled: boolean
  label: string
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, disabled, label }) => {
  // Determine button style based on `disabled` state
  const buttonStyle = disabled ? 'disabledButtonStyle' : 'enabledButtonStyle'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mt-4 text-white font-semibold rounded-md transition duration-150 ease-in-out active:scale-95 transform buttonCommonStyle ${buttonStyle}`}
    >
      {label}
    </button>
  )
}

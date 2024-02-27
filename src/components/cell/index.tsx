import React from 'react'
import { CauseStatus } from 'lib/enum' // Adjust the import path as necessary

interface CellProps {
  cellName: string
  cause: string
  onChange: (value: string) => void
  causeStatus: CauseStatus
  disabled: boolean
  placeholder: string
}
export const Cell: React.FC<CellProps> = ({
  cellName,
  cause,
  onChange,
  causeStatus,
  disabled = false,
  placeholder
}) => {
  const getOutlineClass = (status: CauseStatus) => {
    switch (status) {
      case CauseStatus.Incorrect:
        return 'border-2 border-red-500'
      case CauseStatus.CorrectNotRoot:
        return 'border-2 border-green-500'
      case CauseStatus.CorrectRoot:
        return 'border-2 border-purple-500'
      case CauseStatus.Unchecked:
      default:
        return 'border-2 border-black'
    }
  }

  const outlineClass = getOutlineClass(causeStatus)

  return (
    <div className='flex flex-col items-center justify-center relative'>
      <div className='relative w-full mt-[-1px] font-bold text-black text-2xl leading-10 mb-2 whitespace-nowrap'>
        {cellName}
      </div>
      <textarea
        value={cause}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        maxLength={148}
        className={`w-full text-xs resize-none items-center bg-[#ececec] border-solid border ${outlineClass} relative z-[1] my-2 py-2 px-4`}
        placeholder={placeholder}
        disabled={disabled}
      ></textarea>
    </div>
  )
}

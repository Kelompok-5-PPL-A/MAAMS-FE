import React from 'react'
import { CauseStatus } from '../../lib/enum'

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
        return 'border-red-500'
      case CauseStatus.CorrectNotRoot:
        return 'border-green-500'
      case CauseStatus.CorrectRoot:
        return 'border-purple-500'
      case CauseStatus.Unchecked:
      default:
        return 'border-black'
    }
  }

  const outlineClass = getOutlineClass(causeStatus)

  return (
    <div className='flex flex-col items-center justify-center relative'>
      <div className='relative w-fit mt-[-1.00px] font-bold text-black text-2xl leading-10 mb-2 whitespace-nowrap'>
        {cellName}
      </div>
      <textarea
        value={cause}
        onChange={(event) => onChange(event.target.value)}
        rows={1}
        maxLength={148}
        className={`w-full h-22 text-xs resize-none flex pt-4 px-4 pb-16 items-center bg-[#ececec] border-solid border ${outlineClass} relative z-[1]`}
        placeholder={placeholder}
        disabled={disabled}
      ></textarea>
    </div>
  )
}

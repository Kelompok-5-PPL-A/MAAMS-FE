import React from 'react'

interface CellProps {
  cellName: string
  cause: string
  onChange: (value: string) => void
}

export const Cell: React.FC<CellProps> = ({ cellName, cause, onChange }) => {
  return (
    <div className='flex flex-col items-center justify-center relative'>
      <div className='relative w-fit mt-[-1.00px] font-bold text-black text-2xl leading-10 mb-2 whitespace-nowrap'>
        {cellName}
      </div>
      <textarea
        value={cause}
        onChange={(e) => onChange(e.target.value)}
        rows={1}
        maxLength={148}
        className='w-full h-22 text-xs resize-none flex pt-4 px-4 pb-16 items-center bg-[#ececec] border-solid border border-[#000] relative z-[1]'
        placeholder='Isi sebab...'
      ></textarea>
    </div>
  )
}

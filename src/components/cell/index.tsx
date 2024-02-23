import React from 'react'

interface CellProps {
  cellName: string
  cause: string
  cols: number
  onChange: (value: string) => void
}

export const Cell: React.FC<CellProps> = ({ cellName, cause, cols, onChange }) => {
  const calculatedWidth = `w-${Math.floor(100 / cols)}/12`

  return (
    <div className='flex flex-col items-center justify-center relative'>
      <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins-Bold',Helvetica] font-bold text-[#020000] text-[24px] tracking-[0] leading-[55.0px] whitespace-nowrap">
        {cellName}
      </div>
      <textarea
        value={cause}
        onChange={(e) => onChange(e.target.value)}
        rows={1}
        className={`${calculatedWidth} flex pt-[16px] pr-[16px] pb-[64px] pl-[16px] items-center basis-0 flex-nowrap bg-[#ececec] border-solid border border-[#000] relative z-[1]`}
        placeholder='Isi sebab...'
      ></textarea>
    </div>
  )
}

import React from 'react'

interface CounterButtonProps {
  number: number
  onIncrement: () => void
  onDecrement: () => void
}

export const CounterButton: React.FC<CounterButtonProps> = ({ number, onIncrement, onDecrement }) => {
  return (
    <div className='items-center'>
      <h2 className='text-[14px] font-bold leading-[21px] text-[#000] relative mx-auto my-0'>Jumlah Kolom (Max 5)</h2>
      <div className='main-container flex justify-center items-center flex-nowrap relative mx-auto my-0'>
        <button
          onClick={onDecrement}
          className='flex w-[78px] h-[40px] pt-[8px] pr-[32px] pb-[8px] pl-[32px] justify-center items-center shrink-0 flex-nowrap rounded-tl-[10px] rounded-tr-none rounded-br-none rounded-bl-[10px] border-solid border border-[#dab011] relative'
        >
          <span className='h-[36px] shrink-0 basis-auto text-[24px] font-bold leading-[36px] text-[#dab011] relative text-left whitespace-nowrap z-[1]'>
            -
          </span>
        </button>
        <div className='flex w-[73px] h-[40px] pt-[8px] pr-[32px] pb-[8px] pl-[32px] justify-center items-center shrink-0 flex-nowrap bg-[#fbc707] relative z-[2]'>
          <span className='h-[21px] shrink-0 basis-auto text-[14px] font-bold leading-[21px] text-[#000] relative text-left whitespace-nowrap z-[3]'>
            {number}
          </span>
        </div>
        <button
          onClick={onIncrement}
          className='flex w-[80px] h-[40px] pt-[8px] pr-[32px] pb-[8px] pl-[32px] justify-center items-center shrink-0 flex-nowrap rounded-tl-none rounded-tr-[10px] rounded-br-[10px] rounded-bl-none border-solid border border-[#fbc707] relative z-[4]'
        >
          <span className='h-[36px] shrink-0 basis-auto text-[24px] font-bold leading-[36px] text-[#fbc707] relative text-left whitespace-nowrap z-[5]'>
            +
          </span>
        </button>
      </div>
    </div>
  )
}

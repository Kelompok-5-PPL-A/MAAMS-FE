import React from 'react'

interface SearchBarProps {
  keyword: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ keyword, onChange, onSubmit }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className='mx-12 max-md:flex-wrap max-md:px-5'>
      <div className='flex gap-0 self-stretch shadow-lg rounded-[10px]'>
        <input
          className='w-full p-4 text-base bg-white rounded-tl-[10px] rounded-tr-none 
                rounded-br-none rounded-bl-[10px] border border-yellow-400 border-solid text-slate-400 max-md:max-w-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400'
          style={{ color: 'black' }}
          type='text'
          placeholder='Cari analisis...'
          value={keyword}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={onSubmit}
          className='flex justify-center items-center px-4 py-3.5 bg-yellow-400 rounded-tl-none rounded-tr-[10px] rounded-br-[10px] rounded-bl-none border border-yellow-400 border-solid'
        >
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/8175883398446009fa87a890bfdf85c1492a6223a2e4d833b9641dbb494df310?'
            className='w-6 aspect-square'
            alt='Search Icon'
          />
        </button>
      </div>
    </div>
  )
}

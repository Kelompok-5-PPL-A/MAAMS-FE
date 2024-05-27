import React from 'react'
import dynamic from 'next/dynamic'

interface SearchFilterProps {
  isAdmin: boolean
  updateFilter: (filter: string) => void
  publicAnalyses: boolean
}

const NoSSRSearchFilter: React.FC<SearchFilterProps> = ({ isAdmin, updateFilter, publicAnalyses }) => {
  const filterValues = ['Semua', 'Pengguna', 'Judul', 'Topik']

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value
    // Call the update function passed down from the parent component
    updateFilter(newFilter)
  }

  return (
    <div className='max-md:flex-wrap'>
      <div className='h-full flex gap-0 self-stretch shadow-lg rounded-tl-[10px] bg-yellow-400 rounded-bl-[10px]'>
        <select
          data-testid='filter-select'
          role='combobox'
          className='rounded-bl-[10px] rounded-tl-[10px] px-4 py-3.5 flex bg-inherit justify-center items-center mr-3'
          onChange={handleChange}
        >
          {/* only allow filtering by user names if logged in user is an admin */}
          {filterValues.map((value, index) => {
            if (value == 'Pengguna') {
              if (!isAdmin || !publicAnalyses) {
                return null
              }
            }
            return (
              <option className='bg-white' key={index} value={value}>
                {value}
              </option>
            )
          })}
        </select>
      </div>
      <div data-testid='suggestion-list'></div>
    </div>
  )
}

// export with server side rendering/prerendering disabled, preventing client and server mismatch
const SearchFilter = dynamic(() => Promise.resolve(NoSSRSearchFilter), {
  ssr: false
})

export default SearchFilter

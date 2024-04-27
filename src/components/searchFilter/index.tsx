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
    <div className=' max-md:flex-wrap max-md:px-5'>
      <div className='flex gap-0 self-stretch shadow-lg rounded-[10px]'>
        <select
          role='combobox'
          className='rounded-bl-[10px] rounded-tl-[10px] px-4 py-3.5 bg-yellow-400 flex justify-center items-center'
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
              <option key={index} value={value}>
                {value}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

// export with server side rendering/prerendering disabled, preventing client and server mismatch
const SearchFilter = dynamic(() => Promise.resolve(NoSSRSearchFilter), {
  ssr: false
})

export default SearchFilter

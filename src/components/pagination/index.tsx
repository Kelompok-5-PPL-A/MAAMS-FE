import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const renderPageButtons = () => {
    const buttons = []
    let maxButtonsToShow = 2
    const showElipsis = totalPages >= 5

    if (showElipsis && totalPages - currentPage <= 3) {
      maxButtonsToShow = 3
    }

    // max range button display
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2))
    const endPage = Math.min(totalPages - 2, startPage + maxButtonsToShow - 1)

    //  set startPage dan endPage ketika page ga cukup
    if (endPage - startPage < maxButtonsToShow - 1) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1)
    }
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          type='button'
          className={`min-h-[38px] min-w-[38px] flex justify-center items-center ${
            i === currentPage
              ? ' text-black-800 font-bold border-2 border-[#FBC707] bg-gray-200'
              : 'text-gray-800 bg-gray-200 hover:bg-gray-400 focus:bg-gray-300'
          } py-2 px-3 text-sm rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg font-bold`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      )
    }

    if (showElipsis && currentPage + maxButtonsToShow < totalPages) {
      buttons.push(
        <button
          key='ellipsis'
          type='button'
          className='min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none bg-gray-200 font-bold hover:bg-gray-400 focus:bg-gray-300'
          onClick={() => onPageChange(currentPage + 1)}
          data-testid='ellipsis-button'
        >
          ...
        </button>
      )
    }

    buttons.push(
      <button
        key={totalPages - 1}
        type='button'
        className={`min-h-[38px] min-w-[38px] flex justify-center items-center ${
          totalPages - 1 === currentPage
            ? 'bg-gray-100 text-black-800 font-bold border-[#FBC707] border-2'
            : 'text-gray-800 bg-gray-200 hover:bg-gray-400 focus:bg-gray-300'
        } py-2 px-3 text-sm rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg font-bold`}
        onClick={() => onPageChange(totalPages - 1)}
      >
        {totalPages - 1}
      </button>
    )
    buttons.push(
      <button
        key={totalPages}
        type='button'
        className={`min-h-[38px] min-w-[38px] flex justify-center items-center ${
          totalPages === currentPage
            ? 'bg-gray-100 text-black-800 font-bold border-[#FBC707] border-2'
            : 'text-gray-800 bg-gray-200 hover:bg-gray-400 focus:bg-gray-300'
        } py-2 px-3 text-sm rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg font-bold`}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>
    )

    return buttons
  }

  return (
    <nav className='flex justify-center items-center gap-x-7'>
      <button
        type='button'
        className={`min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 focus:outline-none ${
          currentPage === 1 ? 'bg-gray-200' : 'bg-[#FBC707]'
        }`}
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        aria-label='Previous'
      >
        <svg
          className='flex-shrink-0 size-6'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='m15 18-6-6 6-6' />
        </svg>
        <span aria-hidden='true' className='sr-only'>
          Previous
        </span>
      </button>
      <div className='flex items-center gap-x-7'>{renderPageButtons()}</div>
      <button
        type='button'
        className={`min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 focus:outline-none ${
          currentPage === totalPages ? 'bg-gray-200' : 'bg-[#FBC707]'
        }`}
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        aria-label='Next'
      >
        <span aria-hidden='true' className='sr-only'>
          Next
        </span>
        <svg
          className='flex-shrink-0 size-6'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='m9 18 6-6-6-6' />
        </svg>
      </button>
    </nav>
  )
}

export default Pagination

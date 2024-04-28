import { PaginationProps } from 'components/types/pagination'
import React, { useState, useEffect, useRef } from 'react'

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const [inputMode, setInputMode] = useState(false)
  const [pageNumber, setPageNumber] = useState(currentPage)
  const inputRef = useRef<HTMLInputElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (inputMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputMode])

  const handleEllipsisClick = () => {
    setInputMode(true)
    setHovered(false)
  }

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value
    const pageNum = parseInt(inputVal, 10)
    if (inputVal === '' || (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages)) {
      setPageNumber(pageNum)
    }
  }

  const submitPageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      !isNaN(pageNumber) &&
      pageNumber !== currentPage &&
      pageNumber >= 1 &&
      pageNumber <= totalPages
    ) {
      onPageChange(pageNumber)
      setInputMode(false)
    }
  }

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
    const showEllipsis = totalPages >= 5

    if (totalPages === 1) {
      buttons.push(
        <button
          key={1}
          type='button'
          className={`min-h-[38px] min-w-[38px] flex justify-center items-center ${
            1 === currentPage
              ? ' text-black-800 font-bold border-2 border-[#FBC707] bg-gray-200'
              : 'text-gray-800 bg-gray-200 hover:bg-gray-400 focus:bg-gray-300'
          } py-2 px-3 text-sm rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg font-bold`}
          onClick={() => onPageChange(1)}
        >
          {1}
        </button>
      )
    } else {
      let maxButtonsToShow = 2

      if (showEllipsis && totalPages - currentPage <= 3) {
        maxButtonsToShow = 3
      }

      let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2))
      const endPage = Math.min(totalPages - 2, startPage + maxButtonsToShow - 1)
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
                ? 'text-black-800 font-bold border-2 border-[#FBC707] bg-white'
                : 'text-gray-800 bg-gray-200 hover:bg-gray-400 focus:bg-gray-300'
            } py-2 px-3 text-sm rounded-lg focus:outline-none`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        )
      }

      if (showEllipsis && currentPage + maxButtonsToShow < totalPages) {
        buttons.push(
          inputMode ? (
            <input
              key='ellipsis-input'
              type='number'
              ref={inputRef}
              value={pageNumber}
              onChange={handlePageInput}
              onKeyDown={submitPageInput}
              onBlur={() => setInputMode(false)}
              className='min-h-[38px] min-w-[38px] max-w-[100px] flex justify-center items-center text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none bg-gray-200 border-2 border-[#FBC707] focus:bg-white'
              autoFocus
            />
          ) : (
            <button
              key='ellipsis'
              type='button'
              className={`min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none bg-gray-200 font-bold ${
                hovered ? 'hover:bg-gray-400' : ''
              } ${hovered ? 'focus:bg-gray-300' : ''}`}
              onClick={handleEllipsisClick}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              data-testid='ellipsis-button'
            >
              ...
            </button>
          )
        )
      }

      for (let i = Math.max(totalPages - 1, endPage + 1); i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            type='button'
            className={`min-h-[38px] min-w-[38px] flex justify-center items-center ${
              i === currentPage
                ? 'text-black-800 font-bold border-2 border-[#FBC707] bg-white'
                : 'text-gray-800 bg-gray-200 hover:bg-gray-400 focus:bg-gray-300'
            } py-2 px-3 text-sm rounded-lg focus:outline-none`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        )
      }
    }

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
        <span aria-hidden='true' className='sr-only'>
          Next
        </span>
      </button>
    </nav>
  )
}

export default Pagination

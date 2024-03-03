import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { logout } from '../../actions/auth'
import toast from 'react-hot-toast'

const Navbar = () => {
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const refresh_token = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(refresh_token === 'true')
    console.log(localStorage.getItem('userData'))
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const logoutUser = async () => {
    const refresh_token = localStorage.getItem('refresh')
    if (refresh_token === null) {
      router.push('/login')
    } else {
      logout(refresh_token!)
        .then(() => {
          localStorage.clear()
          axios.defaults.headers.common['Authorization'] = null
          toast.success('Logout successful', {
            style: {
              fontSize: '1rem',
              backgroundColor: '#4CAF50',
              color: '#FFFFFF',
              border: '2px solid #388E3C',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)'
            },
            className: 'unique-toast'
          })
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        })
        .catch((err) => {
          console.error('Error logging out:', err)
        })
    }
  }

  return (
    <nav className='bg-[#FBC707] border-b-2 border-gray-200'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <a href='/' className='flex items-center space-x-3 rtl:space-x-reverse'>
          <img src='/icons/maams.svg' className='h-8' alt='MAAMS Logo' />
        </a>
        {isLoggedIn ? (
          <>
            <button
              onClick={toggleMenu}
              type='button'
              className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200'
              aria-controls='navbar-dropdown'
              aria-expanded={isMenuOpen ? 'true' : 'false'}
            >
              <svg
                className={`w-5 h-5 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 17 14'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M1 1h15M1 7h15M1 13h15'
                />
              </svg>
            </button>
            <div className={`w-full md:flex md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`} id='navbar-dropdown'>
              <ul className='flex flex-col font-bold md:items-center md:justify-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-[#FBC707]'>
                <li>
                  <a
                    href='#'
                    className='block py-2 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0'
                  >
                    Riwayat
                  </a>
                </li>
                <li className='relative'>
                  <button
                    onClick={toggleDropdown}
                    id='dropdownNavbarLink'
                    className='flex md:items-center justify-between w-full py-2 md:px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 md:w-auto '
                  >
                    Username
                    <svg
                      className='w-2.5 h-2.5 ms-2.5'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 10 6'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 1 4 4 4-4'
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div
                      id='dropdownNavbar'
                      className='absolute left-0 z-10 mt-2 w-44 font-semibold bg-white divide-y divide-gray-100 rounded-lg shadow '
                    >
                      <ul className='py-2 text-sm text-black'>
                        <li>
                          <a href='#' className='block px-4 py-2 hover:bg-gray-100'>
                            Edit Profile
                          </a>
                        </li>
                      </ul>
                      <div className='py-1' onClick={logoutUser}>
                        <a href='#' className='block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 '>
                          Sign out
                        </a>
                      </div>
                    </div>
                  )}
                </li>
                <li>
                  <a
                    href='/validator'
                    className='md:flex md:gap-2 md:items-center md:justify-center block py-2 bg-white text-gray-900 md:hover:bg-gray-100 md:border-0 md:p-2 md:rounded-xl'
                  >
                    Tambahkan Analisis
                    <div className='hidden md:flex bg-[#FBC707] rounded-full px-2'>+</div>
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={toggleMenu}
              type='button'
              className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200'
              aria-controls='navbar-dropdown'
              aria-expanded={isMenuOpen ? 'true' : 'false'}
            >
              <svg
                className={`w-5 h-5 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 17 14'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M1 1h15M1 7h15M1 13h15'
                />
              </svg>
            </button>
            <div className={`w-full md:flex md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`} id='navbar-dropdown'>
              <ul className='flex flex-col font-bold md:items-center md:justify-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-[#FBC707]'>
                <li className='w-full md:flex md:w-auto md:items-center md:justify-end'>
                  <a
                    href='/login'
                    className='md:flex md:gap-2 md:items-center md:justify-center block py-2 bg-white text-gray-900 md:hover:bg-gray-100 md:border-0 md:px-12 md:py-2 md:rounded-xl'
                  >
                    Login
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar

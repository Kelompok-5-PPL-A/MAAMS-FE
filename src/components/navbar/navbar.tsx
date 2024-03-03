import React, { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { logout } from '../../actions/auth'

const Navbar = () => {
  const router = useRouter()
  const [logoutMessage, setLogoutMessage] = useState('')

  const logoutUser = async () => {
    const refresh_token = localStorage.getItem('refresh')
    if (refresh_token === null) {
      router.push('/login')
    } else {
      logout(refresh_token!)
        .then(() => {
          localStorage.clear()
          axios.defaults.headers.common['Authorization'] = null
          setLogoutMessage('Logout berhasil.')
          setTimeout(() => {
            setLogoutMessage('')
            router.push('/login')
          }, 2000)
        })
        .catch((err) => {
          console.error('Error logging out:', err)
        })
    }
  }

  return (
    <div>
      <p>Navbar</p>
      <a href='/validator'>Tambahkan Analisis</a>
      <div>
        <a href='#' onClick={logoutUser}>
          logout
        </a>
        {logoutMessage && <p className='text-lg text-green-500 '>{logoutMessage}</p>}
      </div>
    </div>
  )
}

export default Navbar

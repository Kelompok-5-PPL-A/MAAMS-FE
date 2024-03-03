import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { logout } from '../../actions/auth'

const Navbar = () => {
  const router = useRouter()

  const logoutUser = async () => {
    const refresh_token = localStorage.getItem('refresh')
    if (refresh_token === null) {
      router.push('/login')
    } else {
      logout(refresh_token!)
        .then(() => {
          localStorage.clear()
          axios.defaults.headers.common['Authorization'] = null
          router.push('/login')
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
      </div>
    </div>
  )
}

export default Navbar

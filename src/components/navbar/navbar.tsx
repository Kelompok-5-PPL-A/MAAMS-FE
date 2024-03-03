import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { logout } from '../../actions/auth'
import toast from 'react-hot-toast'

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

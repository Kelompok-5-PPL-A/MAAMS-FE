import React, { useEffect, useState } from 'react'
import MainLayout from '../../layout/MainLayout'
import axios from 'axios'
import { UserDataProps } from 'components/types/userData'
import { logout, refreshToken } from '../../actions/auth'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

interface UserData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface ErrorMessage {
  response: {
    request: {
      responseText: string
    }
    status: number
  }
}

const Index: React.FC = () => {
  const router = useRouter()
  const [userDataDefault, setUserDataDefault] = useState<UserDataProps | null>(null)
  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const access = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const headers = {
    Authorization: `Bearer ${access}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  useEffect(() => {
    setUserDataDefault(JSON.parse(localStorage.getItem('userData')!))
  }, [])

  const handleSave = async () => {
    if (userData.password !== userData.confirmPassword) {
      toast.error('Mohon dicoba lagi, password yang dimasukan tidak cocok!')
      return
    }

    const userDataToSend = {} as typeof userData

    if (userData.username.trim() !== '') {
      userDataToSend.username = userData.username
    }
    if (userData.email.trim() !== '') {
      userDataToSend.email = userData.email
    }
    if (userData.password.trim() !== '') {
      userDataToSend.password = userData.password
    }

    if (Object.keys(userDataToSend).length === 0) {
      toast.error('Tidak ada data yang diubah!')
      return
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/update/`,
        userDataToSend,
        {
          withCredentials: false,
          headers: headers
        }
      )

      setUserDataDefault(response.data)

      localStorage.setItem('userData', JSON.stringify(response.data))

      setUserData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      })

      toast.success('Data berhasil disimpan!')
      window.location.reload()
    } catch (error) {
      if (refresh != null && (error as ErrorMessage).response && (error as ErrorMessage).response.status === 401) {
        logoutUser(refresh)
      } else {
        const err_data = JSON.parse((error as ErrorMessage)?.response.request.responseText)
        toast.error(err_data.case_error ? err_data.case_error : 'Terjadi kesalahan, mohon coba lagi!')
      }
    }
  }

  const logoutUser = async (refresh_token: string) => {
    try {
      const responseRefresh = await refreshToken(refresh_token)
      window.localStorage.setItem('access', responseRefresh.data.access)
      router.reload()
    } catch {
      toast.error('Sesi anda telah berakhir. Silakan login kembali')
      logout(refresh_token)
      localStorage.clear()
      router.push('/login')
    }
  }

  const handleCancel = () => {
    setUserData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    toast.success('Perubahan dibatalkan!')
  }

  return (
    <MainLayout>
      <div className='flex flex-col items-center'>
        <h1 className='text-center font-bold text-3xl mb-12'>Profil</h1>
        <div className='flex flex-col lg:flex-row lg:justify-center mt-4 w-full lg:gap-8'>
          <div className='lg:w-full lg:mb-0'>
            <div className='mb-3'>Username</div>
            <input
              type='text'
              name='username'
              value={userData.username}
              onChange={handleChange}
              placeholder={`${userDataDefault?.username}` !== 'undefined' ? `${userDataDefault?.username}` : `Username`}
              className='border border-black shadow-lg rounded-md px-6 py-3 mb-8 w-full'
            />
            <div className='mb-3'>Email</div>
            <input
              type='email'
              name='email'
              value={userData.email}
              onChange={handleChange}
              placeholder={`${userDataDefault?.email}` !== 'undefined' ? `${userDataDefault?.email}` : `Email`}
              className='border border-black shadow-lg rounded-md px-6 py-3 mb-8 w-full'
            />
          </div>
          <div className='lg:w-full'>
            <div className='mb-3'>Password</div>
            <input
              type='password'
              name='password'
              value={userData.password}
              onChange={handleChange}
              placeholder='Password baru'
              className='border border-black shadow-lg rounded-md px-6 py-3 mb-8 w-full'
            />
            <div className='mb-3'>Ulangi Password</div>
            <input
              type='password'
              name='confirmPassword'
              value={userData.confirmPassword}
              onChange={handleChange}
              placeholder='Ulangi password baru'
              className='border border-black shadow-lg rounded-md px-6 py-3 mb-8 w-full'
            />
          </div>
        </div>
        <div className='flex justify-center w-full gap-8 mt-4 flex-col lg:flex-row'>
          <button
            onClick={handleSave}
            className='bg-gradient-to-b from-yellow-400 to-yellow-600 text-xl text-white font-bold py-2 px-10 rounded-xl'
          >
            Simpan
          </button>

          <button
            onClick={handleCancel}
            className='bg-white text-yellow-400 border border-yellow-400 text-xl font-bold py-2 px-12 rounded-xl'
          >
            Batal
          </button>
        </div>
      </div>
    </MainLayout>
  )
}

export default Index

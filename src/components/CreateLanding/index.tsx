import { CustomInput } from '../../components/customInput'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import router from 'next/router'
import toast from 'react-hot-toast'
import axiosInstance from '../../services/axiosInstance'

const CreateLanding = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [question, setQuestion] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!question) {
      toast.error('Pertanyaan harus diisi')
      return
    }

    try {
      const { data } = await axiosInstance.post('/api/v1/validator/baru/', {
        mode: 'PRIBADI',
        question: question
      })
      router.push(`/validator/${data.id}`)
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.detail)
      } else {
        toast.error('Gagal menambahkan analisis')
      }
    }
  }

  useEffect(() => {
    const refresh_token = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(refresh_token === 'true')
  })

  return (
    <div className='flex flex-col lg:flex-row justify-between items-center gap-12 lg:mx-48'>
      <div className=''>
        <img src='/icons/landing-icon.svg' alt='landing' className='' />
      </div>
      <div className=''>
        {isLoggedIn ? (
          <div className='flex flex-col gap-8 mx-12'>
            <h1 className='text-3xl font-bold text-center'>Apa masalah yang ingin dianalisis hari ini?</h1>
            <div className='flex flex-row gap-2'>
              <form className='flex flex-row w-full gap-x-4 items-center justify-center' onSubmit={handleSubmit}>
                <CustomInput
                  inputClassName='p-6 text-sm'
                  placeholder='ingin menganalisis apa hari ini ...'
                  spacerClassName='space-y-0'
                  isDisabled={false}
                  onChange={(e) => setQuestion(e.target.value)}
                  value={question}
                />
                <button className='' title='submit_button'>
                  <img src='/icons/send-icon.svg' alt='search' className='bg-yellow-400 p-4 rounded-full' />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-4 lg:gap-12'>
            <h1 className='text-3xl font-bold text-center'>Belum Memiliki Akun?</h1>
            <Link href='/register'>
              <div className='bg-gradient-to-b from-yellow-400 to-yellow-600 py-3 px-6 text-white font-semibold rounded-xl'>
                Gabung Sekarang!
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateLanding

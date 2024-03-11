import { ValidatorQuestionFormProps } from '../types/validatorQuestionFormProps'
import Mode from '../../constants/mode'
import { DropdownMode } from '../dropdownMode'
import { CustomInput } from '../customInput'
import { CircularIconButton } from '../CircularIconButton'
import React, { useState } from 'react'
import { MdSend } from 'react-icons/md'
import { Icon } from '@chakra-ui/react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { refreshToken, logout } from '../../actions/auth'

export const ValidatorQuestionForm: React.FC<ValidatorQuestionFormProps> = ({ id, validatorData }) => {
  const [question, setQuestion] = useState<string>(validatorData?.question || '')
  const [mode, setMode] = useState<Mode | undefined>(validatorData?.mode || Mode.pribadi)
  const router = useRouter()
  const access = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const headers = {
    Authorization: `Bearer ${access}`
  }

  const handleModeChange = (mode: Mode) => {
    setMode(mode)
  }

  const handleModeChangeGet = () => {
    setMode(validatorData?.mode)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!question) {
      toast.error('Pertanyaan harus diisi')
      return
    }

    try {
      const { data } = await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/baru/`,
        data: {
          mode: mode,
          question: question
        },
        withCredentials: false,
        headers: headers
      })
      toast.success('Analisis berhasil ditambahkan', {
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
      router.push(`/validator/${data.id}`)
    } catch (error: any) {
      if (refresh != null && error.response.status == '401') {
        try {
          const responseRefresh = await refreshToken(refresh)
          window.localStorage.setItem('access', responseRefresh.data.access)
          toast.error('Sesi anda telah diperbaharui. Silakan coba lagi')
          router.reload()
        } catch {
          toast.error('Sesi anda telah berakhir. Silakan login kembali')
          logout(refresh)
          router.push('/login')
        }
      } else if (error.response.data.message) {
        toast.error(error.response.data.message)
      } else if (error.message) {
        toast.error(error.message)
      }
    }
  }

  return (
    <>
      <form className='flex flex-col w-full gap-8' onSubmit={handleSubmit}>
        {id ? (
          <>
            <DropdownMode selectedMode={validatorData?.mode} onChange={handleModeChangeGet} />

            <h1 className='text-2xl font-bold text-black'>Ingin menganalisis masalah apa hari ini?</h1>

            <div className='w-full'>
              <CustomInput
                inputClassName='flex-grow w-full p-4 bg-grey-200 rounded-[10px] shadow border border-zinc-500 justify-start items-center gap-4 inline-flex'
                placeholder='Isi pertanyaan anda di sini'
                value={validatorData?.question}
                isDisabled={true}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <DropdownMode selectedMode={mode} onChange={handleModeChange} />

            <h1 className='text-2xl font-bold text-black'>Ingin menganalisis masalah apa hari ini?</h1>

            <div className='w-full'>
              <div className='flex gap-4'>
                <CustomInput
                  inputClassName='flex-grow w-full p-4 bg-white rounded-[10px] shadow border border-zinc-500 justify-start items-center gap-4 inline-flex'
                  placeholder='Isi pertanyaan anda di sini'
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />

                <CircularIconButton icon={<Icon as={MdSend} />} type='submit' />
              </div>
            </div>
          </>
        )}
      </form>
    </>
  )
}

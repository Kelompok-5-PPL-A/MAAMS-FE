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

export const ValidatorQuestionForm: React.FC<ValidatorQuestionFormProps> = ({ id, validatorData }) => {
  const [question, setQuestion] = useState<string>(validatorData?.question || '')
  const [mode, setMode] = useState<Mode | undefined>(validatorData?.mode || Mode.pribadi)
  const router = useRouter()
  const accessToken = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const headers = {
    Authorization: `Bearer ${accessToken}`
  }

  const handleModeChange = (mode: Mode) => {
    setMode(mode)
    console.log(mode)
  }

  const handleModeChangeGet = () => {
    setMode(validatorData?.mode)
    console.log(validatorData?.mode)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
      console.log(question)
      toast.success('Analisis berhasil ditambahkan')
      router.push(`/validator/${data.id}`)
    } catch (error: any) {
      if (error.response.status == '400') {
        toast.error('Isi pertanyaan dengan benar')
      } else if (error.response.status == '401') {
        toast.error('silakan login kembali')
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

import { ValidatorQuestionFormProps } from '../types/validatorQuestionFormProps'
import Mode from '../../constants/mode'
import { DropdownMode } from '../dropdownMode'
import { CustomInput } from '../customInput'
import { CircularIconButton } from '../CircularIconButton'
import React, { useState } from 'react'
import { MdSend } from 'react-icons/md'
import { Icon } from '@chakra-ui/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { DeleteButton } from '../../components/deleteButton'
import axiosInstance from '../../services/axiosInstance'

export const ValidatorQuestionForm: React.FC<ValidatorQuestionFormProps> = ({ id, validatorData }) => {
  const [question, setQuestion] = useState<string>(validatorData?.question || '')
  const [mode, setMode] = useState<Mode | undefined>(validatorData?.mode || Mode.pribadi)
  const router = useRouter()

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
      const { data } = await axiosInstance.post('/api/v1/validator/baru/', {
        mode: mode,
        question: question
      })
      toast.success('Analisis berhasil ditambahkan')
      router.push(`/validator/${data.id}`)
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.detail)
      } else {
        toast.error('Gagal menambahkan analisis')
      }
    }
  }

  return (
    <>
      <form className='flex flex-col w-full gap-8' onSubmit={handleSubmit}>
        <>
          <div className='flex flex-row'>
            <div className='w-full'>
              <DropdownMode
                selectedMode={id ? validatorData?.mode : mode}
                onChange={id ? handleModeChangeGet : handleModeChange}
              />
            </div>
            {id && <DeleteButton idQuestion={id} pathname={router.pathname} />}
          </div>

          <h1 className='text-2xl font-bold text-black'>Ingin menganalisis masalah apa hari ini?</h1>

          <div className='w-full'>
            <div className='flex gap-4'>
              <CustomInput
                inputClassName='flex-grow w-full py-7 p-6 bg-white rounded-[10px] shadow border border-zinc-500 justify-start items-center gap-4 inline-flex'
                placeholder='Isi pertanyaan anda di sini'
                value={id ? validatorData?.question : question}
                isDisabled={id ? true : false}
                onChange={(e) => setQuestion(e.target.value)}
              />
              {id ? <></> : <CircularIconButton icon={<Icon as={MdSend} />} type='submit' />}
            </div>
          </div>
        </>
      </form>
    </>
  )
}

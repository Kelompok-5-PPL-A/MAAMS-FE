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
import { refreshToken, logout } from '../../actions/auth'
import { DeleteButton } from '../../components/deleteButton'
import { Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import axiosInstance from '../../services/axiosInstance'

export const ValidatorQuestionForm: React.FC<ValidatorQuestionFormProps> = ({ id, validatorData }) => {
  const [question, setQuestion] = useState<string>(validatorData?.question || '')
  const [mode, setMode] = useState<Mode | undefined>(validatorData?.mode || Mode.pribadi)
  const router = useRouter()
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const [idQuestion, setIdQuestion] = useState<any>(id)

  const handleModalDeleteOpen = () => setIsModalDeleteOpen(!isModalDeleteOpen)
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false)

  const handleModeChange = (mode: Mode) => {
    setMode(mode)
  }

  const handleModeChangeGet = () => {
    setMode(validatorData?.mode)
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/v1/validator/hapus/${id}/`)
      toast.success('Berhasil menghapus analisis')
      router.push('/')
    } catch (error: any) {
      if (error.response?.status === '404') {
        toast.error(error.response.data.detail)
      } else {
        toast.error('Gagal menghapus analisis')
      }
    }
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
      if (refresh != null && error.response.status == '401') {
        try {
          const responseRefresh = await refreshToken(refresh)
          window.localStorage.setItem('access', responseRefresh.data.access)
          toast.error('Sesi anda telah diperbaharui. Silakan coba lagi')
          router.reload()
        } catch {
          toast.error('Sesi anda telah berakhir. Silakan login kembali')
          logout(refresh)
          localStorage.clear()
          router.push('/login')
        }
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
            {!id ? (
              <></>
            ) : (
              <DeleteButton
                idQuestion={idQuestion}
                setIdQuestion={setIdQuestion}
                onClickDelete={handleModalDeleteOpen}
              />
            )}
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

      <Modal isOpen={isModalDeleteOpen} onClose={handleModalDeleteOpen}>
        <ModalOverlay />
        <ModalContent className='py-8'>
          <ModalCloseButton />
          <ModalBody className='items-center mt-8 mx-4 text-center text-xl font-bold'>
            Apakah Anda yakin ingin menghapus analisis ini?
          </ModalBody>
          <ModalFooter>
            <div className='w-full flex flex-row gap-4'>
              <button
                className='w-full px-6 py-2 border-2 border-yellow-400 rounded-2xl justify-center items-center text-black text-lg'
                onClick={handleModalDeleteOpen}
              >
                Batal
              </button>
              <button
                className='w-full px-6 py-2 bg-gradient-to-t from-red-500 to-red-900 text-white  rounded-2xl justify-center items-center gap-2 inline-flex'
                onClick={handleDelete}
              >
                Hapus
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

import { ValidatorQuestionFormProps } from '../types/validatorQuestionFormProps'
import Mode from '../../constants/mode'
import { DropdownMode } from '../dropdownMode'
import { CustomInput } from '../customInput'
import { CircularIconButton } from '../CircularIconButton'
import React, { useState, useEffect } from 'react'
import { MdSend } from 'react-icons/md'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { DeleteButton } from '../../components/deleteButton'
import { Icon, Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import axiosInstance from '../../services/axiosInstance'
import { EditableTitleForm } from '../../components/editableTitleForm'
import { TagsGroup } from '../../components/tagsGroup'

export const ValidatorQuestionForm: React.FC<ValidatorQuestionFormProps> = ({ id, validatorData }) => {
  const [question, setQuestion] = useState<string>(validatorData?.question || '')
  const [mode, setMode] = useState<Mode | undefined>(validatorData?.mode || Mode.pribadi)
  const router = useRouter()
  const [isModeChangeModalOpen, setIsModeChangeModalOpen] = useState<boolean>(false)
  const [pendingMode, setPendingMode] = useState(mode)
  const [title, setTitle] = useState<string | undefined>(validatorData?.title || validatorData?.question)

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
  }

  const handleModeChange = (newMode: Mode) => {
    setPendingMode(newMode)
    setIsModeChangeModalOpen(true)
  }

  useEffect(() => {
    if (validatorData?.mode !== mode) {
      setMode(validatorData?.mode ?? Mode.pribadi)
    }
    setTitle(validatorData?.title || validatorData?.question)
  }, [validatorData])

  const handleModeChangeConfirm = async () => {
    try {
      if (!id) {
        setMode(validatorData?.mode || pendingMode)
      } else {
        const { data } = await axiosInstance.patch(`/api/v1/validator/ubah/${id}/`, {
          mode: pendingMode
        })
        setMode(data.mode)
      }
      setIsModeChangeModalOpen(false)
      toast.success('Berhasil mengubah mode')
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.detail)
      } else {
        toast.error('Gagal mengubah mode')
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
      if (error.response) {
        toast.error(error.response.data.detail)
      } else {
        toast.error('Gagal menambahkan analisis')
      }
    }
  }

  return (
    <>
      <div className='flex flex-col w-full gap-8'>
        <div className='flex flex-row'>
          <div className='w-full'>
            <DropdownMode selectedMode={isModeChangeModalOpen ? pendingMode : mode} onChange={handleModeChange} />
          </div>
          {id && <DeleteButton idQuestion={id} pathname={router.pathname} />}
        </div>

        {id && <EditableTitleForm title={title} onTitleChange={handleTitleChange} id={id} />}

        <TagsGroup tags={validatorData?.tags} />

        <form onSubmit={handleSubmit} data-testid='question-form'>
          <>
            <div className='w-full'>
              <div className='flex gap-4'>
                <CustomInput
                  inputClassName='flex-grow w-full py-7 p-6 bg-white rounded-[10px] shadow border border-zinc-500 justify-start items-center gap-4 inline-flex'
                  placeholder='Isi pertanyaan anda di sini'
                  value={id ? validatorData?.question : question}
                  isDisabled={id ? true : false}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                {id ? (
                  <></>
                ) : (
                  <CircularIconButton icon={<Icon as={MdSend} />} type='submit' data-testid='submit-question' />
                )}
              </div>
            </div>
          </>
        </form>
      </div>

      <Modal isOpen={isModeChangeModalOpen} onClose={() => setIsModeChangeModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className='py-8'>
          <ModalCloseButton />
          <ModalBody className='items-center mt-8 mx-4 text-center text-xl font-bold'>
            {pendingMode === Mode.pengawasan
              ? 'Apakah Anda yakin ingin menampilkan analisis ini kepada Admin?'
              : 'Ubah analisis menjadi pribadi?'}
          </ModalBody>
          <ModalFooter>
            <div className='w-full flex flex-row gap-4'>
              <button
                className='w-full px-6 py-2 border-2 border-yellow-400 rounded-2xl justify-center items-center text-black text-lg'
                onClick={() => setIsModeChangeModalOpen(false)}
              >
                Batal
              </button>
              <button
                className='w-full px-6 py-2 bg-gradient-to-t from-yellow-500 to-yellow-500 text-white rounded-2xl justify-center items-center gap-2 inline-flex'
                onClick={handleModeChangeConfirm}
              >
                Simpan
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

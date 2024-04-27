import React, { useEffect, useState } from 'react'
import MainLayout from '../../layout/MainLayout'
import axiosInstance from '../../services/axiosInstance'
import { DropdownMode } from '../../components/dropdownMode'
import Mode from '../../constants/mode'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

const QuestionAddPage: React.FC = () => {
  const router = useRouter()

  const [mode, setMode] = useState<Mode>(Mode.pribadi)
  const [title, setTitle] = useState<string>('')
  const [question, setQuestion] = useState<string>('')
  const [newTag, setNewTag] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])

  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  useEffect(() => {
    if (!refresh) {
      toast.error('silakan login terlebih dahulu')
      router.push('/login')
      return
    }
  }, [])

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() !== '') {
      if (tags.length == 5) {
        toast.error('Kategori sudah ada 5')
        return
      }
      setTags((prevCategories) => [...prevCategories, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!title) {
      toast.error('Judul harus diisi')
      return
    } else if (!question) {
      toast.error('Pertanyaan harus diisi')
      return
    } else if (tags.length == 0) {
      toast.error('Minimal mengisi 1 kategori')
      return
    }

    try {
      const { data } = await axiosInstance.post('/api/v1/validator/baru/', {
        title: title,
        question: question,
        mode: mode,
        tags: tags
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
    <MainLayout>
      <div className='flex flex-col w-full'>
        <div className='w-full'>
          <DropdownMode selectedMode={mode} onChange={handleModeChange} />
        </div>
        <h1 className='text-2xl font-bold text-black my-8'>Ingin menganalisis masalah apa hari ini?</h1>
        <div className='flex flex-col lg:justify-center mt-4 lg:w-full gap-7'>
          <div className='flex flex-col lg:justify-center lg:w-full gap-2'>
            <div>Judul Analisis</div>
            <input
              required
              type='text'
              name='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Ingin menganalisis apa hari ini ...'
              className='border border-black shadow-lg rounded-md px-6 py-3 w-full'
            />
          </div>
          <div className='flex flex-col lg:justify-center lg:w-full gap-2'>
            <div>Pertanyaan (akibat)</div>
            <input
              required
              type='text'
              name='question'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder='Pertanyaan apa yang ingin ditanyakan ...'
              className='border border-black shadow-lg rounded-md px-6 py-3 w-full'
            />
          </div>
          <div className='flex flex-col lg:justify-center lg:w-full gap-2'>
            <div>Kategori Analisis</div>
            <input
              type='text'
              name='tags'
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Berikan maksimal 5 kategori ...'
              className='border border-black shadow-lg rounded-md px-6 py-3 w-full'
            />
            <div className='flex flex-wrap gap-2'>
              {tags.map((tag, index) => (
                <div key={index} className='flex items-center bg-yellow-400 rounded-full px-3 py-1'>
                  <span>{tag}</span>
                  <button
                    type='button'
                    data-testid='remove-tag-button'
                    onClick={() => handleRemoveTag(tag)}
                    className='ml-2 text-black'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className='flex justify-center w-full mt-4 flex-col lg:flex-row'>
            <button
              type='button'
              onClick={handleSubmit}
              className='bg-gradient-to-b from-yellow-400 to-yellow-600 text-xl text-white font-bold py-2 px-10 rounded-xl'
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default QuestionAddPage

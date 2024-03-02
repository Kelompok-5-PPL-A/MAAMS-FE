import React, { useState, useEffect } from 'react'
import MainLayout from '../../layout/MainLayout'
import { CounterButton } from '../../components/counterButton'
import { Row } from '../../components/row'
import { ValidatorQuestionForm } from 'components/validatorQuestionForm'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ValidatorData } from 'components/types/validatorQuestionFormProps'
import toast from 'react-hot-toast'

const defaultValidatorData: ValidatorData = {
  question: '',
  mode: '',
  created_at: '',
  username: ''
}

const ValidatorDetailPage = () => {
  const [cols, setCols] = useState<number>(3)
  const router = useRouter()
  const id = typeof router.query.id === 'string' ? router.query.id : ''
  const [validatorData, setValidatorData] = useState<ValidatorData>(defaultValidatorData)

  useEffect(() => {
    const getQuestionData = async (id: string) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/validator/${id}`, {
          withCredentials: true,
          headers: {
            // todo
          }
        })
        const receivedData: ValidatorData = response.data
        setValidatorData(receivedData)
      } catch (error) {
        toast.error('Analisis tidak ditemukan')
        router.push('/')
      }
    }

    getQuestionData(id)
  }, [id])

  const handleIncrement = () => {
    if (cols < 5) {
      setCols(cols + 1)
    }
  }

  const handleDecrement = () => {
    if (cols > 3) {
      setCols(cols - 1)
    }
  }

  return (
    <MainLayout>
      <div className='flex flex-col w-full gap-8'>
        <ValidatorQuestionForm id={id} validatorData={validatorData} />
        <h1 className='text-2xl font-bold text-black'>Sebab:</h1>
        <CounterButton number={cols} onIncrement={handleIncrement} onDecrement={handleDecrement} />
        <Row rowNumber='1' cols={cols}></Row>
      </div>
    </MainLayout>
  )
}

export default ValidatorDetailPage

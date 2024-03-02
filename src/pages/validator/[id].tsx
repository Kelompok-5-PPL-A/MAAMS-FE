import React, { useState, useEffect } from 'react'
import MainLayout from '../../layout/MainLayout'
import { CounterButton } from '../../components/counterButton'
import { Row } from '../../components/row'
import { ValidatorQuestionForm } from '../../components/validatorQuestionForm'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ValidatorData } from '../../components/types/validatorQuestionFormProps'
import toast from 'react-hot-toast'
import Mode from 'constants/mode'

const defaultValidatorData: ValidatorData = {
  question: '',
  mode: Mode.pribadi,
  created_at: '',
  username: ''
}

const ValidatorDetailPage = () => {
  const [cols, setCols] = useState<number>(3)
  const router = useRouter()
  const id = router.query.id
  const [validatorData, setValidatorData] = useState<ValidatorData>(defaultValidatorData)
  const accessToken = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const headers = {
    Authorization: `Bearer ${accessToken}`
  }

  useEffect(() => {
    const getQuestionData = async (id: string | string[] | undefined) => {
      try {
        if (!id) {
          console.log(id)
          // If id is not available, don't make the request
          return
        }
        const response = await axios({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/${id}/`,
          withCredentials: false,
          headers: headers
        })
        const receivedData: ValidatorData = response.data
        console.log(receivedData)
        setValidatorData(receivedData)
      } catch (error: any) {
        if (error.response) {
          toast.error(error.response.data.message)
        } else if (error.message) {
          toast.error(error.message)
        }
        router.push('/')
      }
    }
    getQuestionData(id)
  }, [id, setValidatorData])

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

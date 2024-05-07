import React, { useState, useEffect } from 'react'
import MainLayout from '../../layout/MainLayout'
import { CounterButton } from '../../components/counterButton'
import { Row } from '../../components/row'
import { ValidatorQuestionForm } from '../../components/validatorQuestionForm'
import { useRouter } from 'next/router'
import { ValidatorData } from '../../components/types/validatorQuestionFormProps'
import toast from 'react-hot-toast'
import Mode from '../../constants/mode'
import { SubmitButton } from '../../components/submitButton'
import { CauseStatus } from '../../lib/enum'
import { UserDataProps } from 'components/types/userData'
import { Cause } from '../../components/types/cause'
import { ValidatorAdminHeader } from '../../components/validatorAdminHeader'
import axiosInstance from '../../services/axiosInstance'

const defaultValidatorData: ValidatorData = {
  title: '',
  question: '',
  mode: Mode.pribadi,
  created_at: '',
  username: ''
}

const defaultUserData: UserDataProps = {
  date_joined: '',
  email: '',
  first_name: '',
  is_active: false,
  is_staff: false,
  last_name: '',
  username: '',
  uuid: ''
}

const ValidatorDetailPage = () => {
  const router = useRouter()
  const id = router.query.id
  const [validatorData, setValidatorData] = useState<ValidatorData>(defaultValidatorData)
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const alphabet = 'ABCDE'
  const [columnCount, setColumnCount] = useState(3)
  const [rows, setRows] = useState([createInitialRow(1, 3)])
  const [canAdjustColumns, setCanAdjustColumns] = useState(true)

  const [isStaff, setIsStaff] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [userData, setUserData] = useState<UserDataProps>(defaultUserData)

  useEffect(() => {
    getQuestionData()
    getCauses()
  }, [id])

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem('userData')!))
  }, [])

  useEffect(() => {
    setIsStaff(userData?.is_staff || false)
    setIsOwner(userData?.username == validatorData?.username)
  }, [validatorData])

  const getQuestionData = async () => {
    if (!id) return

    if (!refresh) {
      toast.error('silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    try {
      const response = await axiosInstance.get(`/api/v1/validator/${id}/`)
      const receivedData: ValidatorData = response.data
      setValidatorData(receivedData)
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.detail)
        router.push('/')
      } else {
        toast.error('Gagal mengambil data analisis')
        router.push('/')
      }
    }
  }

  const getCauses = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/validator/causes/${id}`)
      processAndSetRows(response.data)
    } catch (error) {
      console.error('Error fetching causes:', error)
      throw error
    }
  }

  const processAndSetRows = (causes: Cause[]) => {
    const groupedCauses: { [key: number]: Cause[] } = causes.reduce((acc: { [key: number]: Cause[] }, cause) => {
      const { row } = cause
      if (!acc[row]) {
        acc[row] = []
      }
      acc[row].push(cause)
      return acc
    }, {})

    const rows = Object.entries(groupedCauses).map(([rowNumber, rowCauses]) => ({
      id: parseInt(rowNumber),
      causes: rowCauses.map((cause) => cause.cause),
      statuses: rowCauses.map((cause) => (cause.status ? CauseStatus.CorrectRoot : CauseStatus.CorrectNotRoot)),
      feedbacks: rowCauses.map(() => ''),
      disabled: rowCauses.map(() => false)
    }))

    setRows(rows)
  }

  useEffect(() => {
    disableValidatedRow()
  }, [rows.length])

  const adjustColumnCount = (increment: boolean) => {
    if (!canAdjustColumns) return

    setColumnCount((prevCount) => {
      const newCount = increment ? Math.min(prevCount + 1, 5) : Math.max(prevCount - 1, 3)

      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          causes: adjustArraySize(row.causes, newCount, ''),
          statuses: adjustArraySize(row.statuses, newCount, CauseStatus.Unchecked),
          feedbacks: adjustArraySize(row.feedbacks, newCount, ''),
          disabled: adjustArraySize(row.disabled, newCount, false)
        }))
      )

      return newCount
    })
  }

  const addRow = () => {
    setRows((prevRows) => [...prevRows, createInitialRow(rows.length + 1, columnCount)])
  }

  const updateCauseAndStatus = (rowId: number, columnIndex: number, newCause: string, newStatus: CauseStatus) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              causes: row.causes.map((cause, index) => (index === columnIndex ? newCause : cause)),
              statuses: row.statuses.map((status, index) => (index === columnIndex ? newStatus : status))
            }
          : row
      )
    )
  }

  const disableValidatedRow = () => {
    setRows((prevRows) =>
      prevRows.map((row, index, arr) =>
        index < arr.length - 1
          ? {
              ...row,
              disabled: row.disabled.fill(true)
            }
          : row
      )
    )
  }

  const createCausesForRow = async () => {
    try {
      const createPromises = rows
        .flatMap((row) =>
          row.causes.map((cause, index) => ({
            question_id: id,
            cause: cause,
            row: row.id,
            column: index,
            mode: Mode.pribadi // Set the mode as needed
          }))
        )
        .map((data) => axiosInstance.post(`/api/v1/validator/causes/`, data))

      await Promise.all(createPromises)
    } catch (error) {
      console.error('Error creating causes:', error)
      // Handle error
    }
  }

  // TODO : Implement disable column with root cause logic

  const submitCauses = async () => {
    try {
      const isFirstTime = rows.every((row) => row.statuses.every((status) => status === CauseStatus.Unchecked))

      if (isFirstTime) {
        await createCausesForRow()
      }

      const updatedRows = rows.map((row) => ({
        ...row,
        statuses: row.statuses.map(() => CauseStatus.CorrectNotRoot),
        feedbacks: row.feedbacks.map((feedback, index) => `Penyebab pada ${alphabet[index]}${row.id} sudah tepat`)
      }))
      setRows(updatedRows)

      const checkAllStatus = updatedRows.every((row) =>
        row.statuses.every((status) => status === CauseStatus.CorrectNotRoot || status === CauseStatus.CorrectRoot)
      )

      setCanAdjustColumns(!checkAllStatus)

      if (checkAllStatus) {
        addRow()
        disableValidatedRow()
      }

      await axiosInstance.post(`/api/v1/validator/validate/${id}/`)
    } catch (error) {
      console.error('Gagal validasi sebab:', error)
    }
  }

  const isSubmitDisabled = rows.some((row) => row.causes.some((cause) => cause.trim() === ''))

  return (
    <MainLayout>
      <div className='flex flex-col w-full gap-8'>
        {isStaff && !isOwner ? (
          <ValidatorAdminHeader id={id} validatorData={validatorData} />
        ) : (
          <ValidatorQuestionForm id={id} validatorData={validatorData} />
        )}
        <h1 className='text-2xl font-bold text-black'>Sebab:</h1>
        {isOwner ? (
          <CounterButton
            number={columnCount}
            onIncrement={() => adjustColumnCount(true)}
            onDecrement={() => adjustColumnCount(false)}
          />
        ) : (
          <></>
        )}
        {rows.map((row) => (
          <div key={row.id}>
            <Row
              rowNumber={row.id}
              cols={columnCount}
              causes={row.causes}
              causeStatuses={row.statuses}
              disabledCells={!isOwner ? Array(columnCount).fill(true) : row.disabled}
              onCauseAndStatusChanges={(causeIndex: number, newValue: string, newStatus: CauseStatus) =>
                updateCauseAndStatus(row.id, causeIndex, newValue, newStatus)
              }
              feedbacks={row.feedbacks}
            />
          </div>
        ))}
        {isOwner ? (
          <div className='flex justify-center mt-4'>
            <SubmitButton onClick={() => submitCauses()} disabled={isSubmitDisabled} label='Kirim Sebab' />
          </div>
        ) : (
          <></>
        )}
      </div>
    </MainLayout>
  )
}

function createInitialRow(id: number, cols: number) {
  return {
    id,
    causes: Array(cols).fill(''),
    statuses: Array(cols).fill(CauseStatus.Unchecked),
    feedbacks: Array(cols).fill(''),
    disabled: Array(cols).fill(false)
  }
}

function adjustArraySize<T>(array: T[], size: number, defaultValue: T): T[] {
  const currentSize = array.length
  if (size > currentSize) {
    return [...array, ...Array(size - currentSize).fill(defaultValue)]
  } else {
    return array.slice(0, size)
  }
}

export default ValidatorDetailPage

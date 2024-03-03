import MainLayout from '../../layout/MainLayout'
import React, { useState, useEffect } from 'react'
import { Row } from '../../components/row'
import { CounterButton } from '../../components/counterButton'
import { SubmitButton } from '../../components/submitButton'
import { CauseStatus } from 'lib/enum'

const Validator = () => {
  const alphabet = 'ABCDE'
  const [columnCount, setColumnCount] = useState(3)
  const [rows, setRows] = useState([createInitialRow(1, 3)])
  const [canAdjustColumns, setCanAdjustColumns] = useState(true)

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

  // TODO : Implement disable column with root cause logic

  const submitCauses = async () => {
    // TODO : Implement submit causes logic with API call

    //For now, causes always correct but not root
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
  }

  const isSubmitDisabled = rows.some((row) => row.causes.some((cause) => cause.trim() === ''))

  return (
    <MainLayout>
      <h1 className='text-2xl font-bold text-black'>Sebab:</h1>
      <CounterButton
        number={columnCount}
        onIncrement={() => adjustColumnCount(true)}
        onDecrement={() => adjustColumnCount(false)}
      />
      {rows.map((row) => (
        <div key={row.id}>
          <Row
            rowNumber={row.id}
            cols={columnCount}
            causes={row.causes}
            causeStatuses={row.statuses}
            disabledCells={row.disabled}
            onCauseAndStatusChanges={(causeIndex: number, newValue: string, newStatus: CauseStatus) =>
              updateCauseAndStatus(row.id, causeIndex, newValue, newStatus)
            }
          />
          {row.feedbacks.map((feedback, feedbackIndex) => (
            <div key={`${row.id}-feedback-${feedbackIndex}`} className='feedback-message'>
              {feedback}
            </div>
          ))}
        </div>
      ))}
      {
        <div className='flex justify-center mt-4'>
          <SubmitButton onClick={() => submitCauses()} disabled={isSubmitDisabled} label='Kirim Sebab' />
        </div>
      }
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
export default Validator

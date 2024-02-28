import React, { useState } from 'react'
import { Row } from '../../components/row'
import { CounterButton } from '../../components/counterButton'
import { SubmitButton } from '../../components/submitButton'
import { CauseStatus } from 'lib/enum'

const Validator = () => {
  const alphabet = 'ABCDE'
  const [columnCount, setColumnCount] = useState(3)
  const [rows, setRows] = useState([
    {
      id: 1,
      causes: ['', '', ''],
      statuses: [CauseStatus.Unchecked, CauseStatus.Unchecked, CauseStatus.Unchecked],
      feedbacks: ['', '', ''],
      disabled: [false, false, false]
    }
  ])
  const [canAdjustColumns, setCanAdjustColumns] = useState(true)
  const [allRootFound, setAllRootFound] = useState(false)

  const adjustColumnCount = (increment: boolean) => {
    if (!canAdjustColumns) return

    setColumnCount((prevCount) => {
      let newCount = increment ? prevCount + 1 : prevCount - 1
      newCount = Math.max(3, Math.min(newCount, 5))
      return newCount
    })

    setRows((prevRows) =>
      prevRows.map((row) => {
        return {
          ...row,
          causes: increment ? [...row.causes.slice(0, 5), ''].slice(0, 5) : row.causes.slice(0, -1),
          statuses: increment
            ? [...row.statuses.slice(0, 5), CauseStatus.Unchecked].slice(0, 5)
            : row.statuses.slice(0, -1),
          feedbacks: increment ? [...row.feedbacks.slice(0, 5), ''].slice(0, 5) : row.feedbacks.slice(0, -1),
          disabled: increment ? [...row.disabled.slice(0, 5), false].slice(0, 5) : row.disabled.slice(0, -1)
        }
      })
    )
  }

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1,
        causes: Array(Math.min(columnCount, 5)).fill(''),
        statuses: Array(Math.min(columnCount, 5)).fill(CauseStatus.Unchecked),
        feedbacks: Array(Math.min(columnCount, 5)).fill(''),
        disabled: Array(Math.min(columnCount, 5)).fill(false)
      }
    ])
  }

  const updateCauseAndStatus = (rowId: number, columnIndex: number, newCause: string, newStatus: CauseStatus) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              causes: row.causes.map((cause, index) => (index === columnIndex ? newCause : cause)),
              causeStatuses: row.statuses.map((status, index) => (index === columnIndex ? newStatus : status))
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

  const submitCauses = async () => {
    // Dummy-implementation
    const updatedRows = rows.map((row) => ({
      ...row,
      statuses: row.statuses.map((status) => (status === CauseStatus.Unchecked ? CauseStatus.CorrectNotRoot : status)),
      feedbacks: row.feedbacks.map((feedback, index) => `Penyebab pada ${alphabet[index]}${rows.length} sudah tepat`)
    }))

    setRows(updatedRows)

    const allCausesCorrect = updatedRows.every((row) =>
      row.statuses.every((status) => status === CauseStatus.CorrectNotRoot || status === CauseStatus.CorrectRoot)
    )

    // Check if all root causes are found
    let rootCauseCounts = 0
    updatedRows.forEach((row) => {
      row.statuses.forEach((status) => {
        if (status === CauseStatus.CorrectRoot) {
          rootCauseCounts++
        }
      })
    })

    const newAllRootFound = rootCauseCounts === columnCount

    setAllRootFound(newAllRootFound)
    setCanAdjustColumns(!allCausesCorrect)

    // Disable all column with root cause
    const columnsWithRootCause: number[] = []
    updatedRows.forEach((row) => {
      row.statuses.forEach((status, index) => {
        if (status === CauseStatus.CorrectRoot) {
          columnsWithRootCause.push(index)
        }
      })
    })

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        disabled: row.disabled.map((disable, index) => (columnsWithRootCause.includes(index) ? true : disable))
      }))
    )

    // Disable the last row and not allow adding new row if all root causes are found
    if (newAllRootFound) {
      disableValidatedRow()
    }

    // Add new row if all causes are correct and not all root causes are found
    // Disable the last row if all causes are correct
    if (allCausesCorrect && !newAllRootFound) {
      addRow()
      disableValidatedRow()
    }
  }

  const isSubmitDisabled = rows.some((row) => row.causes.some((cause) => cause.trim() === ''))

  return (
    <div>
      <h1 className="text-2xl font-bold font-['Poppins'] text-black">Causes:</h1>
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
      {!allRootFound && (
        <div className='flex justify-center mt-4'>
          <SubmitButton onClick={() => submitCauses()} disabled={isSubmitDisabled} label='Kirim Sebab' />
        </div>
      )}
    </div>
  )
}

export default Validator

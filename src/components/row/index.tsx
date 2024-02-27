import React, { useState, useEffect } from 'react'
import { Cell } from '../cell' // Ensure this path matches your project structure
import { CauseStatus } from 'lib/enum' // Ensure this enum is correctly imported

interface RowProps {
  rowNumber: number
  cols: number
  causes: string[]
  causeStatuses: CauseStatus[]
  disabledCells: boolean[]
  onCauseAndStatusChanges: (causeIndex: number, newValue: string, newStatus: CauseStatus) => void
}

export const Row: React.FC<RowProps> = ({
  rowNumber,
  cols,
  causes,
  causeStatuses,
  disabledCells,
  onCauseAndStatusChanges
}) => {
  const alphabet = 'ABCDE'
  const [localCauses, setLocalCauses] = useState<string[]>(causes)
  const [localCauseStatuses, setLocalCauseStatuses] = useState<CauseStatus[]>(causeStatuses)

  useEffect(() => {
    setLocalCauses(causes.slice(0, cols).concat(Array(Math.max(cols - causes.length, 0)).fill('')))
    setLocalCauseStatuses(
      causeStatuses.slice(0, cols).concat(Array(Math.max(cols - causeStatuses.length, 0)).fill(CauseStatus.Unchecked))
    )
  }, [cols, causes, causeStatuses])

  const handleLocalCauseChange = (causeIndex: number, newValue: string, newStatus: CauseStatus) => {
    const updatedCauses = [...localCauses]
    updatedCauses[causeIndex] = newValue
    setLocalCauses(updatedCauses)

    const updatedStatuses = [...localCauseStatuses]
    updatedStatuses[causeIndex] = newStatus
    setLocalCauseStatuses(updatedStatuses)

    onCauseAndStatusChanges(causeIndex, newValue, newStatus)
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '10px',
    alignItems: 'center',
    margin: '20px 0'
  }

  return (
    <div style={gridStyle}>
      {localCauses.map((cause, index) => (
        <Cell
          key={`${rowNumber}-${index}`}
          cellName={`${alphabet[index]}${rowNumber}`}
          cause={localCauses[index]}
          onChange={(newValue) => handleLocalCauseChange(index, newValue, localCauseStatuses[index])}
          causeStatus={localCauseStatuses[index]}
          disabled={disabledCells[index]}
          placeholder={disabledCells[index] ? '' : 'Enter a cause.. '}
        />
      ))}
    </div>
  )
}

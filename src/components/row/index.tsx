import React, { useState, useEffect } from 'react'
import { Cell } from '../cell'

interface RowProps {
  rowNumber: string
  cols: number
}

export const Row: React.FC<RowProps> = ({ rowNumber, cols }) => {
  const alphabet = 'ABCDE'
  const initialCauses = Array(cols).fill('')
  const [causes, setCauses] = useState<string[]>(initialCauses)
  const [columns, setCols] = useState<number>(cols)

  const handleCauseChange = (index: number, value: string) => {
    const updatedValues = [...causes]
    updatedValues[index] = value
    setCauses(updatedValues)
  }

  useEffect(() => {
    // Update the number of columns when the 'cols' prop changes
    setCauses((prevValues) => {
      // Ensure that the length of the array matches the new 'cols' value
      const newValues = [...prevValues]
      if (cols > prevValues.length) {
        newValues.push(...Array(1).fill(''))
      } else if (cols < prevValues.length) {
        newValues.pop()
      }
      return newValues
    })
    setCols(cols)
  }, [cols])

  return (
    <div className={`grid grid-cols-${columns} gap-0 items-center my-8`}>
      {causes.map((value, index) => (
        <Cell
          key={alphabet.charAt(index) + rowNumber}
          cellName={alphabet.charAt(index) + rowNumber}
          cause={value}
          onChange={(newValue) => handleCauseChange(index, newValue)}
        ></Cell>
      ))}
    </div>
  )
}

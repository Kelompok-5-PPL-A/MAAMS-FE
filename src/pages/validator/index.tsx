import React, { useState } from 'react'
import { CounterButton } from '../../components/counterButton'
import { Row } from '../../components/row'

const validator = () => {
  const [cols, setCols] = useState<number>(3)

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
    <div>
      <h1 className="text-2xl font-bold font-['Poppins'] text-black">Sebab:</h1>
      <CounterButton number={cols} onIncrement={handleIncrement} onDecrement={handleDecrement} />
      <Row rowNumber='1' cols={cols}></Row>
    </div>
  )
}

export default validator

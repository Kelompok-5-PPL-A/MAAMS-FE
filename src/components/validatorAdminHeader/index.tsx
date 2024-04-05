import { ValidatorQuestionFormProps } from '../types/validatorQuestionFormProps'
import { CustomInput } from '../customInput'
import React, { useState } from 'react'

export const ValidatorAdminHeader: React.FC<ValidatorQuestionFormProps> = ({ id, validatorData }) => {
  const [question, setQuestion] = useState<string>(validatorData?.question || '')

  return (
    <>
      <h1 className='text-2xl font-bold text-black'>Analisis {validatorData?.username || 'Username'}</h1>
      <div className='w-full'>
        <div className='flex gap-4'>
          <CustomInput
            inputClassName='flex-grow w-full py-7 p-6 bg-white rounded-[10px] shadow border border-zinc-500 justify-start items-center gap-4 inline-flex'
            value={id ? validatorData?.question : question}
            isDisabled={true}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
      </div>
    </>
  )
}

import React, { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqData: FAQItem[] = [
    {
      question: 'Apa itu MAAMS?',
      answer:
        'Aplikasi ini berfokus pada validasi sebab-sebab masalah yang dimasukkan oleh pengguna. Dengan menggunakan algoritma analisis, MAAMS akan memeriksa dan mengonfirmasi sebab-sebab yang mungkin mendasari masalah tersebut. Melalui proses ini, MAAMS membantu pengguna untuk menemukan akar dari masalah dengan lebih tepat.'
    },
    {
      question: 'Apa perbedaan Pribadi dan Pengawasan?',
      answer: 'Perbedaan antara Pribadi dan Pengawasan adalah mode pengawasan'
    },
    {
      question: 'Mengapa MAAMS itu penting?',
      answer: 'MAAMS penting karena'
    }
  ]

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className='flex flex-col justify-center items-center w-full gap-8 px-8'>
      <p className='text-3xl font-bold text-center text-black'>FAQ</p>
      <div className='w-full'>
        {faqData.map((faq, index) => (
          <div key={index} className='bg-yellow-200 rounded-md p-6 mb-4 shadow-md border border-yellow-500'>
            <div onClick={() => toggleAnswer(index)} className='flex justify-between items-center cursor-pointer'>
              <p className='text-lg text-black'>
                <strong>{faq.question}</strong>
              </p>
              <svg
                className={`w-6 h-6 transform ${activeIndex === index ? 'rotate-180' : ''}`}
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </div>
            {activeIndex === index && (
              <>
                <hr className='my-4 border-gray-400' />
                <p className='text-base text-black'>{faq.answer}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ

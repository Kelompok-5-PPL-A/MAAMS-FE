import { render, fireEvent } from '@testing-library/react'
import FAQ from '../../components/faq'
import React from 'react'
import '@testing-library/jest-dom'

describe('FAQ component', () => {
  it('renders FAQ questions correctly', () => {
    const { getByText } = render(<FAQ />)

    const question1 = getByText('Apa itu MAAMS?')
    expect(question1).toBeInTheDocument()

    const question2 = getByText('Apa perbedaan Pribadi dan Pengawasan?')
    expect(question2).toBeInTheDocument()

    const question3 = getByText('Mengapa MAAMS itu penting?')
    expect(question3).toBeInTheDocument()
  })

  it('toggles answers on click', () => {
    const { getByText } = render(<FAQ />)

    const question1 = getByText('Apa itu MAAMS?')
    fireEvent.click(question1)

    const answer1 = getByText(
      'Aplikasi ini berfokus pada validasi sebab-sebab masalah yang dimasukkan oleh pengguna. Dengan menggunakan algoritma analisis, MAAMS akan memeriksa dan mengonfirmasi sebab-sebab yang mungkin mendasari masalah tersebut. Melalui proses ini, MAAMS membantu pengguna untuk menemukan akar dari masalah dengan lebih tepat.'
    )
    expect(answer1).toBeInTheDocument()

    fireEvent.click(question1)
    expect(answer1).not.toBeInTheDocument()
  })
})

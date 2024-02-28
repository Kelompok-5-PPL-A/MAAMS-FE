import React, { ReactNode } from 'react'
import Navbar from '../components/navbar/navbar'
import Footer from '../components/footer/footer'

type MainLayoutProps = {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <Navbar />
      <div className='min-h-screen'>{children}</div>
      <Footer />
    </div>
  )
}

export default MainLayout

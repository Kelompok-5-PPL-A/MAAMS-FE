import React, { ReactNode } from 'react'
import Navbar from '../components/navbar/navbar'
import Footer from '../components/footer/footer'

type MainLayoutProps = {
  children: ReactNode
  marginOverride?: string
}

const MainLayout = ({ children, marginOverride = 'm-10' }: MainLayoutProps) => {
  return (
    <div>
      <Navbar />
      <div className={`min-h-screen ${marginOverride}`}>{children}</div>
      <Footer />
    </div>
  )
}

export default MainLayout

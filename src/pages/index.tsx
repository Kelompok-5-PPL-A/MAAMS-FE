import React from 'react'
import MainLayout from '../layout/MainLayout'
import FAQ from '../components/faq'
import HeaderIntro from '../components/headerIntro'

const index = () => {
  return (
    <MainLayout marginOverride='m-0'>
      <HeaderIntro />
      <FAQ />
    </MainLayout>
  )
}

export default index

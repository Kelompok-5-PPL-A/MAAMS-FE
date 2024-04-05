import React from 'react'
import MainLayout from '../layout/MainLayout'
import FAQ from '../components/faq'
import HeaderIntro from '../components/headerIntro'
import CreateLanding from 'components/CreateLanding'
import RecentAnalysis from 'components/recentAnalysis'

const Index = () => {
  return (
    <MainLayout marginOverride='m-0'>
      <HeaderIntro />
      <CreateLanding />
      <RecentAnalysis />
      <FAQ />
    </MainLayout>
  )
}

export default Index

import React from 'react'
import MainLayout from '../../layout/MainLayout'
import Section from '../../components/sectionHistory'
import { Item } from 'components/types/historyPage'

const History: React.FC = () => {
  // Dummy data

  const pastWeekItems: Item[] = [
    {
      title: 'Mengapa Indonesia Darurat Narkoba?',
      timestamp: '15:00 15/03/2023',
      mode: 'PRIBADI',
      user: 'Nicholas Cage'
    },
    {
      title: 'Mengapa Indonesia Darurat Narkoba?',
      timestamp: '15:00 15/03/2023',
      mode: 'PRIBADI',
      user: 'Nicholas Cage'
    },
    {
      title: 'Mengapa Indonesia Darurat Narkoba?',
      timestamp: '15:00 15/03/2023',
      mode: 'PRIBADI',
      user: 'Nicholas Cage'
    }
  ]
  const lastWeekItems: Item[] = [
    {
      title: 'Mengapa Indonesia Darurat Narkoba?',
      timestamp: '15:00 15/03/2023',
      mode: 'PRIBADI',
      user: 'Nicholas Cage'
    },
    {
      title: 'Mengapa Indonesia Darurat Narkoba?',
      timestamp: '15:00 15/03/2023',
      mode: 'PRIBADI',
      user: 'Nicholas Cage'
    },
    {
      title: 'Mengapa Indonesia Darurat Narkoba?',
      timestamp: '15:00 15/03/2023',
      mode: 'PRIBADI',
      user: 'Nicholas Cage'
    }
  ]

  return (
    <MainLayout>
      <div className='min-h-screen m-12'>
        <h1 data-testid='history-title' className='text-2xl font-bold mb-4 text-center mt-7 mb-7'>
          Riwayat Analisis
        </h1>
        <Section title='7 hari terakhir' items={lastWeekItems} seeMoreLink={'#'} showModeButton={false} />
        <Section title='Lebih lama' items={pastWeekItems} seeMoreLink={'#'} showModeButton={true} />
      </div>
    </MainLayout>
  )
}

export default History

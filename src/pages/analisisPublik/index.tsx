import React, { useState, useEffect } from 'react'
import MainLayout from '../../layout/MainLayout'
import Section from '../../components/sectionHistory'
import { Item } from 'components/types/historyPage'
import axios from 'axios'
import { formatTimestamp } from '../../utils/dateFormatter'
import { logout, refreshToken } from '../../actions/auth'
import router from 'next/router'
import toast from 'react-hot-toast'

const AnalisisPublik: React.FC = () => {
  const [lastweek, setLastWeek] = useState<Item[]>([])
  const [older, setOlder] = useState<Item[]>([])
  const access = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const headers = {
    Authorization: `Bearer ${access}`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lastWeekResponse, olderResponse] = await Promise.all([
          axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/pengawasan/?count=3&time_range=last_week`,
            withCredentials: false,
            headers: headers
          }),
          axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/pengawasan/?count=3&time_range=older`,
            withCredentials: false,
            headers: headers
          })
        ])

        const lastWeekData = lastWeekResponse.data
        const olderData = olderResponse.data

        // Process the data
        const processedLastWeekData = lastWeekData.results.map((item: any) => ({
          title: item.question,
          timestamp: formatTimestamp(item.created_at),
          mode: item.mode,
          user: item.username
        }))

        const processedOlderData = olderData.results.map((item: any) => ({
          title: item.question,
          timestamp: formatTimestamp(item.created_at),
          mode: item.mode,
          user: item.username
        }))

        // Set the entire history data
        setLastWeek(processedLastWeekData)
        setOlder(processedOlderData)
      } catch (error: any) {
        if (refresh != null && error.response.status == '401') {
          try {
            const responseRefresh = await refreshToken(refresh)
            window.localStorage.setItem('access', responseRefresh.data.access)
            router.reload()
          } catch {
            toast.error('Sesi anda telah berakhir. Silakan login kembali')
            logout(refresh)
            localStorage.clear()
            router.push('/login')
          }
        } else if (error.response) {
          toast.error(error.response.data.detail)
          router.push('/')
        } else if (error.message) {
          toast.error(error.message)
          router.push('/')
        }
      }
    }

    fetchData()
  }, [])

  return (
    <MainLayout>
      <div className='min-h-screen m-12'>
        <h1 data-testid='history-title' className='text-2xl font-bold mb-4 text-center mt-7 mb-7'>
          Riwayat Analisis
        </h1>
        <Section
          title='7 hari terakhir'
          items={lastweek}
          seeMoreLink={'/analisisPublik/lastWeek'}
          showModeButton={false}
        />
        <Section title='Lebih lama' items={older} seeMoreLink={'/analisisPublik/pastWeek'} showModeButton={false} />
      </div>
    </MainLayout>
  )
}

export default AnalisisPublik

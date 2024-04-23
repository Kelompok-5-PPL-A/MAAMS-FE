import React, { useState, useEffect } from 'react'
import MainLayout from '../../layout/MainLayout'
import Section from '../../components/sectionHistory'
import { Item } from 'components/types/historyPage'
import { logout, refreshToken } from '../../actions/auth'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { SearchBar } from '../../components/searchBar'
import { fetchQuestions } from '../../actions/fetchQuestions'

const History: React.FC = () => {
  const [lastweek, setLastWeek] = useState<Item[]>([])
  const [older, setOlder] = useState<Item[]>([])
  const [keyword, setKeyword] = useState<string>('')
  const access = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const headers = {
    Authorization: `Bearer ${access}`
  }

  const router = useRouter()

  const fetchData = async (additional_param: string) => {
    if (!refresh) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
    }
    try {
      const processedLastWeekData = (await fetchQuestions(headers, 'last_week', additional_param)).processedData
      const processedOlderData = (await fetchQuestions(headers, 'older', additional_param)).processedData

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

  useEffect(() => {
    fetchData('?count=4')
  }, [])

  const handleSubmit = () => {
    router.push({
      pathname: router.pathname,
      query: { keyword: keyword }
    })

    fetchData(`search/?count=4&keyword=${keyword}`)
  }

  return (
    <MainLayout marginOverride='lg:mx-10 mx-0'>
      <div className='min-h-screen lg:m-12'>
        <h1 data-testid='history-title' className='text-2xl font-bold mb-4 text-center mt-7 mb-7'>
          Riwayat Analisis
        </h1>
        <SearchBar keyword={keyword} onSubmit={handleSubmit} onChange={(value) => setKeyword(value)}></SearchBar>
        {lastweek.length > 0 && (
          <Section
            title='7 hari terakhir'
            items={lastweek}
            seeMoreLink={'/history/lastWeek'}
            showModeButton={true}
            keyword={keyword}
            showDeleteButton={true}
          />
        )}
        {older.length > 0 && (
          <Section
            title='Lebih lama'
            items={older}
            seeMoreLink={'/history/pastWeek'}
            showModeButton={true}
            keyword={keyword}
            showDeleteButton={true}
          />
        )}
      </div>
    </MainLayout>
  )
}

export default History

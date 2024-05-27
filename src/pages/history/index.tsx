import React, { useState, useEffect } from 'react'
import MainLayout from '../../layout/MainLayout'
import Section from '../../components/sectionHistory'
import { Item } from 'components/types/historyPage'
import { logout, refreshToken } from '../../actions/auth'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { SearchBar } from '../../components/searchBar'
import { fetchQuestions } from '../../actions/fetchQuestions'
import { fetchFilters } from '../../actions/fetchFilters'
import { FilterData } from '../../components/types/filterData'

const History: React.FC = () => {
  const [lastweek, setLastWeek] = useState<Item[]>([])
  const [older, setOlder] = useState<Item[]>([])
  const [filter, setFilter] = useState<string>('semua')
  const [filterData, setFilterData] = useState<FilterData>()
  const [suggestion, setSuggestion] = useState<string[]>([])
  const [keyword, setKeyword] = useState<string>('')

  // istanbul ignore next
  const isAdmin = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('userData')!).is_staff : ''
  const access = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const headers = {
    Authorization: `Bearer ${access}`
  }

  const router = useRouter()

  const fetchData = async (additional_param: string) => {
    // istanbul ignore next
    if (!refresh) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
    }

    try {
      const processedLastWeekData = (await fetchQuestions(headers, 'last_week', additional_param)).processedData
      const processedOlderData = (await fetchQuestions(headers, 'older', additional_param)).processedData

      setLastWeek(processedLastWeekData)
      setOlder(processedOlderData)

      const processedFilterData = await fetchFilters(headers)
      // istanbul ignore next
      setFilterData(processedFilterData)
    } catch (error: any) {
      // istanbul ignore next
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

  const handleFilterSelect = (filter: string) => {
    // istanbul ignore next
    setFilter(filter)
    // istanbul ignore next
    if (filter == 'Pengguna') {
      setSuggestion(filterData!.pengguna)
    } else if (filter == 'Judul') {
      setSuggestion(filterData!.judul)
    } else if (filter == 'Topik') {
      setSuggestion(filterData!.topik)
    } else {
      setSuggestion([])
    }
  }

  const handleSubmit = () => {
    router.push({
      pathname: router.pathname,
      query: { keyword: keyword }
    })

    fetchData(`search/?filter=${filter}&count=4&keyword=${keyword}`)
  }

  return (
    <MainLayout marginOverride='lg:mx-10 mx-0'>
      <div className='min-h-screen lg:m-12'>
        <h1 data-testid='history-title' className='text-2xl font-bold mb-4 text-center mt-7 mb-7'>
          Riwayat Analisis
        </h1>
        <SearchBar
          isAdmin={isAdmin}
          publicAnalyses={false}
          keyword={keyword}
          suggestions={suggestion}
          onSelect={handleFilterSelect}
          onSubmit={handleSubmit}
          onChange={(value) => setKeyword(value)}
        ></SearchBar>
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

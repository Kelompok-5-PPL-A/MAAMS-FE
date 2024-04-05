import React, { useState, useEffect } from 'react'
import MainLayout from '../../../layout/MainLayout'
import Section from '../../../components/sectionHistory'
import Pagination from '../../../components/pagination'
import { Item } from 'components/types/historyPage'
import { useRouter } from 'next/router'
import { logout, refreshToken } from 'actions/auth'
import toast from 'react-hot-toast'
import { fetchQuestions } from 'actions/fetchQuestions'
import { SearchBar } from 'components/searchBar'

const LastWeekPublik: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  const [lastweek, setLastWeek] = useState<Item[]>([])
  const access = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const headers = {
    Authorization: `Bearer ${access}`
  }

  const [keyword, setKeyword] = useState<string>('')
  const router = useRouter()
  const [submitted, setSubmitted] = useState<boolean>(false)

  const fetchData = async (additional_param: string) => {
    try {
      const lastWeekData = await fetchQuestions(headers, 'last_week', additional_param)
      setLastWeek(lastWeekData.processedData)
      setTotalPages(Math.ceil(lastWeekData.count / 5))
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

  const handleSubmit = () => {
    setSubmitted(true)
    router.push({
      pathname: router.pathname,
      query: { keyword: keyword }
    })
  }

  useEffect(() => {
    const fetchDataBasedOnQuery = async () => {
      const { keyword } = router.query
      const page = submitted ? 1 : currentPage
      if (keyword && typeof keyword === 'string') {
        setKeyword(keyword)
        fetchData(`pengawasan/?count=5&keyword=${keyword}&p=${page}`)

        if (submitted) {
          setSubmitted(false)
          setCurrentPage(1)
        }
      } else {
        // Fetch default data when there's no keyword
        fetchData(`pengawasan/?count=5&p=${currentPage}`)
      }
    }

    fetchDataBasedOnQuery()
  }, [router.query, currentPage])

  return (
    <MainLayout>
      <div className='min-h-screen m-12'>
        <h1 data-testid='public-analysis-title' className='text-2xl font-bold mb-4 text-center mt-7 mb-7'>
          Analisis Publik
        </h1>
        <SearchBar keyword={keyword} onSubmit={handleSubmit} onChange={(value) => setKeyword(value)}></SearchBar>
        <Section title='7 hari terakhir' items={lastweek} showModeButton={false} keyword='' />
        {totalPages >= 1 && (
          <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages}></Pagination>
        )}
      </div>
    </MainLayout>
  )
}

export default LastWeekPublik

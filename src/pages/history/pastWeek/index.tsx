import React, { useState, useEffect } from 'react'
import MainLayout from '../../../layout/MainLayout'
import Section from '../../../components/sectionHistory'
import Pagination from '../../../components/pagination'
import { Item } from 'components/types/historyPage'
import { fetchQuestions } from 'actions/fetchQuestions'
import toast from 'react-hot-toast'
import { logout, refreshToken } from 'actions/auth'
import { SearchBar } from 'components/searchBar'
import { useRouter } from 'next/router'

const PastWeek: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  const [older, setOlder] = useState<Item[]>([])
  const [keyword, setKeyword] = useState<string>('')
  const access = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const headers = {
    Authorization: `Bearer ${access}`
  }
  const router = useRouter()

  const fetchData = async (additional_param: string) => {
    try {
      const pastWeekData = await fetchQuestions(headers, 'older', additional_param)
      setOlder(pastWeekData.processedData)
      setTotalPages(Math.ceil(pastWeekData.count / 5))
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
        fetchData(`search/?count=5&keyword=${keyword}&p=${page}`)

        if (submitted) {
          setSubmitted(false)
          setCurrentPage(1)
        }
      } else {
        // Fetch default data when there's no keyword
        fetchData(`?count=5&p=${currentPage}`)
      }
    }

    fetchDataBasedOnQuery()
  }, [router.query, currentPage])

  return (
    <MainLayout marginOverride='lg:mx-10 mx-0'>
      <div className='min-h-screen lg:m-12'>
        <h1 data-testid='history-title' className='text-2xl font-bold mb-4 text-center mt-7 mb-7'>
          Riwayat Analisis
        </h1>
        <SearchBar keyword={keyword} onSubmit={handleSubmit} onChange={(value) => setKeyword(value)}></SearchBar>
        <Section title='Lebih lama' items={older} showModeButton={true} showDeleteButton={true} keyword='' />
        {totalPages >= 1 && (
          <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages}></Pagination>
        )}
      </div>
    </MainLayout>
  )
}

export default PastWeek

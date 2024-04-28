import React, { useState, useEffect } from 'react'
import MainLayout from '../../layout/MainLayout'
import { Item } from 'components/types/historyPage'
import { logout, refreshToken } from '../../actions/auth'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { SearchBar } from '../../components/searchBar'
import { fetchQuestions } from '../../actions/fetchQuestions'
import AdminTable from '../../components/adminTable'
import Pagination from 'components/pagination'

const AnalisisPublik: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  const [data, setData] = useState<Item[]>([])
  const isAdmin = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('userData')!).is_staff : ''
  const access = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const headers = {
    Authorization: `Bearer ${access}`
  }
  const [filter, setFilter] = useState<string>('semua')
  const [keyword, setKeyword] = useState<string>('')
  const router = useRouter()

  const fetchData = async (additional_param: string) => {
    if (!refresh) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
    }
    try {
      //NOTE: This fetch function dummy for table
      const processedData = await fetchQuestions(headers, '', additional_param)
      setData(processedData.processedData)
      setTotalPages(Math.ceil(processedData.count / 5))
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
    fetchData('pengawasan/?count=5')
  }, [])

  const handleFilterSelect = (filter: string) => {
    setFilter(filter)
  }

  const handleSubmit = () => {
    router.push({
      pathname: router.pathname,
      query: { keyword: keyword }
    })

    fetchData(`pengawasan/?filter=${filter}&count=5&keyword=${keyword}`)
  }

  return (
    <MainLayout>
      <div className='min-h-screen m-12'>
        <h1 data-testid='public-analysis-title' className='text-2xl font-bold mb-4 text-center mt-7 mb-7'>
          Analisis Publik
        </h1>
        <SearchBar
          isAdmin={isAdmin}
          publicAnalyses={true}
          filter={filter}
          keyword={keyword}
          onSelect={handleFilterSelect}
          onSubmit={handleSubmit}
          onChange={(value) => setKeyword(value)}
        ></SearchBar>
        <AdminTable data={data} />
        {totalPages >= 1 && (
          <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages}></Pagination>
        )}
      </div>
    </MainLayout>
  )
}

export default AnalisisPublik

import React, { useState, useEffect } from 'react'
import MainLayout from '../../layout/MainLayout'
import { Item } from 'components/types/historyPage'
import { logout, refreshToken } from '../../actions/auth'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { SearchBar } from '../../components/searchBar'
import { fetchQuestions } from '../../actions/fetchQuestions'
import AdminTable from '../../components/adminTable'

const AnalisisPublik: React.FC = () => {
  const [older, setOlder] = useState<Item[]>([])

  const access = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const headers = {
    Authorization: `Bearer ${access}`
  }

  const [keyword, setKeyword] = useState<string>('')
  const router = useRouter()

  const fetchData = async (additional_param: string) => {
    if (!refresh) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
    }
    try {
      //NOTE: This fetch function dummy for table
      const processedOlderData = await fetchQuestions(headers, 'older', additional_param)
      setOlder(processedOlderData.processedData)
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
    fetchData('pengawasan/?count=3')
  }, [])

  const handleSubmit = () => {
    router.push({
      pathname: router.pathname,
      query: { keyword: keyword }
    })

    fetchData(`pengawasan/?count=3&keyword=${keyword}`)
  }

  return (
    <MainLayout>
      <div className='min-h-screen m-12'>
        <h1 data-testid='public-analysis-title' className='text-2xl font-bold mb-4 text-center mt-7 mb-7'>
          Analisis Publik
        </h1>
        <SearchBar keyword={keyword} onSubmit={handleSubmit} onChange={(value) => setKeyword(value)}></SearchBar>
        <AdminTable data={older} />
      </div>
    </MainLayout>
  )
}

export default AnalisisPublik

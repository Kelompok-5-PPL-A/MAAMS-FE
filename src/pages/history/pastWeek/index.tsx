import React, { useState, useEffect } from 'react'
import MainLayout from '../../../layout/MainLayout'
import Section from '../../../components/sectionHistory'
import Pagination from '../../../components/pagination'
import { Item } from 'components/types/historyPage'
import axios from 'axios'
import { formatTimestamp } from '../../../utils/dateFormatter'
import router from 'next/router'
import toast from 'react-hot-toast'
import { logout, refreshToken } from 'actions/auth'

const PastWeek: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState<number>(1) // Jumlah total halaman diinisialisasi dengan 1
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  const [older, setOlder] = useState<Item[]>([])
  const access = typeof window !== 'undefined' ? window.localStorage.getItem('access') : ''
  const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refresh') : ''
  const headers = {
    Authorization: `Bearer ${access}`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lastWeekResponse = await axios({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/validator/?count=5&p=${currentPage}`,
          withCredentials: false,
          headers: headers
        })

        const lastWeekData = lastWeekResponse.data

        // Process the data
        const processedLastWeekData = lastWeekData.results.map((item: any) => ({
          title: item.question,
          timestamp: formatTimestamp(item.created_at),
          mode: item.mode,
          user: item.username
        }))

        // Set the entire history data
        setOlder(processedLastWeekData)
        // Set total pages based on count
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

    fetchData()
  }, [currentPage]) // Update data fetching when currentPage changes

  return (
    <MainLayout>
      <div className='min-h-screen m-12'>
        <h1 data-testid='history-title' className='text-2xl font-bold mb-4 text-center mt-7 mb-7'>
          Riwayat Analisis
        </h1>
        <Section title='7 hari terakhir' items={older} showModeButton={true} />
        {totalPages >= 1 && (
          <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages}></Pagination>
        )}
      </div>
    </MainLayout>
  )
}

export default PastWeek

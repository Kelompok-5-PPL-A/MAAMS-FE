import React from 'react'
import { Item } from 'components/types/adminTable'

interface Props {
  data: Item[]
}

const AdminTable: React.FC<Props> = ({ data }) => {
  return (
    <div className='relative overflow-x-auto shadow-md m-12'>
      <table className='w-full text-sm text-left text-black border-collapse'>
        <thead className='text-xs uppercase bg-[#FBC707] text-black'>
          <tr>
            <th scope='col' className='px-6 py-3 w-1/5'>
              Judul
            </th>
            <th scope='col' className='px-6 py-3 w-1/5'>
              Pengguna
            </th>
            <th scope='col' className='px-6 py-3 w-1/5'>
              Topik
            </th>
            <th scope='col' className='px-6 py-3 w-1/5'>
              Waktu
            </th>
            <th scope='col' className='px-6 py-3 w-1/5'>
              <span className='sr-only'>Lihat</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ title, user, timestamp }, index) => (
            <tr key={index} className='bg-white hover:bg-gray-200 border border-[#FBC707] text-xs'>
              <td className='px-6 py-4 border-b border-b-[#FBC707] truncate '>{title}</td>
              <td className='px-6 py-4 border-b border-b-[#FBC707] truncate '>{user}</td>
              <td className='px-6 py-4 border-b border-b-[#FBC707] flex justify-start'>
                <button className='bg-[#FBC707] text-black px-3 py-3 rounded-3xl text-xs font-bold mr-3'>Tags 1</button>
                <button className='bg-[#FBC707] text-black px-3 py-3 rounded-3xl text-xs font-bold mr-3'>Tags 1</button>
                <button className='bg-[#FBC707] text-black px-3 py-3 rounded-3xl text-xs font-bold mr-3'>Tags 1</button>
              </td>
              <td className='px-6 py-4 border-b border-b-[#FBC707]'>{timestamp}</td>
              <td className='px-6 py-4 text-right border-b border-b-[#FBC707]'>
                <a href='#' className='text-blue-600 hover:underline'>
                  Lihat
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable

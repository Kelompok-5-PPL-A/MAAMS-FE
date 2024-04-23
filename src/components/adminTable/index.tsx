import React from 'react'
import { Item } from 'components/types/adminTable'

interface Props {
  data: Item[]
}

const AdminTable: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Judul</th>
            <th>Pengguna</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable

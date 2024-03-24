import React from 'react'
import { SectionHistoryProps } from '../types/sectionHistory' // Koreksi impor definisi antarmuka
import ItemListHistory from '../itemListHistory' // Koreksi impor komponen

const SectionHistory: React.FC<SectionHistoryProps> = ({ title, items }) => {
  return (
    <div>
      <h1>{title}</h1>
      {items.map((item, index) => (
        <ItemListHistory
          key={index} // Perhatikan penggunaan index sebagai key, sebaiknya gunakan id unik jika tersedia
          title={item.title}
          timestamp={item.timestamp}
          mode={item.mode}
        />
      ))}
    </div>
  )
}

export default SectionHistory

import React from 'react'
import { ItemListHistoryProps } from '../types/itemListHistory' // Koreksi impor definisi antarmuka

const ItemListHistory: React.FC<ItemListHistoryProps> = ({ title, timestamp, mode }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{timestamp}</p>
      <p>{mode}</p>
    </div>
  )
}
ItemListHistory.displayName = 'ItemListHistory'

export default ItemListHistory

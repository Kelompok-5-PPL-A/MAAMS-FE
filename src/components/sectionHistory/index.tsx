import React from 'react'
import ListItem from '../itemListHistory'
import { SectionHistoryProps } from '../types/sectionHistory'

const Section: React.FC<SectionHistoryProps> = ({ title, items }) => {
  return (
    <ul data-testid={`${title}-section`} role={title} className='divide-yellow-300 m-12'>
      <div className='flex justify-between'>
        <h2 className='text-sm font-bold mb-4 mt-7 mb-6'>{title}</h2>
        <a href='#' className='text-blue-400 text-sm mb-4 mt-7 mb-6'>
          See More
        </a>
      </div>
      {items.map((item, index) => (
        <ListItem key={index} title={item.title} timestamp={item.timestamp} mode={item.mode} />
      ))}
    </ul>
  )
}

Section.displayName = 'Section'

export default Section

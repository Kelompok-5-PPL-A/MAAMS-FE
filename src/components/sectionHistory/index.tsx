import React from 'react'
import ListItem from '../itemListHistory'
import { SectionHistoryProps } from '../types/sectionHistory'
import router from 'next/router'

const Section: React.FC<
  SectionHistoryProps & { seeMoreLink?: string; showModeButton?: boolean; showDeleteButton?: boolean }
> = ({ title, items, seeMoreLink, showModeButton, keyword, showDeleteButton }) => {
  const handleSeeMore = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push({
      pathname: seeMoreLink,
      query: { keyword: encodeURIComponent(keyword) } // Pass keyword as query parameter
    })
  }

  console.log(items)

  return (
    <ul data-testid={`${title}-section`} role={title} className='divide-yellow-300 m-12'>
      <div className='flex justify-between'>
        <h2 className='text-sm font-bold mb-4 mt-7 mb-6'>{title}</h2>
        {seeMoreLink && (
          <a href={seeMoreLink} onClick={handleSeeMore} className='text-blue-400 text-sm mb-4 mt-7 mb-6'>
            See More
          </a>
        )}
      </div>
      {items.map((item, index) => (
        <ListItem
          idQuestion={item.id}
          key={index}
          title={item.title}
          timestamp={item.timestamp}
          mode={item.mode}
          user={item.user}
          showModeButton={showModeButton}
          showDeleteButton={showDeleteButton}
        />
      ))}
    </ul>
  )
}

export default Section

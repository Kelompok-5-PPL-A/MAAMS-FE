import React from 'react'

export const TagsGroup: React.FC<tagsGroupsProps> = ({ tags = [] }) => {
  return (
    <div className='flex flex-wrap gap-2'>
      {tags.map((tag, index) => (
        <span key={index} className='h-8 p-4 bg-yellow-400 rounded-2xl justify-center items-center gap-0.5 inline-flex'>
          {tag}
        </span>
      ))}
    </div>
  )
}

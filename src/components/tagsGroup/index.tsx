import { Badge } from '../../components/badge'
import React from 'react'

export const TagsGroup: React.FC<tagsGroupsProps> = ({ tags = [] }) => {
  return (
    <div className='flex flex-wrap gap-2'>
      {tags.map((tag, index) => (
        <Badge key={index} text={tag} isRemovable={false} />
      ))}
    </div>
  )
}

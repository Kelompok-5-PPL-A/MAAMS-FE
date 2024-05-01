import React from 'react'
import { render, screen } from '@testing-library/react'
import { TagsGroup } from '../../components/tagsGroup'

describe('TagsGroup', () => {
  it('displays each tag correctly', () => {
    const tags = ['React', 'Node']
    render(<TagsGroup tags={tags} />)
    expect(screen.getByText('React')).toBeInTheDocument
    expect(screen.getByText('Node')).toBeInTheDocument
  })
})

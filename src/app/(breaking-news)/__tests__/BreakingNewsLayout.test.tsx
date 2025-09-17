import { render } from '@testing-library/react-native'
import React from 'react'

import BreakingNewsLayout from '@/app/(breaking-news)/_layout'

describe('BreakingNewsLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<BreakingNewsLayout />)
  })
})

describe('BreakingNewsLayout Snapshot', () => {
  it('should render the BreakingNewsLayout successfully', () => {
    const { toJSON } = render(<BreakingNewsLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

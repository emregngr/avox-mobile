import { render } from '@testing-library/react-native'
import React from 'react'

import DiscoverLayout from '@/app/(tabs)/discover/_layout'

describe('DiscoverLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<DiscoverLayout />)
  })
})

describe('DiscoverLayout Snapshot', () => {
  it('should render the DiscoverLayout successfully', () => {
    const { toJSON } = render(<DiscoverLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

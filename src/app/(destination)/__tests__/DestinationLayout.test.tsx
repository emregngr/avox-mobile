import { render } from '@testing-library/react-native'
import React from 'react'

import DestinationLayout from '@/app/(destination)/_layout'

describe('DestinationLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<DestinationLayout />)
  })
})

describe('DestinationLayout Snapshot', () => {
  it('should render the DestinationLayout successfully', () => {
    const { toJSON } = render(<DestinationLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

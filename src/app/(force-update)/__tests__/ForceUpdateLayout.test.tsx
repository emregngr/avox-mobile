import { render } from '@testing-library/react-native'
import React from 'react'

import ForceUpdateLayout from '@/app/(force-update)/_layout'

describe('ForceUpdateLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<ForceUpdateLayout />)
  })
})

describe('ForceUpdateLayout Snapshot', () => {
  it('should render the ForceUpdateLayout successfully', () => {
    const { toJSON } = render(<ForceUpdateLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

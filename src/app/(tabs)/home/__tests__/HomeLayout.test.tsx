import { render } from '@testing-library/react-native'
import React from 'react'

import HomeLayout from '@/app/(tabs)/home/_layout'

describe('HomeLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<HomeLayout />)
  })
})

describe('HomeLayout Snapshot', () => {
  it('should render the HomeLayout successfully', () => {
    const { toJSON } = render(<HomeLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

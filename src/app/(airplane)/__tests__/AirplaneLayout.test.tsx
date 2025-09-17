import { render } from '@testing-library/react-native'
import React from 'react'

import AirplaneLayout from '@/app/(airplane)/_layout'

describe('AirplaneLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<AirplaneLayout />)
  })
})

describe('AirplaneLayout Snapshot', () => {
  it('should render the AirplaneLayout successfully', () => {
    const { toJSON } = render(<AirplaneLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

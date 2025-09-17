import { render } from '@testing-library/react-native'
import React from 'react'

import AirlineLayout from '@/app/(airline)/_layout'

describe('AirlineLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<AirlineLayout />)
  })
})

describe('AirlineLayout Snapshot', () => {
  it('should render the AirlineLayout successfully', () => {
    const { toJSON } = render(<AirlineLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

import { render } from '@testing-library/react-native'
import React from 'react'

import AirportLayout from '@/app/(airport)/_layout'

describe('AirportLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<AirportLayout />)
  })
})

describe('AirportLayout Snapshot', () => {
  it('should render the AirportLayout successfully', () => {
    const { toJSON } = render(<AirportLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

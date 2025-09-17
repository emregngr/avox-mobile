import { render } from '@testing-library/react-native'
import React from 'react'

import AccountLayout from '@/app/(account)/_layout'

describe('AccountLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<AccountLayout />)
  })
})

describe('AccountLayout Snapshot', () => {
  it('should render the AccountLayout successfully', () => {
    const { toJSON } = render(<AccountLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

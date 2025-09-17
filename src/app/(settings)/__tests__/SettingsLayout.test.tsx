import { render } from '@testing-library/react-native'
import React from 'react'

import SettingsLayout from '@/app/(settings)/_layout'

describe('SettingsLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<SettingsLayout />)
  })
})

describe('SettingsLayout Snapshot', () => {
  it('should render the SettingsLayout successfully', () => {
    const { toJSON } = render(<SettingsLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

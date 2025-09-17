import { render } from '@testing-library/react-native'
import React from 'react'

import MaintenanceLayout from '@/app/(maintenance)/_layout'

describe('MaintenanceLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<MaintenanceLayout />)
  })
})

describe('MaintenanceLayout Snapshot', () => {
  it('should render the MaintenanceLayout successfully', () => {
    const { toJSON } = render(<MaintenanceLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

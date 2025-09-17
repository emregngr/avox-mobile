import { render } from '@testing-library/react-native'
import React from 'react'

import ProfileLayout from '@/app/(tabs)/profile/_layout'

describe('ProfileLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<ProfileLayout />)
  })
})

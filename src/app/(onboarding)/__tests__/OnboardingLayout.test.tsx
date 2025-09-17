import { render } from '@testing-library/react-native'
import React from 'react'

import OnboardingLayout from '@/app/(onboarding)/_layout'

describe('OnboardingLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<OnboardingLayout />)
  })
})

describe('OnboardingLayout Snapshot', () => {
  it('should render the OnboardingLayout successfully', () => {
    const { toJSON } = render(<OnboardingLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

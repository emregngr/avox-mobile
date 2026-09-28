import { render } from '@testing-library/react-native'

import OnboardingLayout from '@/app/(onboarding)/_layout'

describe('OnboardingLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<OnboardingLayout />)
  })
})

describe('OnboardingLayout Snapshot', () => {
  it('should render the OnboardingLayout successfully', async () => {
    const { toJSON } = await render(<OnboardingLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

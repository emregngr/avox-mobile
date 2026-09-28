import { render } from '@testing-library/react-native'

import DiscoverLayout from '@/app/(tabs)/discover/_layout'

describe('DiscoverLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<DiscoverLayout />)
  })
})

describe('DiscoverLayout Snapshot', () => {
  it('should render the DiscoverLayout successfully', async () => {
    const { toJSON } = await render(<DiscoverLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

import { render } from '@testing-library/react-native'

import HomeLayout from '@/app/(tabs)/home/_layout'

describe('HomeLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<HomeLayout />)
  })
})

describe('HomeLayout Snapshot', () => {
  it('should render the HomeLayout successfully', async () => {
    const { toJSON } = await render(<HomeLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

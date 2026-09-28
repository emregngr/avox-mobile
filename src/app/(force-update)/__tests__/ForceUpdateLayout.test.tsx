import { render } from '@testing-library/react-native'

import ForceUpdateLayout from '@/app/(force-update)/_layout'

describe('ForceUpdateLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<ForceUpdateLayout />)
  })
})

describe('ForceUpdateLayout Snapshot', () => {
  it('should render the ForceUpdateLayout successfully', async () => {
    const { toJSON } = await render(<ForceUpdateLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

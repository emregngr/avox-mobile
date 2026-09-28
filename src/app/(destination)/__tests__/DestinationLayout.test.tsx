import { render } from '@testing-library/react-native'

import DestinationLayout from '@/app/(destination)/_layout'

describe('DestinationLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<DestinationLayout />)
  })
})

describe('DestinationLayout Snapshot', () => {
  it('should render the DestinationLayout successfully', async () => {
    const { toJSON } = await render(<DestinationLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

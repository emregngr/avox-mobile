import { render } from '@testing-library/react-native'

import AirplaneLayout from '@/app/(airplane)/_layout'

describe('AirplaneLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<AirplaneLayout />)
  })
})

describe('AirplaneLayout Snapshot', () => {
  it('should render the AirplaneLayout successfully', async () => {
    const { toJSON } = await render(<AirplaneLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

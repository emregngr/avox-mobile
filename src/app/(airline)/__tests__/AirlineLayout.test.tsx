import { render } from '@testing-library/react-native'

import AirlineLayout from '@/app/(airline)/_layout'

describe('AirlineLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<AirlineLayout />)
  })
})

describe('AirlineLayout Snapshot', () => {
  it('should render the AirlineLayout successfully', async () => {
    const { toJSON } = await render(<AirlineLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

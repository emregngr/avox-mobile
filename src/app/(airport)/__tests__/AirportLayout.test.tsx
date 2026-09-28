import { render } from '@testing-library/react-native'

import AirportLayout from '@/app/(airport)/_layout'

describe('AirportLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<AirportLayout />)
  })
})

describe('AirportLayout Snapshot', () => {
  it('should render the AirportLayout successfully', async () => {
    const { toJSON } = await render(<AirportLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

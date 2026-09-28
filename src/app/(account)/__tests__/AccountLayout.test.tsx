import { render } from '@testing-library/react-native'

import AccountLayout from '@/app/(account)/_layout'

describe('AccountLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<AccountLayout />)
  })
})

describe('AccountLayout Snapshot', () => {
  it('should render the AccountLayout successfully', async () => {
    const { toJSON } = await render(<AccountLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

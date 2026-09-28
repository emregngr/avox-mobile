import { render } from '@testing-library/react-native'

import SettingsLayout from '@/app/(settings)/_layout'

describe('SettingsLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<SettingsLayout />)
  })
})

describe('SettingsLayout Snapshot', () => {
  it('should render the SettingsLayout successfully', async () => {
    const { toJSON } = await render(<SettingsLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

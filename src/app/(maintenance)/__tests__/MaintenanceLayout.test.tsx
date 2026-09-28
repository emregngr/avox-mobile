import { render } from '@testing-library/react-native'

import MaintenanceLayout from '@/app/(maintenance)/_layout'

describe('MaintenanceLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<MaintenanceLayout />)
  })
})

describe('MaintenanceLayout Snapshot', () => {
  it('should render the MaintenanceLayout successfully', async () => {
    const { toJSON } = await render(<MaintenanceLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

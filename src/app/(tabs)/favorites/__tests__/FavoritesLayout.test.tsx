import { render } from '@testing-library/react-native'

import FavoritesLayout from '@/app/(tabs)/favorites/_layout'

describe('FavoritesLayout', () => {
  it('should render the Slot component successfully', async () => {
    await render(<FavoritesLayout />)
  })
})

describe('FavoritesLayout Snapshot', () => {
  it('should render the FavoritesLayout successfully', async () => {
    const { toJSON } = await render(<FavoritesLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

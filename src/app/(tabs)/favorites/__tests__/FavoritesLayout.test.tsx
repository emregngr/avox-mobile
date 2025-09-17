import { render } from '@testing-library/react-native'
import React from 'react'

import FavoritesLayout from '@/app/(tabs)/favorites/_layout'

describe('FavoritesLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<FavoritesLayout />)
  })
})

describe('FavoritesLayout Snapshot', () => {
  it('should render the FavoritesLayout successfully', () => {
    const { toJSON } = render(<FavoritesLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

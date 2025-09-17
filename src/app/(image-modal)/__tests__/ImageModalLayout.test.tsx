import { render } from '@testing-library/react-native'
import React from 'react'

import ImageModalLayout from '@/app/(image-modal)/_layout'

describe('ImageModalLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<ImageModalLayout />)
  })
})

describe('ImageModalLayout Snapshot', () => {
  it('should render the ImageModalLayout successfully', () => {
    const { toJSON } = render(<ImageModalLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

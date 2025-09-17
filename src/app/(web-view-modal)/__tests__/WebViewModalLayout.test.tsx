import { render } from '@testing-library/react-native'
import React from 'react'

import WebViewModalLayout from '@/app/(web-view-modal)/_layout'

describe('WebViewModalLayout', () => {
  it('should render the Slot component successfully', () => {
    render(<WebViewModalLayout />)
  })
})

describe('WebViewModalLayout Snapshot', () => {
  it('should render the WebViewModalLayout successfully', () => {
    const { toJSON } = render(<WebViewModalLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

import { render } from '@testing-library/react-native'
import React from 'react'

import Index from '@/app/index'

jest.mock('@/components/common', () => {
  const { View } = require('react-native')

  return {
    FullScreenLoading: (props: any) => <View {...props} testID="full-screen-loading" />,
  }
})

describe('Index Screen', () => {
  it('should render the FullScreenLoading component', () => {
    const { getByTestId } = render(<Index />)

    const loadingComponent = getByTestId('full-screen-loading')
    expect(loadingComponent).toBeTruthy()
  })
})

describe('Index Screen Snapshot', () => {
  it('should render the Index Screen successfully', () => {
    const { toJSON } = render(<Index />)

    expect(toJSON()).toMatchSnapshot()
  })
})

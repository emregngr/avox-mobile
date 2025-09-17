import { render } from '@testing-library/react-native'
import React from 'react'

import { FullScreenLoading } from '@/components/common/FullScreenLoading'

describe('FullScreenLoading Component', () => {
  it('renders loading container and indicator', () => {
    const { getByTestId } = render(<FullScreenLoading />)

    expect(getByTestId('full-screen-loading')).toBeTruthy()
    expect(getByTestId('loading-indicator')).toBeTruthy()
  })

  it('has correct accessibility properties', () => {
    const { getByTestId } = render(<FullScreenLoading />)

    const loadingIndicator = getByTestId('loading-indicator')

    expect(loadingIndicator.props.size).toBe('large')
    expect(loadingIndicator.props.className).toBe('color-text-100')
  })

  it('container has correct styling', () => {
    const { getByTestId } = render(<FullScreenLoading />)

    const container = getByTestId('full-screen-loading')
    expect(container.props.className).toBe(
      'flex-1 items-center justify-center bg-background-primary',
    )
  })

  it('renders ActivityIndicator as loading state', () => {
    const { getByTestId } = render(<FullScreenLoading />)

    const indicator = getByTestId('loading-indicator')

    expect(indicator.props.animating).not.toBe(false)
  })
})

describe('FullScreenLoading Component Snapshot', () => {
  it('should render the FullScreenLoading Component successfully', () => {
    const { toJSON } = render(<FullScreenLoading />)

    expect(toJSON()).toMatchSnapshot()
  })
})

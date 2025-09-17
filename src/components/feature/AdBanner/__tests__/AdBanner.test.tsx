import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { AdBanner } from '@/components/feature/AdBanner'

jest.mock('react-native-google-mobile-ads', () => {
  const { TouchableOpacity } = require('react-native')

  return {
    BannerAd: ({
      onAdLoaded,
      onAdFailedToLoad,
    }: {
      onAdLoaded: () => void
      onAdFailedToLoad: () => void
    }) => (
      <>
        <TouchableOpacity onPress={onAdLoaded} testID="mocked-banner-ad-load" />
        <TouchableOpacity onPress={onAdFailedToLoad} testID="mocked-banner-ad-fail" />
      </>
    ),

    BannerAdSize: {
      ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
    },
  }
})

jest.mock('@/config/env/environment', () => ({
  isProduction: () => true,
}))

const mockedAdUnitId = 'test-ad-unit'

describe('AdBanner Component', () => {
  it('does not render in dev mode', () => {
    __DEV__ = true
    const { toJSON } = render(<AdBanner adUnitId={mockedAdUnitId} />)
    expect(toJSON()).toBeNull()
  })

  it('renders in production mode', () => {
    __DEV__ = false
    const { getByTestId } = render(<AdBanner adUnitId={mockedAdUnitId} />)
    expect(getByTestId('mocked-banner-ad-load')).toBeTruthy()
  })

  it('sets isAdLoaded=true when ad loads', () => {
    __DEV__ = false
    const { getByTestId } = render(<AdBanner adUnitId={mockedAdUnitId} />)

    fireEvent.press(getByTestId('mocked-banner-ad-load'))

    expect(getByTestId('ad-banner-container').props.className).toContain('h-auto')
  })

  it('sets isAdLoaded=false when ad fails', () => {
    __DEV__ = false
    const { getByTestId } = render(<AdBanner adUnitId={mockedAdUnitId} />)

    fireEvent.press(getByTestId('mocked-banner-ad-fail'))

    expect(getByTestId('ad-banner-container').props.className).toContain('h-0')
  })
})

describe('AdBanner Component Snapshot', () => {
  it('should render the AdBanner Component successfully', () => {
    const { toJSON } = render(<AdBanner adUnitId={mockedAdUnitId} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

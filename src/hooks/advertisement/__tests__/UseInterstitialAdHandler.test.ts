import { act, renderHook } from '@testing-library/react-native'
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads'

import { isProduction } from '@/config/env/environment'
import { useInterstitialAdHandler } from '@/hooks/advertisement/useInterstitialAdHandler'

const { mockedInterstitialAdInstance } = require('react-native-google-mobile-ads')

jest.mock('@/config/env/environment')

const mockedIsProduction = isProduction as jest.MockedFunction<typeof isProduction>

const mockedCreateForAdRequest = InterstitialAd.createForAdRequest as jest.MockedFunction<
  typeof InterstitialAd.createForAdRequest
>

const mockedUnsubscribeLoaded = jest.fn()
const mockedUnsubscribeClosed = jest.fn()
const mockedUnsubscribeError = jest.fn()

const mockedAdUnitId = 'test-ad-unit-id'

let loadedCallback: () => void

beforeEach(() => {
  mockedCreateForAdRequest.mockReturnValue(mockedInterstitialAdInstance)

  mockedInterstitialAdInstance.addAdEventListener.mockImplementation(
    (event: string, callback: () => void) => {
      if (event === AdEventType.LOADED) {
        loadedCallback = callback
        return mockedUnsubscribeLoaded
      }
      if (event === AdEventType.CLOSED) {
        return mockedUnsubscribeClosed
      }
      if (event === AdEventType.ERROR) {
        return mockedUnsubscribeError
      }
      return jest.fn()
    },
  )
})

describe('useInterstitialAdHandler', () => {
  describe('when in a production build', () => {
    const originalDev = __DEV__

    beforeAll(() => {
      __DEV__ = false
    })

    afterAll(() => {
      __DEV__ = originalDev
    })

    it('should create, load, and show an ad in a production environment', () => {
      mockedIsProduction.mockReturnValue(true)

      const { result } = renderHook(() => useInterstitialAdHandler({ adUnitId: mockedAdUnitId }))

      act(() => {
        result.current.showInterstitialAd()
      })

      expect(mockedCreateForAdRequest).toHaveBeenCalledWith(mockedAdUnitId, expect.any(Object))
      expect(mockedInterstitialAdInstance.load).toHaveBeenCalledTimes(1)
      expect(mockedInterstitialAdInstance.addAdEventListener).toHaveBeenCalledWith(
        AdEventType.LOADED,
        expect.any(Function),
      )
      expect(mockedInterstitialAdInstance.show).not.toHaveBeenCalled()

      act(() => {
        if (loadedCallback) {
          loadedCallback()
        }
      })

      expect(mockedInterstitialAdInstance.show).toHaveBeenCalledTimes(1)
    })
  })

  it('should not load an ad in a development environment', () => {
    mockedIsProduction.mockReturnValue(false)

    const { result } = renderHook(() => useInterstitialAdHandler({ adUnitId: mockedAdUnitId }))

    act(() => {
      result.current.showInterstitialAd()
    })

    expect(mockedCreateForAdRequest).toHaveBeenCalledTimes(1)
    expect(mockedInterstitialAdInstance.load).not.toHaveBeenCalled()
  })

  it('should clean up event listeners when the component unmounts', () => {
    const { result, unmount } = renderHook(() =>
      useInterstitialAdHandler({ adUnitId: mockedAdUnitId }),
    )

    act(() => {
      result.current.showInterstitialAd()
    })

    expect(mockedInterstitialAdInstance.addAdEventListener).toHaveBeenCalledWith(
      AdEventType.LOADED,
      expect.any(Function),
    )
    expect(mockedInterstitialAdInstance.addAdEventListener).toHaveBeenCalledWith(
      AdEventType.CLOSED,
      expect.any(Function),
    )
    expect(mockedInterstitialAdInstance.addAdEventListener).toHaveBeenCalledWith(
      AdEventType.ERROR,
      expect.any(Function),
    )

    unmount()

    expect(mockedUnsubscribeLoaded).toHaveBeenCalledTimes(1)
    expect(mockedUnsubscribeClosed).toHaveBeenCalledTimes(1)
    expect(mockedUnsubscribeError).toHaveBeenCalledTimes(1)
  })
})

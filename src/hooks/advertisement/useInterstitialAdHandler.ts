import { useCallback, useEffect, useRef } from 'react'
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads'

const DEFAULT_KEYWORDS = [
  'cheap flights',
  'flight tickets',
  'airline tickets',
  'flight booking',
  'business travel',
  'travel deals',
  'last minute flights',
  'weekend flights',
  'international flights',
  'travel insurance',
  'aviation',
  'air cargo',
  'hotel booking',
  'car rental',
  'travel apps',
]

interface InterstitialAdHandler {
  adUnitId: string
}

export const useInterstitialAdHandler = ({ adUnitId }: InterstitialAdHandler) => {
  const cleanupFunctionsRef = useRef<(() => void)[]>([])

  useEffect(() => () => {
      cleanupFunctionsRef.current.forEach(cleanup => cleanup())
      cleanupFunctionsRef.current = []
    }, [])

  const showInterstitialAd = useCallback(() => {
    const requestOptions = {
      keywords: DEFAULT_KEYWORDS,
      requestNonPersonalizedAdsOnly: true,
    }

    const interstitial = InterstitialAd.createForAdRequest(adUnitId, requestOptions)

    interstitial.load()

    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show()
    })

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {})

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, () => {})

    const cleanup = () => {
      unsubscribeLoaded()
      unsubscribeClosed()
      unsubscribeError()
    }

    cleanupFunctionsRef.current.push(cleanup)

    const cleanupWithTimeout = () => {
      cleanup()
    }

    cleanupFunctionsRef.current[cleanupFunctionsRef.current.length - 1] = cleanupWithTimeout
  }, [adUnitId])

  return {
    showInterstitialAd,
  }
}

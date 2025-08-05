import { useCallback, useEffect, useRef } from 'react'
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads'

import { AD_KEYWORDS } from '@/constants/adKeywords'

interface InterstitialAdHandler {
  adUnitId: string
}

export const useInterstitialAdHandler = ({ adUnitId }: InterstitialAdHandler) => {
  const cleanupFunctionsRef = useRef<(() => void)[]>([])

  useEffect(
    () => () => {
      cleanupFunctionsRef.current.forEach(cleanup => cleanup())
      cleanupFunctionsRef.current = []
    },
    [],
  )

  const showInterstitialAd = useCallback(() => {
    const requestOptions = {
      keywords: AD_KEYWORDS,
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

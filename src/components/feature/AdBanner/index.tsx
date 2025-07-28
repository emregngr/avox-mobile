import React, { memo, useState } from 'react'
import { Platform, View } from 'react-native'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/utils/common/cn'

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

interface AdBannerProps {
  adUnitId: string
}

export const AdBanner = memo(({ adUnitId }: AdBannerProps) => {
  const [isAdLoaded, setIsAdLoaded] = useState<boolean>(false)

  const requestOptions = {
    keywords: DEFAULT_KEYWORDS,
    requestNonPersonalizedAdsOnly: true,
  }

  const handleAdLoaded = () => {
    setIsAdLoaded(true)
  }

  const handleAdFailedToLoad = () => {
    setIsAdLoaded(false)
  }

  const insets = useSafeAreaInsets()

  const paddingBottom = Platform.OS === 'ios' ? 20 : insets.bottom

  return (
    <View
      className={cn('bg-background-primary', isAdLoaded ? 'h-auto' : 'h-0')}
      style={{ paddingBottom }}
    >
      <BannerAd
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdLoaded={handleAdLoaded}
        requestOptions={requestOptions}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        unitId={adUnitId}
      />
    </View>
  )
})

AdBanner.displayName = 'AdBanner'

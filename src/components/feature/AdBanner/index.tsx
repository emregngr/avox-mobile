import React, { memo, useState } from 'react'
import { View } from 'react-native'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { isProduction } from '@/config/env/environment'
import { AD_KEYWORDS } from '@/constants/adKeywords'
import { cn } from '@/utils/common/cn'

interface AdBannerProps {
  adUnitId: string
}

export const AdBanner = memo(({ adUnitId }: AdBannerProps) => {
  const { bottom } = useSafeAreaInsets()

  const [isAdLoaded, setIsAdLoaded] = useState<boolean>(false)

  const requestOptions = {
    keywords: AD_KEYWORDS,
    requestNonPersonalizedAdsOnly: true,
  }

  const handleAdLoaded = () => {
    setIsAdLoaded(true)
  }

  const handleAdFailedToLoad = () => {
    setIsAdLoaded(false)
  }

  return !__DEV__ && isProduction() ? (
    <View
      className={cn('bg-background-primary', isAdLoaded ? 'h-auto' : 'h-0')}
      style={{ paddingBottom: bottom }}
      testID="ad-banner-container"
    >
      <BannerAd
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdLoaded={handleAdLoaded}
        requestOptions={requestOptions}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        unitId={adUnitId}
      />
    </View>
  ) : null
})

AdBanner.displayName = 'AdBanner'

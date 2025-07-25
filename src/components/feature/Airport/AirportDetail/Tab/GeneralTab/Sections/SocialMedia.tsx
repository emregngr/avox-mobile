import React, { useCallback, useMemo } from 'react'
import { Linking, View } from 'react-native'

import InstagramIcon from '@/assets/icons/instagram.svg'
import LinkedinIcon from '@/assets/icons/linkedin.svg'
import TiktokIcon from '@/assets/icons/tiktok.svg'
import XIcon from '@/assets/icons/x.svg'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airport } from '@/types/feature/airport'

interface SocialMediaProps {
  airportInfo: Airport['airportInfo']
}

export const SocialMedia = ({ airportInfo }: SocialMediaProps) => {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])
  const { socialMedia: { instagram, linkedin, tiktok, x } = {} } = airportInfo || {}

  const handleSocialMediaPress = useCallback(async (url: string) => {
    await Linking?.openURL(url)
  }, [])

  const localeStrings = useMemo(
    () => ({
      socialMedia: getLocale('socialMedia'),
    }),
    [selectedLocale],
  )

  const socialMediaIcons = useMemo(
    () => (
      <View className="flex-row items-center justify-evenly mt-2">
        {instagram && (
          <InstagramIcon
            color={colors?.onPrimary100}
            height={36}
            onPress={() => handleSocialMediaPress(instagram)}
            width={36}
          />
        )}

        {tiktok && (
          <TiktokIcon
            color={colors?.onPrimary100}
            height={36}
            onPress={() => handleSocialMediaPress(tiktok)}
            width={36}
          />
        )}

        {x && (
          <XIcon
            color={colors?.onPrimary100}
            height={36}
            onPress={() => handleSocialMediaPress(x)}
            width={36}
          />
        )}

        {linkedin && (
          <LinkedinIcon
            color={colors?.onPrimary100}
            height={36}
            onPress={() => handleSocialMediaPress(linkedin)}
            width={36}
          />
        )}
      </View>
    ),
    [colors?.onPrimary100, handleSocialMediaPress, instagram, tiktok, x, linkedin],
  )

  if (!instagram && !tiktok && !x && !linkedin) return null

  return <AirportSectionRow title={localeStrings.socialMedia}>{socialMediaIcons}</AirportSectionRow>
}

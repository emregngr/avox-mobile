import * as Linking from 'expo-linking'
import React, { useCallback, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import InstagramIcon from '@/assets/icons/instagram.svg'
import LinkedinIcon from '@/assets/icons/linkedin.svg'
import TiktokIcon from '@/assets/icons/tiktok.svg'
import XIcon from '@/assets/icons/x.svg'
import { AirlineSectionRow } from '@/components/feature/Airline/AirlineDetail/AirlineSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { AirlineType } from '@/types/feature/airline'

interface SocialMediaProps {
  companyInfo: AirlineType['companyInfo']
}

export const SocialMedia = ({ companyInfo }: SocialMediaProps) => {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { socialMedia: { instagram, linkedin, tiktok, x } = {} } = companyInfo ?? {}

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
        {instagram ? (
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={10}
            onPress={() => handleSocialMediaPress(instagram)}
            testID="Instagram"
          >
            <InstagramIcon color={colors?.onPrimary100} height={36} width={36} />
          </TouchableOpacity>
        ) : null}

        {tiktok ? (
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={10}
            onPress={() => handleSocialMediaPress(tiktok)}
            testID="Tiktok"
          >
            <TiktokIcon color={colors?.onPrimary100} height={36} width={36} />
          </TouchableOpacity>
        ) : null}

        {x ? (
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={10}
            onPress={() => handleSocialMediaPress(x)}
            testID="X"
          >
            <XIcon color={colors?.onPrimary100} height={36} width={36} />
          </TouchableOpacity>
        ) : null}

        {linkedin ? (
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={10}
            onPress={() => handleSocialMediaPress(linkedin)}
            testID="Linkedin"
          >
            <LinkedinIcon color={colors?.onPrimary100} height={36} width={36} />
          </TouchableOpacity>
        ) : null}
      </View>
    ),
    [colors?.onPrimary100, handleSocialMediaPress, instagram, tiktok, x, linkedin],
  )

  return <AirlineSectionRow title={localeStrings.socialMedia}>{socialMediaIcons}</AirlineSectionRow>
}

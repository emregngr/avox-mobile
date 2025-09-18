import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'

import { AirlineRowItem } from '@/components/feature/Airline/AirlineDetail/AirlineRowItem'
import { AirlineSectionRow } from '@/components/feature/Airline/AirlineDetail/AirlineSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { AirlineType } from '@/types/feature/airline'

interface ContactProps {
  companyInfo: AirlineType['companyInfo']
}

export const Contact = ({ companyInfo }: ContactProps) => {
  const { selectedLocale } = useLocaleStore()

  const { contactInfo, website } = companyInfo ?? {}
  const { email, phone } = contactInfo ?? {}

  const handlePhonePress = useCallback(async () => {
    if (phone) {
      await Linking?.openURL(`tel:${phone}`)
    }
  }, [phone])

  const handleEmailPress = useCallback(async () => {
    if (email) {
      await Linking?.openURL(`mailto:${email}`)
    }
  }, [email])

  const handleWebsitePress = useCallback(() => {
    if (website) {
      const formattedUrl = website?.startsWith('http') ? website : `https://${website}`

      router.navigate({
        params: {
          title: website,
          webViewUrl: formattedUrl,
        },
        pathname: '/web-view-modal',
      })
    }
  }, [website])

  const localeStrings = useMemo(
    () => ({
      contactInformation: getLocale('contactInformation'),
      email: getLocale('email'),
      phone: getLocale('phone'),
      website: getLocale('website'),
    }),
    [selectedLocale],
  )

  return (
    <AirlineSectionRow title={localeStrings.contactInformation}>
      <AirlineRowItem
        icon="web"
        label={localeStrings.website}
        onPress={handleWebsitePress}
        testID="web"
        value={website}
      />

      <AirlineRowItem
        icon="phone-outline"
        label={localeStrings.phone}
        onPress={handlePhonePress}
        value={phone}
      />

      <AirlineRowItem
        icon="email-outline"
        label={localeStrings.email}
        onPress={handleEmailPress}
        value={email}
      />
    </AirlineSectionRow>
  )
}

import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Linking } from 'react-native'

import { AirportRowItem, AirportSectionRow } from '@/components/feature/Airport'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { Airline } from '@/types/feature/airline'

interface ContactProps {
  companyInfo: Airline['companyInfo']
  operations: Airline['operations']
}

export const Contact = ({ companyInfo, operations }: ContactProps) => {
  const { selectedLocale } = useLocaleStore()

  const { contactInfo, website } = companyInfo || {}
  const { region } = operations || {}
  const { email, phone } = contactInfo || {}

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
      const formattedUrl = website.startsWith('http') ? website : `https://${website}`
      const regionLower = region?.toLowerCase()

      router.navigate({
        params: {
          regionLower,
          selectedWebsite: website,
          webViewUrl: formattedUrl,
        },
        pathname: '/web-view-modal',
      })
    }
  }, [website, region])

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
    <AirportSectionRow title={localeStrings.contactInformation}>
      <AirportRowItem
        icon="globe"
        label={localeStrings.website}
        onPress={handleWebsitePress}
        value={website}
      />

      <AirportRowItem
        icon="call"
        label={localeStrings.phone}
        onPress={handlePhonePress}
        value={phone}
      />

      <AirportRowItem
        icon="mail"
        label={localeStrings.email}
        onPress={handleEmailPress}
        value={email}
      />
    </AirportSectionRow>
  )
}

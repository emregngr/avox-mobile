import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Linking } from 'react-native'

import { AirportRowItem } from '@/components/feature/Airport/AirportDetail/AirportRowItem'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { Airport } from '@/types/feature/airport'

interface ContactProps {
  airportInfo: Airport['airportInfo']
}

export const Contact = ({ airportInfo }: ContactProps) => {
  const { selectedLocale } = useLocaleStore()

  const { contactInfo: { email, phone } = {}, website } = airportInfo ?? {}

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

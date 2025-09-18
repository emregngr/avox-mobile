import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'

import { AirportRowItem } from '@/components/feature/Airport/AirportDetail/AirportRowItem'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { AirportType } from '@/types/feature/airport'

interface ContactProps {
  airportInfo: AirportType['airportInfo']
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
        icon="web"
        label={localeStrings.website}
        onPress={handleWebsitePress}
        value={website}
      />

      <AirportRowItem
        icon="phone-outline"
        label={localeStrings.phone}
        onPress={handlePhonePress}
        value={phone}
      />

      <AirportRowItem
        icon="email-outline"
        label={localeStrings.email}
        onPress={handleEmailPress}
        value={email}
      />
    </AirportSectionRow>
  )
}

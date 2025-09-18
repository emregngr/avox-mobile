import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { AirportType } from '@/types/feature/airport'

interface ServicesProps {
  facilities: AirportType['facilities']
}

export const Services = ({ facilities }: ServicesProps) => {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { services } = facilities ?? {}

  if (!services?.length) return null

  const localeStrings = useMemo(
    () => ({
      services: getLocale('services'),
    }),
    [selectedLocale],
  )

  return (
    <AirportSectionRow title={localeStrings.services}>
      {services.map((service, index) => (
        <View className="flex-row py-1.5 gap-x-2" key={index}>
          <MaterialCommunityIcons
            color={colors?.onPrimary100}
            name="checkbox-marked-circle"
            size={16}
          />
          <ThemedText className="capitalize" color="text-90" type="body2">
            {service}
          </ThemedText>
        </View>
      ))}
    </AirportSectionRow>
  )
}

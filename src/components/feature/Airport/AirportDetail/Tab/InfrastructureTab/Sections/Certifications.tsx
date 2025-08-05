import { Ionicons } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airport } from '@/types/feature/airport'

interface CertificationsProps {
  safety: Airport['safety']
}

export const Certifications = ({ safety }: CertificationsProps) => {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { certifications } = safety ?? {}

  const localeStrings = useMemo(
    () => ({
      certifications: getLocale('certifications'),
    }),
    [selectedLocale],
  )

  return (
    <AirportSectionRow title={localeStrings.certifications}>
      <View className="flex-row items-center py-2">
        <Ionicons color={colors?.onPrimary100} name="shield-checkmark" size={20} />
        <ThemedText className="ml-3" color="text-100" type="body2">
          {certifications}
        </ThemedText>
      </View>
    </AirportSectionRow>
  )
}

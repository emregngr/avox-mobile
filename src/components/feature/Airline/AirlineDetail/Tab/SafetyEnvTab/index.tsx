import React, { useMemo } from 'react'
import { View } from 'react-native'

import { Environmental } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Sections/Environmental'
import { Safety } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Sections/Safety'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { AirlineType } from '@/types/feature/airline'

interface SafetyEnvTabProps {
  airlineData: AirlineType
}

export const SafetyEnvTab = ({ airlineData }: SafetyEnvTabProps) => {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { environmental, safety } = airlineData ?? {}
  const { certifications, safetyRecord } = safety ?? {}

  const localeStrings = useMemo(
    () => ({
      certifications: getLocale('certifications'),
      environmentalPolicy: getLocale('environmentalPolicy'),
      environmentalResponsibility: getLocale('environmentalResponsibility'),
      safetyInformation: getLocale('safetyInformation'),
      safetyRecord: getLocale('safetyRecord'),
    }),
    [selectedLocale],
  )

  return (
    <View className="px-4 gap-y-4">
      <Safety
        certifications={certifications}
        certificationsTitle={localeStrings.certifications}
        iconColor={colors.onPrimary100}
        safetyRecord={safetyRecord}
        safetyRecordTitle={localeStrings.safetyRecord}
        title={localeStrings.safetyInformation}
      />

      <Environmental
        content={environmental}
        iconColor={colors.onPrimary100}
        subtitle={localeStrings.environmentalResponsibility}
        title={localeStrings.environmentalPolicy}
      />
    </View>
  )
}

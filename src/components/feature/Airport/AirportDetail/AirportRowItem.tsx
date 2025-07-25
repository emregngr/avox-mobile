import { Ionicons } from '@expo/vector-icons'
import type { ComponentType } from 'react'
import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import type { SvgProps } from 'react-native-svg'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'

interface AirportRowItemProps {
  className?: string
  customIcon?: ComponentType<SvgProps>
  icon?: any
  label: string
  onPress?: () => void
  value: string | number | undefined
}

export const AirportRowItem = ({
  className,
  customIcon: CustomIcon,
  icon,
  label,
  onPress,
  value,
}: AirportRowItemProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const iconColor = useMemo(() => colors?.onPrimary100, [colors?.onPrimary100])

  const chevronColor = useMemo(() => colors?.onPrimary100, [colors?.onPrimary100])

  const valueClassName = useMemo(() => cn(className), [className])

  const isDisabled = useMemo(() => !onPress, [onPress])

  const iconComponent = useMemo(() => {
    if (icon) {
      return <Ionicons color={iconColor} name={icon} size={20} />
    }
    if (CustomIcon) {
      return <CustomIcon color={iconColor} height={20} width={20} />
    }
    return null
  }, [icon, CustomIcon, iconColor])

  const chevronComponent = useMemo(() => {
    if (onPress) {
      return <Ionicons color={chevronColor} name="chevron-forward" size={20} />
    }
    return null
  }, [onPress, chevronColor])

  const containerProps = useMemo(
    () => ({
      className: 'flex-row items-center py-2',
    }),
    [],
  )

  const viewProps = useMemo(
    () => ({
      className: 'flex-1 ml-3',
    }),
    [],
  )

  const labelTextProps = useMemo(
    () => ({
      className: 'mb-1',
      color: 'text-70' as const,
      type: 'body3' as const,
    }),
    [],
  )

  const valueTextProps = useMemo(
    () => ({
      className: valueClassName,
      color: 'text-100' as const,
      type: 'body2' as const,
    }),
    [valueClassName],
  )

  const hitSlop = useMemo(() => ({ left: 20, right: 20 }), [])

  const activeOpacity = useMemo(() => 0.7, [])

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={isDisabled}
      hitSlop={hitSlop}
      onPress={onPress}
      {...containerProps}
    >
      {iconComponent}
      <View {...viewProps}>
        <ThemedText {...labelTextProps}>{label}</ThemedText>
        <ThemedText {...valueTextProps}>{value}</ThemedText>
      </View>
      {chevronComponent}
    </TouchableOpacity>
  )
}

import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ComponentType } from 'react'
import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import type { SvgProps } from 'react-native-svg'

import Right from '@/assets/icons/right.svg'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

type ProfileItemProps = {
  customLeftIcon?: ComponentType<SvgProps>
  danger?: boolean
  isLastItem?: boolean
  label: string
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap
  onPress: () => void
  rightIcon?: boolean
  testID?: string
}

export const ProfileItem = ({
  customLeftIcon: CustomLeftIcon,
  danger,
  isLastItem = false,
  label,
  leftIcon,
  onPress,
  rightIcon = true,
  testID,
}: ProfileItemProps) => {
  const { selectedTheme } = useThemeStore()
  const colors = themeColors?.[selectedTheme]

  const iconColor = useMemo(
    () => (danger ? colors?.error : colors?.onPrimary100),
    [danger, colors?.error, colors?.onPrimary100],
  )

  const iconComponent = useMemo(() => {
    if (leftIcon) {
      return <MaterialCommunityIcons color={iconColor} name={leftIcon} size={24} />
    }
    if (CustomLeftIcon) {
      return <CustomLeftIcon color={iconColor} height={24} width={24} />
    }
    return null
  }, [leftIcon, CustomLeftIcon, iconColor])

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        className="h-14 flex-row items-center justify-between px-4 bg-background-secondary"
        hitSlop={{ left: 20, right: 20 }}
        onPress={onPress}
        testID={testID || 'profile-item-touchable'}
      >
        <View className="flex-row items-center">
          {iconComponent}

          <ThemedText className="ml-4" color={danger ? 'error' : 'text-100'} type="body1">
            {label}
          </ThemedText>
        </View>

        {rightIcon ? (
          <Right
            color={iconColor} height={24} testID="right-icon"
            width={24}
          />
) : null}
      </TouchableOpacity>

      {!isLastItem ? (
        <View className="border-b border-background-quaternary ml-14" testID="separator" />
      ) : null}
    </>
  )
}

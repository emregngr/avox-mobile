import type { ReactNode } from 'react'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import Right from '@/assets/icons/right.svg'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

type ProfileMenuItemProps = {
  danger?: boolean
  isLastItem?: boolean
  leftIcon?: ReactNode
  onPress: () => void
  rightIcon?: boolean
  title: string
}

export const ProfileMenuItem = ({
  danger,
  isLastItem = false,
  leftIcon,
  onPress,
  rightIcon = true,
  title,
}: ProfileMenuItemProps) => {
  const { selectedTheme } = useThemeStore()

  return (
    <>
      <TouchableOpacity
        className={`h-14 flex-row items-center p-4 ${
          leftIcon ? 'justify-start' : 'justify-between'
        } ${danger ? 'bg-error' : 'bg-background-secondary'}`}
        activeOpacity={0.7}
        hitSlop={{ left: 20, right: 20 }}
        onPress={onPress}
      >
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}

        <ThemedText color="text-100" type="body1">
          {title}
        </ThemedText>

        {rightIcon ? (
          <Right color={themeColors?.[selectedTheme]?.onPrimary50} height={24} width={24} />
        ) : null}
      </TouchableOpacity>

      {!isLastItem ? <View className="border-b border-background-quaternary ml-4" /> : null}
    </>
  )
}

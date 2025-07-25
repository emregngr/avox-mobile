import type { ReactNode } from 'react'
import React from 'react'
import { Pressable, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { cn } from '@/utils/common/cn'

type TypographyType =
  | 'bigTitle'
  | 'title'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4'
  | 'button1'
  | 'button2'
  | 'tabBar'

type ThemedButtonTextProps = {
  [key: string]: any
  containerStyle?: string
  icon?: ReactNode
  label: string
  onPress?: () => void
  textColor: string
  textStyle?: string
  type?: TypographyType
}

export const ThemedButtonText = ({
  containerStyle,
  icon,
  label,
  textColor = 'text-100',
  textStyle,
  type = 'button2',
  ...rest
}: ThemedButtonTextProps) => (
  <Pressable className={cn('flex-row', containerStyle)} hitSlop={30} {...rest}>
    <ThemedText className={textStyle as string} color={textColor} type={type}>
      {label}
    </ThemedText>
    {icon ? <View className="ml-2.5">{icon}</View> : null}
  </Pressable>
)

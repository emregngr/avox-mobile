import type { ReactNode } from 'react'
import React from 'react'
import type { TextProps } from 'react-native'
import { Text } from 'react-native'

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

interface TypographyProps extends TextProps {
  center?: boolean
  children: ReactNode
  className?: string
  color: string
  type: TypographyType
}

export const ThemedText = ({
  center,
  children,
  className,
  color,
  type,
  ...props
}: TypographyProps) => {
  const styles: Record<TypographyType, string> = {
    bigTitle: 'text-[55px] leading-[63px] font-inter-bold',
    body1: 'text-[16px] leading-[19px] font-inter-medium',
    body2: 'text-[14px] leading-[17px] font-inter-medium',
    body3: 'text-[13px] leading-[16px] font-inter-regular',
    body4: 'text-[12px] leading-[15px] font-inter-regular',
    button1: 'text-[16px] leading-[19px] font-inter-bold',
    button2: 'text-[14px] leading-[17px] font-inter-semibold',
    h1: 'text-[24px] leading-[29px] font-inter-bold',
    h2: 'text-[20px] leading-[24px] font-inter-bold',
    h3: 'text-[18px] leading-[21px] font-inter-semibold',
    h4: 'text-[16px] leading-[19px] font-inter-semibold',
    tabBar: 'text-[12px] leading-[14px] tracking-[-0.24px] font-inter-medium',
    title: 'text-[32px] leading-[38px] font-inter-bold',
  }

  const colorMap = {
    background: {
      blur: 'text-background-blur',
      primary: 'text-background-primary',
      quaternary: 'text-background-quaternary',
      secondary: 'text-background-secondary',
      tertiary: 'text-background-tertiary',
    },
    onPrimary: {
      100: 'text-onPrimary-100',
      20: 'text-onPrimary-20',
      30: 'text-onPrimary-30',
      50: 'text-onPrimary-50',
      70: 'text-onPrimary-70',
    },
    primary: {
      100: 'text-primary-100',
      30: 'text-primary-30',
      50: 'text-primary-50',
      70: 'text-primary-70',
    },
    secondary: {
      100: 'text-secondary-100',
      15: 'text-secondary-15',
      30: 'text-secondary-30',
      50: 'text-secondary-50',
    },
    tertiary: {
      100: 'text-tertiary-100',
      30: 'text-tertiary-30',
      50: 'text-tertiary-50',
    },
    text: {
      100: 'text-text-100',
      30: 'text-text-30',
      50: 'text-text-50',
      70: 'text-text-70',
      90: 'text-text-90',
    },
  }

  const singleColorMap: Record<string, string> = {
    af: 'text-af',
    as: 'text-as',
    error: 'text-error',
    eu: 'text-eu',
    info: 'text-info',
    na: 'text-na',
    oc: 'text-oc',
    sa: 'text-sa',
    success: 'text-success',
    warning: 'text-warning',
  }

  const getColorClass = (color: string) => {
    if (singleColorMap[color]) {
      return singleColorMap[color]
    }

    const parts = color.split('-')
    if (parts.length === 2) {
      const [category, shade] = parts
      const categoryColors = colorMap[category as keyof typeof colorMap]

      if (typeof categoryColors === 'object') {
        return categoryColors[shade as keyof typeof categoryColors] || ''
      }
    }

    return ''
  }

  return (
    <Text
      allowFontScaling={false}
      className={cn(styles[type], center ? 'text-center' : '', getColorClass(color), className)}
      maxFontSizeMultiplier={1.0}
      {...props}
    >
      {children}
    </Text>
  )
}

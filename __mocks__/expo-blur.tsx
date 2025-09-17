import { ReactNode } from 'react'
import type { ViewProps, ViewStyle } from 'react-native'

interface BlurViewProps extends ViewProps {
  children?: ReactNode
  style?: ViewStyle
  className?: string
  intensity?: number
  tint?: 'light' | 'dark' | 'default'
}

export const BlurView = ({
  children,
  style,
  className,
  intensity,
  tint,
  ...props
}: BlurViewProps) => {
  const { View } = require('react-native')
  return (
    <View
      testID="mocked-blur-view"
      style={style}
      className={className}
      intensity={intensity}
      tint={tint}
      {...props}
    >
      {children}
    </View>
  )
}

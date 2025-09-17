import { ReactNode } from 'react'
import type { ViewProps } from 'react-native'

interface LinearGradientProps extends ViewProps {
  children?: ReactNode
  colors: string[]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  locations?: number[]
}

export const LinearGradient = ({
  children,
  colors,
  start,
  end,
  locations,
  ...props
}: LinearGradientProps) => {
  const { View } = require('react-native')
  return (
    <View
      testID="linear-gradient"
      colors={colors}
      start={start}
      end={end}
      locations={locations}
      {...props}
    >
      {children}
    </View>
  )
}

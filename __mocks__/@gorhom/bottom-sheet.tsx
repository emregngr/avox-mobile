import React, { ReactNode, forwardRef } from 'react'
import { View, type ViewProps, type ViewStyle } from 'react-native'

interface BottomSheetProps extends ViewProps {
  children?: ReactNode
  style?: ViewStyle
  className?: string
}

export const BottomSheet = forwardRef<any, BottomSheetProps>(({ children, ...props }, ref) => (
  <View testID="bottom-sheet" ref={ref} {...props}>
    {children}
  </View>
))

export const BottomSheetBackdrop = ({ children, ...props }: any) => (
  <View testID="bottom-sheet-backdrop" {...props}>
    {children}
  </View>
)

export const BottomSheetScrollView = ({ children, ...props }: any) => (
  <View testID="bottom-sheet-scroll-view" {...props}>
    {children}
  </View>
)

export default BottomSheet

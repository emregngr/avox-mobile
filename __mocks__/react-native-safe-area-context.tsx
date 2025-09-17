import { ComponentType, ReactNode } from 'react'
import { View } from 'react-native'

export type Insets = {
  top: number
  bottom: number
  left: number
  right: number
}

export type Frame = {
  x: number
  y: number
  width: number
  height: number
}

type SafeAreaConsumerProps = {
  children: (insets: Insets) => ReactNode
}

export const SafeAreaProvider = ({ children }: { children: ReactNode }) => <>{children}</>

export const SafeAreaConsumer = ({ children }: SafeAreaConsumerProps) =>
  children({ top: 0, bottom: 0, left: 0, right: 0 })

export const SafeAreaView = View

export const useSafeAreaInsets = (): Insets => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
})

export const mockedUseSafeAreaInsets = jest.fn().mockReturnValue({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
})

export const useSafeAreaFrame = (): Frame => ({
  x: 0,
  y: 0,
  width: 375,
  height: 812,
})

export function withSafeAreaInsets<P extends object>(
  Component: ComponentType<P>,
): ComponentType<P> {
  return Component
}

import { BlurView } from 'expo-blur'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Platform } from 'react-native'
import type { Edge } from 'react-native-safe-area-context'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'
import { getSafeAreaEdges } from '@/utils/common/getSafeAreaEdges'

interface SafeLayoutProps {
  bottomBlur?: boolean
  children: ReactNode
  className?: string
  edges?: Edge[]
  testID?: string
  topBlur?: boolean
}

export const SafeLayout = ({
  bottomBlur = false,
  children,
  className,
  edges,
  testID,
  topBlur = true,
}: SafeLayoutProps) => {
  const { bottom, top } = useSafeAreaInsets()

  const safeAreaEdges = useMemo(() => getSafeAreaEdges(), [])

  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const finalEdges = useMemo(() => {
    const merged = [...safeAreaEdges, ...(edges || [])]
    if (!topBlur) {
      merged.push('top')
    }
    return merged
  }, [safeAreaEdges, topBlur, edges])

  const blurProps = useMemo(
    () => ({
      intensity: Platform.OS === 'ios' ? 30 : 50,
      tint: selectedTheme,
    }),
    [selectedTheme],
  )

  return (
    <SafeAreaView
      className={cn('flex-1 bg-background-primary', className)}
      edges={finalEdges as Edge[]}
      testID={testID || 'screen'}
    >
      {topBlur ? (
        <BlurView
          {...blurProps}
          style={{
            backgroundColor: colors?.background?.blur,
            height: top + 44,
          }}
          className="absolute top-0 left-0 right-0 z-10"
        />
      ) : null}

      {children}

      {bottomBlur ? (
        <BlurView
          {...blurProps}
          style={{
            backgroundColor: colors?.background?.blur,
            height: bottom + 56,
          }}
          className="absolute bottom-0 left-0 right-0 z-10"
        />
      ) : null}
    </SafeAreaView>
  )
}

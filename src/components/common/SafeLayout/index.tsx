import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { cn } from '@/utils/common/cn'
import { getSafeAreaEdges } from '@/utils/common/getSafeAreaEdges'

interface SafeLayoutProps {
  children: ReactNode
  className?: string
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
}

export const SafeLayout = ({ children, className, edges }: SafeLayoutProps) => {
  const safeAreaEdges = useMemo(() => getSafeAreaEdges(), [])

  return (
    <SafeAreaView
      className={cn('flex-1 bg-background-primary', className)}
      edges={edges ?? safeAreaEdges}
    >
      {children}
    </SafeAreaView>
  )
}

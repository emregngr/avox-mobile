import { ReactNode } from 'react'

interface SystemBarsProps {
  children: ReactNode
}

module.exports = {
  SystemBars: ({ children }: SystemBarsProps) => children,
}

import { render, screen } from '@testing-library/react-native'
import { router, useFocusEffect, useSegments } from 'expo-router'
import type { ReactNode } from 'react'

import TabsLayout from '@/app/(tabs)/_layout'
import useAuthStore from '@/store/auth'
import useThemeStore from '@/store/theme'

type SegmentsType = string[]

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/store/auth')

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

jest.mock('expo-router/unstable-native-tabs', () => {
  const { Text, View } = require('react-native')

  const MockedComponent = ({ children, ...props }: any) => <View {...props}>{children}</View>
  const MockedLabel = ({ children }: { children: ReactNode }) => <Text>{children}</Text>
  const NativeTabs: any = ({ children }: { children: ReactNode }) => <View>{children}</View>

  NativeTabs.Trigger = MockedComponent
  return {
    NativeTabs,
    Icon: () => <View testID="mocked-icon" />,
    Label: MockedLabel,
    VectorIcon: MockedComponent,
  }
})

const mockedUseFocusEffect = useFocusEffect as jest.Mock

const mockedUseSegments = useSegments as jest.Mock

const mockedRouterReplace = router.replace as jest.Mock

beforeEach(() => {
  jest.useFakeTimers()

  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

afterEach(() => {
  jest.runOnlyPendingTimers()

  jest.useRealTimers()
})

const renderTabLayout = (isAuthenticated = false, segments: SegmentsType = ['', 'home']) => {
  mockedUseAuthStore.mockReturnValue({ isAuthenticated })
  mockedUseSegments.mockReturnValue(segments)
  return render(<TabsLayout />)
}

describe('TabsLayout', () => {
  describe('Authentication Protection Logic', () => {
    describe('when user is not authenticated', () => {
      it('redirects to auth when accessing favorites tab', () => {
        const segments = ['', 'favorites']
        renderTabLayout(false, segments)

        const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
        if (callback) {
          callback()
        }
        jest.advanceTimersByTime(20)

        expect(mockedRouterReplace).toHaveBeenCalledTimes(1)
        expect(mockedRouterReplace).toHaveBeenCalledWith({
          params: { tab: 'favorites' },
          pathname: '/auth',
        })
      })

      it('does not redirect when accessing non-protected tabs', () => {
        const testCases: SegmentsType[] = [
          ['', 'home'],
          ['', 'discover'],
          ['', 'profile'],
        ]

        for (const segments of testCases) {
          mockedRouterReplace.mockClear()
          renderTabLayout(false, segments)
          const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
          if (callback) {
            callback()
          }
          jest.advanceTimersByTime(20)
          expect(mockedRouterReplace).not.toHaveBeenCalled()
        }
      })
    })

    describe('when user is authenticated', () => {
      it('does not redirect when accessing protected tab', () => {
        const segments = ['', 'favorites']
        renderTabLayout(true, segments)

        const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
        if (callback) {
          callback()
        }
        jest.advanceTimersByTime(20)
        expect(mockedRouterReplace).not.toHaveBeenCalled()
      })
    })
  })

  describe('Component Rendering', () => {
    it('renders all tab labels', () => {
      renderTabLayout()

      expect(screen.getByText('home')).toBeTruthy()
      expect(screen.getByText('discover')).toBeTruthy()
      expect(screen.getByText('favorites')).toBeTruthy()
      expect(screen.getByText('profile')).toBeTruthy()
    })
  })

  describe('TabsLayout Snapshot', () => {
    it('should render the TabsLayout successfully', () => {
      const { toJSON } = renderTabLayout(true)

      expect(toJSON()).toMatchSnapshot()
    })
  })
})

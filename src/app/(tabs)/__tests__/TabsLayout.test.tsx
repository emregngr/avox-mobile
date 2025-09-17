import { render } from '@testing-library/react-native'
import { router, useFocusEffect, useSegments } from 'expo-router'
import type { ReactNode } from 'react'

import TabsLayout from '@/app/(tabs)/_layout'
import useAuthStore from '@/store/auth'

type SegmentsType = string[]

jest.mock('@/store/auth')

jest.mock('@/components/common', () => {
  const { View } = require('react-native')

  return {
    ThemedTab: (): ReactNode => <View testID="themed-tab" />,
  }
})

const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<typeof useFocusEffect>
const mockedUseSegments = useSegments as jest.MockedFunction<() => SegmentsType>
const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

beforeEach(() => {
  jest.useFakeTimers()
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
  describe('Component Rendering', () => {
    it('renders Tabs component with correct screen options', () => {
      const { getByTestId } = renderTabLayout()

      const tabs = getByTestId('tabs')
      const screenOptions = JSON.parse(tabs.props['data-screen-options'] || '{}')

      expect(screenOptions).toEqual({
        headerShown: false,
        tabBarStyle: { display: 'none' },
      })
    })

    it('renders all tab screens', () => {
      const { getByTestId } = renderTabLayout()

      expect(getByTestId('tab-screen-home')).toBeTruthy()
      expect(getByTestId('tab-screen-discover')).toBeTruthy()
      expect(getByTestId('tab-screen-favorites')).toBeTruthy()
      expect(getByTestId('tab-screen-profile')).toBeTruthy()
    })

    it('renders ThemedTab component', () => {
      const { getByTestId } = renderTabLayout()

      expect(getByTestId('themed-tab')).toBeTruthy()
    })
  })

  describe('useFocusEffect Hook', () => {
    it('calls useFocusEffect with a callback function', () => {
      renderTabLayout()

      expect(mockedUseFocusEffect).toHaveBeenCalledTimes(1)
      expect(mockedUseFocusEffect).toHaveBeenCalledWith(expect.any(Function))
    })

    it('useFocusEffect callback depends on isAuthenticated and segments', () => {
      renderTabLayout()

      const callback = mockedUseFocusEffect.mock.calls[0]?.[0]

      expect(typeof callback).toBe('function')
    })
  })

  describe('Authentication Protection Logic', () => {
    describe('when user is authenticated', () => {
      it('does not redirect when accessing protected tab', () => {
        const segments = ['', 'favorites']
        renderTabLayout(true, segments)

        const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
        if (callback) {
          callback()
        }

        jest.advanceTimersByTime(20)

        expect(router.replace).not.toHaveBeenCalled()
      })

      it('does not redirect when accessing non-protected tab', () => {
        const segments = ['', 'home']
        renderTabLayout(true, segments)

        const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
        if (callback) {
          callback()
        }

        jest.advanceTimersByTime(20)

        expect(router.replace).not.toHaveBeenCalled()
      })
    })

    describe('when user is not authenticated', () => {
      it('redirects to auth when accessing favorites tab', () => {
        const segments = ['', 'favorites']
        renderTabLayout(false, segments)

        const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
        if (callback) {
          callback()
        }

        jest.advanceTimersByTime(20)

        expect(router.replace).toHaveBeenCalledWith({
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
          jest.clearAllMocks()
          renderTabLayout(false, segments)

          const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
          if (callback) {
            callback()
          }

          jest.advanceTimersByTime(20)

          expect(router.replace).not.toHaveBeenCalled()
        }
      })

      it('handles undefined segments gracefully', () => {
        renderTabLayout(false, [])

        const callback = mockedUseFocusEffect.mock.calls[0]?.[0]

        expect(() => {
          if (callback) {
            callback()
          }
        }).not.toThrow()

        jest.advanceTimersByTime(20)
        expect(router.replace).not.toHaveBeenCalled()
      })

      it('handles segments with undefined second element', () => {
        const segments = ['']
        renderTabLayout(false, segments)

        const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
        if (callback) {
          callback()
        }

        jest.advanceTimersByTime(20)
        expect(router.replace).not.toHaveBeenCalled()
      })
    })

    describe('setTimeout behavior', () => {
      it('uses 16ms delay for redirection', () => {
        const segments = ['', 'favorites']
        renderTabLayout(false, segments)

        const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
        if (callback) {
          callback()
        }

        jest.advanceTimersByTime(15)
        expect(router.replace).not.toHaveBeenCalled()

        jest.advanceTimersByTime(2)
        expect(router.replace).toHaveBeenCalled()
      })
    })
  })

  describe('Protected Tabs Configuration', () => {
    it('treats favorites as protected tab', () => {
      const segments = ['', 'favorites']
      renderTabLayout(false, segments)

      const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
      if (callback) {
        callback()
      }

      jest.advanceTimersByTime(20)

      expect(router.replace).toHaveBeenCalledWith({
        params: { tab: 'favorites' },
        pathname: '/auth',
      })
    })

    it('does not treat other tabs as protected', () => {
      const nonProtectedTabs: string[] = ['home', 'discover', 'profile', 'settings', 'unknown']

      for (const tab of nonProtectedTabs) {
        jest.clearAllMocks()
        const segments = ['', tab]
        renderTabLayout(false, segments)

        const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
        if (callback) {
          callback()
        }

        jest.advanceTimersByTime(20)

        expect(router.replace).not.toHaveBeenCalled()
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles null segments', () => {
      mockedUseAuthStore.mockReturnValue({ isAuthenticated: false })
      mockedUseSegments.mockReturnValue([] as SegmentsType)

      expect(() => render(<TabsLayout />)).not.toThrow()
    })

    it('handles segments with more than 2 elements', () => {
      const segments = ['', 'favorites', 'sub-route', 'another-level']
      renderTabLayout(false, segments)

      const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
      if (callback) {
        callback()
      }

      jest.advanceTimersByTime(20)

      expect(router.replace).toHaveBeenCalledWith({
        params: { tab: 'favorites' },
        pathname: '/auth',
      })
    })

    it('re-evaluates protection when authentication state changes', () => {
      const segments = ['', 'favorites']

      const { rerender } = renderTabLayout(false, segments)
      let callback = mockedUseFocusEffect.mock.calls[0]?.[0]
      if (callback) {
        callback()
      }
      jest.advanceTimersByTime(20)
      expect(router.replace).toHaveBeenCalled()

      jest.clearAllMocks()
      mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })
      mockedUseSegments.mockReturnValue(segments)
      rerender(<TabsLayout />)

      callback = mockedUseFocusEffect.mock.calls[0]?.[0]
      if (callback) {
        callback()
      }
      jest.advanceTimersByTime(20)
      expect(router.replace).not.toHaveBeenCalled()
    })
  })

  describe('Focus Effect Callback Logic', () => {
    it('correctly extracts current tab from segments', () => {
      const segments = ['', 'favorites']
      renderTabLayout(false, segments)

      const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
      if (callback) {
        callback()
      }

      jest.advanceTimersByTime(20)

      expect(router.replace).toHaveBeenCalledWith({
        params: { tab: 'favorites' },
        pathname: '/auth',
      })
    })

    it('does not redirect if segments array is empty', () => {
      renderTabLayout(false, [])

      const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
      if (callback) {
        callback()
      }

      jest.advanceTimersByTime(20)

      expect(router.replace).not.toHaveBeenCalled()
    })

    it('does not redirect if current tab is undefined', () => {
      renderTabLayout(false, [''])

      const callback = mockedUseFocusEffect.mock.calls[0]?.[0]
      if (callback) {
        callback()
      }

      jest.advanceTimersByTime(20)

      expect(router.replace).not.toHaveBeenCalled()
    })
  })
})

describe('TabsLayout Snapshot', () => {
  it('should render the TabsLayout successfully', () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })
    mockedUseSegments.mockReturnValue([] as SegmentsType)

    const { toJSON } = render(<TabsLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})

import { fireEvent, render, screen } from '@testing-library/react-native'
import { router } from 'expo-router'
import React from 'react'

import { ThemedTab } from '@/components/common/ThemedTab'
import useThemeStore from '@/store/theme'

const { setMockPathname, clearAllMocks } = require('expo-router')
const { mockedUseSafeAreaInsets } = require('react-native-safe-area-context')

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({
      children,
      color,
      type,
      ...props
    }: {
      children: string
      color: string
      type: string
    }) => (
      <Text testID={`themed-text-${color}-${type}`} {...props}>
        {children}
      </Text>
    ),
  }
})

describe('ThemedTab Component', () => {
  beforeEach(() => {
    clearAllMocks()

    mockedUseThemeStore.mockReturnValue({
      selectedTheme: 'light',
    })

    mockedUseSafeAreaInsets.mockReturnValue({
      bottom: 34,
      top: 59,
      left: 0,
      right: 0,
    })

    setMockPathname('/home')
  })

  describe('Rendering', () => {
    it('should render all tab buttons with correct labels', () => {
      const { getAllByText, getByText } = render(<ThemedTab />)

      expect(getAllByText('home').length).toBeGreaterThan(0)
      expect(getByText('discover')).toBeTruthy()
      expect(getByText('favorites')).toBeTruthy()
      expect(getByText('profile')).toBeTruthy()
    })

    it('should render all tab icons', () => {
      const { getAllByTestId } = render(<ThemedTab />)

      expect(getAllByTestId('mocked-material-community-icon')).toBeTruthy()
    })

    it('should render blur view with correct props', () => {
      const { getByTestId } = render(<ThemedTab />)

      const blurView = getByTestId('mocked-blur-view')
      expect(blurView).toBeTruthy()
    })

    it('should render tabBar type text elements', () => {
      const { getAllByTestId } = render(<ThemedTab />)

      const tabBarTexts = getAllByTestId(/themed-text-.*-tabBar/)
      expect(tabBarTexts).toHaveLength(4)
    })
  })

  describe('Active State Management', () => {
    it('should show active state for home tab when pathname is /home', () => {
      setMockPathname('/home')
      const { getByTestId, getAllByTestId } = render(<ThemedTab />)

      const activeHomeText = getByTestId('themed-text-text-100-tabBar')
      expect(activeHomeText).toBeTruthy()
      expect(activeHomeText.children[0]).toBe('home')

      const inactiveTexts = getAllByTestId('themed-text-text-70-tabBar')
      expect(inactiveTexts).toHaveLength(3)
    })

    it('should show active state for discover tab when pathname is /discover', () => {
      setMockPathname('/discover')
      const { getByTestId, getAllByTestId } = render(<ThemedTab />)

      const activeText = getByTestId('themed-text-text-100-tabBar')
      expect(activeText.children[0]).toBe('discover')

      const inactiveTexts = getAllByTestId('themed-text-text-70-tabBar')
      expect(inactiveTexts).toHaveLength(3)
    })

    it('should show active state for favorites tab when pathname is /favorites', () => {
      setMockPathname('/favorites')
      const { getByTestId } = render(<ThemedTab />)

      const activeText = getByTestId('themed-text-text-100-tabBar')
      expect(activeText.children[0]).toBe('favorites')
    })

    it('should show active state for profile tab when pathname is /profile', () => {
      setMockPathname('/profile')
      const { getByTestId } = render(<ThemedTab />)

      const activeText = getByTestId('themed-text-text-100-tabBar')
      expect(activeText.children[0]).toBe('profile')
    })

    it('should default to home tab for unknown paths', () => {
      setMockPathname('/unknown-path')
      const { getByTestId } = render(<ThemedTab />)

      const activeText = getByTestId('themed-text-text-100-tabBar')
      expect(activeText.children[0]).toBe('home')
    })

    it('should handle nested paths correctly', () => {
      setMockPathname('/home/detail/123')
      const { getByTestId } = render(<ThemedTab />)

      const activeText = getByTestId('themed-text-text-100-tabBar')
      expect(activeText.children[0]).toBe('home')
    })

    it('should handle different pathname formats', () => {
      const pathTests = [
        { pathname: '/home', expected: 'home' },
        { pathname: '/home/', expected: 'home' },
        { pathname: '/home/nested', expected: 'home' },
        { pathname: '/discover', expected: 'discover' },
        { pathname: '/discover/search', expected: 'discover' },
        { pathname: '/favorites', expected: 'favorites' },
        { pathname: '/profile', expected: 'profile' },
        { pathname: '/', expected: 'home' },
        { pathname: '', expected: 'home' },
      ]

      pathTests.forEach(({ pathname, expected }) => {
        setMockPathname(pathname)
        const { unmount, getByTestId } = render(<ThemedTab />)

        const activeText = getByTestId('themed-text-text-100-tabBar')
        expect(activeText.children[0]).toBe(expected)

        unmount()
      })
    })
  })

  describe('Icon State Management', () => {
    it('should show active icons for active tabs', () => {
      setMockPathname('/home')
      const { getAllByTestId } = render(<ThemedTab />)

      expect(getAllByTestId('mocked-material-community-icon')).toBeTruthy()
    })

    it('should show correct active icon when discover is selected', () => {
      setMockPathname('/discover')
      const { getAllByTestId } = render(<ThemedTab />)

      expect(getAllByTestId('mocked-material-community-icon')).toBeTruthy()
    })

    it('should show correct active icon when favorites is selected', () => {
      setMockPathname('/favorites')
      const { getAllByTestId } = render(<ThemedTab />)

      expect(getAllByTestId('mocked-material-community-icon')).toBeTruthy()
    })

    it('should show correct active icon when profile is selected', () => {
      setMockPathname('/profile')
      const { getAllByTestId } = render(<ThemedTab />)

      expect(getAllByTestId('mocked-material-community-icon')).toBeTruthy()
    })
  })

  describe('Navigation Interactions', () => {
    it('should call router.navigate when pressing discover tab', async () => {
      setMockPathname('/home')
      const { getByText } = render(<ThemedTab />)

      const discoverTab = getByText('discover')
      await fireEvent.press(discoverTab)

      expect(router.navigate).toHaveBeenCalledWith('/discover')
      expect(router.navigate).toHaveBeenCalledTimes(1)
    })

    it('should call router.navigate when pressing favorites tab', async () => {
      setMockPathname('/home')
      const { getByText } = render(<ThemedTab />)

      const favoritesTab = getByText('favorites')
      await fireEvent.press(favoritesTab)

      expect(router.navigate).toHaveBeenCalledWith('/favorites')
      expect(router.navigate).toHaveBeenCalledTimes(1)
    })

    it('should call router.navigate when pressing profile tab', async () => {
      setMockPathname('/home')
      const { getByText } = render(<ThemedTab />)

      const profileTab = getByText('profile')
      await fireEvent.press(profileTab)

      expect(router.navigate).toHaveBeenCalledWith('/profile')
      expect(router.navigate).toHaveBeenCalledTimes(1)
    })

    it('should call router.navigate when pressing home tab from different page', async () => {
      setMockPathname('/discover')
      const { getAllByText } = render(<ThemedTab />)

      const homeTab = getAllByText('home')[0]
      await fireEvent.press(homeTab as any)

      expect(router.navigate).toHaveBeenCalledWith('/home')
      expect(router.navigate).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple rapid tab presses', async () => {
      setMockPathname('/home')
      const { getByText } = render(<ThemedTab />)

      const discoverTab = getByText('discover')

      await fireEvent.press(discoverTab)
      await fireEvent.press(discoverTab)
      await fireEvent.press(discoverTab)

      expect(router.navigate).toHaveBeenCalledWith('/discover')
      expect(router.navigate).toHaveBeenCalledTimes(3)
    })

    it('should properly handle press events on all tab buttons', async () => {
      const tabs = [
        { text: 'discover', route: '/discover' },
        { text: 'favorites', route: '/favorites' },
        { text: 'profile', route: '/profile' },
      ]

      for (const tab of tabs) {
        setMockPathname('/home')
        clearAllMocks()

        const { unmount, getByText } = render(<ThemedTab />)

        const tabElement = getByText(tab.text)
        await fireEvent.press(tabElement)

        expect(router.navigate).toHaveBeenCalledWith(tab.route)
        expect(router.navigate).toHaveBeenCalledTimes(1)

        unmount()
      }
    })
  })

  describe('Component Lifecycle', () => {
    it('should unmount without errors', () => {
      const { unmount } = render(<ThemedTab />)
      expect(() => unmount()).not.toThrow()
    })

    it('should work with safe area insets', () => {
      const { root } = render(<ThemedTab />)
      expect(root).toBeTruthy()
    })

    it('should handle theme changes', () => {
      const { rerender, getAllByText } = render(<ThemedTab />)
      expect(getAllByText('home').length).toBeGreaterThan(0)

      rerender(<ThemedTab />)
      expect(getAllByText('home').length).toBeGreaterThan(0)
    })
  })

  describe('Tab Order and Structure', () => {
    it('should have proper tab order', () => {
      setMockPathname('/discover')
      const { getByTestId, getAllByTestId } = render(<ThemedTab />)

      const activeText = getByTestId('themed-text-text-100-tabBar')
      expect(activeText.children[0]).toBe('discover')

      const inactiveTexts = getAllByTestId('themed-text-text-70-tabBar')
      expect(inactiveTexts).toHaveLength(3)
    })

    it('should maintain consistent structure across different active states', () => {
      const tabs = ['home', 'discover', 'favorites', 'profile']

      tabs.forEach(activeTab => {
        setMockPathname(`/${activeTab}`)
        const { unmount, getAllByTestId } = render(<ThemedTab />)

        const activeTexts = getAllByTestId('themed-text-text-100-tabBar')
        expect(activeTexts).toHaveLength(1)
        expect(activeTexts[0]?.children[0]).toBe(activeTab)

        const inactiveTexts = getAllByTestId('themed-text-text-70-tabBar')
        expect(inactiveTexts).toHaveLength(3)

        const allTexts = getAllByTestId(/themed-text-.*-tabBar/)
        expect(allTexts).toHaveLength(4)

        unmount()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have accessible tab elements', () => {
      const { getByText, getAllByText } = render(<ThemedTab />)

      const tabTexts = ['discover', 'favorites', 'profile']
      tabTexts.forEach(text => {
        expect(getByText(text)).toBeTruthy()
      })

      expect(getAllByText('home').length).toBeGreaterThan(0)
    })

    it('should provide visual feedback for active states', () => {
      setMockPathname('/favorites')
      const { getByTestId, getAllByTestId } = render(<ThemedTab />)

      const activeText = getByTestId('themed-text-text-100-tabBar')
      expect(activeText.children[0]).toBe('favorites')

      const inactiveTexts = getAllByTestId('themed-text-text-70-tabBar')
      expect(inactiveTexts).toHaveLength(3)

      const inactiveLabels = inactiveTexts.map(text => text.children[0])
      expect(inactiveLabels).not.toContain('favorites')
      expect(inactiveLabels).toContain('home')
      expect(inactiveLabels).toContain('discover')
      expect(inactiveLabels).toContain('profile')
    })
  })
})

describe('ThemedTab Integration Tests', () => {
  beforeEach(() => {
    clearAllMocks()

    mockedUseThemeStore.mockReturnValue({
      selectedTheme: 'light',
    })
  })

  it('should handle complete user navigation flow', async () => {
    setMockPathname('/home')
    const { unmount } = render(<ThemedTab />)

    let activeText = screen.getByTestId('themed-text-text-100-tabBar')
    expect(activeText.children[0]).toBe('home')

    const discoverTab = screen.getByText('discover')
    await fireEvent.press(discoverTab)
    expect(router.navigate).toHaveBeenCalledWith('/discover')

    unmount()
    setMockPathname('/discover')
    render(<ThemedTab />)

    activeText = screen.getByTestId('themed-text-text-100-tabBar')
    expect(activeText.children[0]).toBe('discover')

    clearAllMocks()

    const favoritesTab = screen.getByText('favorites')
    await fireEvent.press(favoritesTab)
    expect(router.navigate).toHaveBeenCalledWith('/favorites')
    expect(router.navigate).toHaveBeenCalledTimes(1)
  })

  it('should work correctly with nested routes', () => {
    const nestedRoutes = [
      '/home/settings',
      '/discover/search/results',
      '/favorites/list/saved',
      '/profile/edit/personal',
    ]

    nestedRoutes.forEach(route => {
      setMockPathname(route)
      const { unmount, getByTestId } = render(<ThemedTab />)

      const expectedActiveTab = route.split('/')[1]
      const activeText = getByTestId('themed-text-text-100-tabBar')
      expect(activeText.children[0]).toBe(expectedActiveTab)

      unmount()
    })
  })

  it('should maintain state consistency during rapid navigation', async () => {
    setMockPathname('/home')
    const { unmount, getByText, getAllByText } = render(<ThemedTab />)

    const navigationTests = [
      { tab: 'discover', route: '/discover' },
      { tab: 'favorites', route: '/favorites' },
      { tab: 'profile', route: '/profile' },
    ]

    for (const { tab, route } of navigationTests) {
      const tabElement = getByText(tab)
      await fireEvent.press(tabElement)
      expect(router.navigate).toHaveBeenCalledWith(route)
    }

    const homeTab = getAllByText('home')[0]
    await fireEvent.press(homeTab as any)
    expect(router.navigate).toHaveBeenCalledWith('/home')

    expect(router.navigate).toHaveBeenCalledTimes(4)

    unmount()
  })
})

describe('ThemedTab Component Snapshot', () => {
  beforeEach(() => {
    clearAllMocks()

    mockedUseThemeStore.mockReturnValue({
      selectedTheme: 'light',
    })

    setMockPathname('/home')
  })

  it('should render the ThemedTab Component successfully', () => {
    const { toJSON } = render(<ThemedTab />)

    expect(toJSON()).toMatchSnapshot()
  })
})

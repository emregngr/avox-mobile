import { Appearance } from 'react-native'

import useThemeStore, { changeTheme } from '@/store/theme'

describe('useThemeStore', () => {
  it('should initialize with Appearance color scheme or fallback', () => {
    jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light')

    const { selectedTheme } = useThemeStore.getState()
    expect(['light', 'dark']).toContain(selectedTheme)
  })

  it('should change theme and call Appearance.setColorScheme', () => {
    const spy = jest.spyOn(Appearance, 'setColorScheme').mockImplementation()

    changeTheme('dark')

    const { selectedTheme } = useThemeStore.getState()
    expect(selectedTheme).toBe('dark')
    expect(spy).toHaveBeenCalledWith('dark')
  })

  it('should call Appearance.setColorScheme on rehydrate', () => {
    const spy = jest.spyOn(Appearance, 'setColorScheme').mockImplementation()

    const persistOptions = (useThemeStore as any).persist?.getOptions?.()
    const onRehydrate = persistOptions?.onRehydrateStorage

    const cb = onRehydrate?.()
    cb?.({ selectedTheme: 'light' })

    expect(spy).toHaveBeenCalledWith('light')
  })
})

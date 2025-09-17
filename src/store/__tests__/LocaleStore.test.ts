import dayjs from 'dayjs'

import { i18nChangeLocale } from '@/locales/i18next'
import useLocaleStore, { changeLocale } from '@/store/locale'

jest.mock('@/locales/i18next')

const mockedI18nChangeLocale = i18nChangeLocale as jest.MockedFunction<typeof i18nChangeLocale>

describe('useLocaleStore', () => {
  it('should initialize with default locale (en if device locale missing)', () => {
    const { selectedLocale } = useLocaleStore.getState()
    expect(typeof selectedLocale).toBe('string')
    expect(selectedLocale).toBeTruthy()
  })

  it('should change locale correctly', async () => {
    await changeLocale('tr')

    const { selectedLocale } = useLocaleStore.getState()
    expect(selectedLocale).toBe('tr')

    expect(dayjs.locale).toHaveBeenCalledWith('tr')
    expect(mockedI18nChangeLocale).toHaveBeenCalledWith('tr')
  })

  it('should call i18nChangeLocale and dayjs.locale on rehydrate', () => {
    const persistOptions = (useLocaleStore as any).persist?.getOptions?.()
    const onRehydrate = persistOptions?.onRehydrateStorage

    const cb = onRehydrate?.()
    cb?.({ selectedLocale: 'en' })

    expect(dayjs.locale).toHaveBeenCalledWith('en')
    expect(mockedI18nChangeLocale).toHaveBeenCalledWith('en')
  })
})

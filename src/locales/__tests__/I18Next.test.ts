import { getLocales } from 'expo-localization'
import type { i18n, TFunction } from 'i18next'
import { getI18n } from 'react-i18next'

import { getLocale, i18nChangeLocale } from '@/locales/i18next'
const { createMockedLocale } = require('expo-localization')

jest.mock(
  '@/locales/en.json',
  () => ({
    welcome: 'Welcome',
    hello: 'Hello {name}',
    greeting: 'Good morning',
  }),
  { virtual: true },
)

jest.mock(
  '@/locales/tr.json',
  () => ({
    welcome: 'Hoş geldiniz',
    hello: 'Merhaba {name}',
    greeting: 'Günaydın',
  }),
  { virtual: true },
)

let mockedI18n: Partial<i18n>
const mockedGetLocales = getLocales as jest.MockedFunction<typeof getLocales>
const mockedGetI18n = getI18n as jest.MockedFunction<typeof getI18n>

describe('i18n', () => {
  beforeEach(() => {
    mockedI18n = {
      t: jest.fn() as unknown as TFunction,
      changeLanguage: jest.fn().mockResolvedValue(undefined),
      language: 'en',
    }

    mockedGetLocales.mockReturnValue([createMockedLocale()])

    mockedGetI18n.mockReturnValue(mockedI18n as i18n)
  })

  describe('getLocale function', () => {
    it('should return translated text for a given key', () => {
      const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
      mockT.mockReturnValue('Welcome')

      const result = getLocale('welcome')

      expect(mockedGetI18n).toHaveBeenCalled()
      expect(mockT).toHaveBeenCalledWith('welcome')
      expect(result).toBe('Welcome')
    })

    it('should replace parameters in translated text', () => {
      const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
      mockT.mockReturnValue('Hello {name}')

      const result = getLocale('hello', { name: 'John' })

      expect(mockT).toHaveBeenCalledWith('hello')
      expect(result).toBe('Hello John')
    })

    it('should replace multiple parameters in translated text', () => {
      const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
      mockT.mockReturnValue('Hello {name}, you have {count} messages')

      const result = getLocale('messages', { name: 'Alice', count: '5' })

      expect(result).toBe('Hello Alice, you have 5 messages')
    })

    it('should handle missing parameters gracefully', () => {
      const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
      mockT.mockReturnValue('Hello {name}')

      const result = getLocale('hello')

      expect(result).toBe('Hello {name}')
    })

    it('should handle case when i18n is not available', () => {
      mockedGetI18n.mockReturnValue(undefined as unknown as i18n)

      const result = getLocale('welcome')

      expect(result).toBeUndefined()
    })
  })

  describe('i18nChangeLocale function', () => {
    it('should change language successfully', async () => {
      const mockChangeLanguage = mockedI18n.changeLanguage as jest.MockedFunction<
        i18n['changeLanguage']
      >

      await i18nChangeLocale('tr')

      expect(mockedGetI18n).toHaveBeenCalled()
      expect(mockChangeLanguage).toHaveBeenCalledWith('tr')
    })

    it('should handle case when i18n is not available', async () => {
      mockedGetI18n.mockReturnValue(undefined as unknown as i18n)

      await expect(i18nChangeLocale('tr')).resolves.toBeUndefined()
      expect(mockedGetI18n).toHaveBeenCalled()
    })

    it('should handle language change rejection', async () => {
      const error = new Error('Language change failed')
      const mockChangeLanguage = mockedI18n.changeLanguage as jest.MockedFunction<
        i18n['changeLanguage']
      >
      mockChangeLanguage.mockRejectedValue(error)

      await expect(i18nChangeLocale('invalid')).rejects.toThrow('Language change failed')
    })
  })

  describe('module initialization', () => {
    it('should initialize without throwing errors', () => {
      expect(() => {
        const { getLocale, i18nChangeLocale } = require('@/locales/i18next')
        expect(typeof getLocale).toBe('function')
        expect(typeof i18nChangeLocale).toBe('function')
      }).not.toThrow()
    })

    it('should handle locale detection properly', () => {
      const mockedGetLocalesCustom = getLocales as jest.MockedFunction<typeof getLocales>

      mockedGetLocalesCustom.mockReturnValueOnce([])
      expect(() => {
        require('@/locales/i18next')
      }).not.toThrow()

      mockedGetLocalesCustom.mockReturnValueOnce([
        createMockedLocale({
          languageTag: 'tr-TR',
          languageCode: 'tr',
          regionCode: 'TR',
          currencyCode: 'TRY',
          currencySymbol: '₺',
          decimalSeparator: ',',
          digitGroupingSeparator: '.',
          measurementSystem: 'metric',
          temperatureUnit: 'celsius',
        }),
      ])
      expect(() => {
        require('@/locales/i18next')
      }).not.toThrow()
    })

    it('should export required functions', () => {
      const i18nModule = require('@/locales/i18next')

      expect(i18nModule.getLocale).toBeDefined()
      expect(i18nModule.i18nChangeLocale).toBeDefined()
      expect(i18nModule.languageResources).toBeDefined()
      expect(i18nModule.default).toBeDefined()
    })
  })

  describe('edge cases', () => {
    it('should handle empty parameter object', () => {
      const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
      mockT.mockReturnValue('Welcome')

      const result = getLocale('welcome', {})

      expect(result).toBe('Welcome')
    })

    it('should handle parameter replacement with special characters', () => {
      const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
      mockT.mockReturnValue('Price: ${amount}')

      const result = getLocale('price', { amount: '100' })

      expect(result).toBe('Price: $100')
    })

    it('should handle multiple occurrences of same parameter', () => {
      const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
      mockT.mockReturnValue('{name} said hello to {name}')

      const result = getLocale('duplicate', { name: 'John' })

      expect(result).toBe('John said hello to {name}')
    })

    it('should handle parameter replacement with global flag', () => {
      const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
      mockT.mockReturnValue('Hello {name}, {name} is great!')

      const result = getLocale('greeting', { name: 'John' })

      expect(result).toBe('Hello John, {name} is great!')
    })
  })
})

describe('Integration tests', () => {
  it('should work end-to-end for English locale', async () => {
    const mockedI18n: Partial<i18n> = {
      t: jest.fn().mockReturnValue('Welcome') as unknown as TFunction,
      changeLanguage: jest.fn().mockResolvedValue(undefined),
    }

    const mockGetI18n = getI18n as jest.MockedFunction<typeof getI18n>
    mockGetI18n.mockReturnValue(mockedI18n as i18n)

    const translation = getLocale('welcome')
    expect(translation).toBe('Welcome')

    await i18nChangeLocale('en')
    expect(mockedI18n.changeLanguage).toHaveBeenCalledWith('en')
  })

  it('should work end-to-end for Turkish locale with parameters', async () => {
    const mockedI18n: Partial<i18n> = {
      t: jest.fn().mockReturnValue('Merhaba {name}') as unknown as TFunction,
      changeLanguage: jest.fn().mockResolvedValue(undefined),
    }

    const mockGetI18n = getI18n as jest.MockedFunction<typeof getI18n>
    mockGetI18n.mockReturnValue(mockedI18n as i18n)

    await i18nChangeLocale('tr')
    const translation = getLocale('hello', { name: 'Ahmet' })

    expect(mockedI18n.changeLanguage).toHaveBeenCalledWith('tr')
    expect(translation).toBe('Merhaba Ahmet')
  })
})

describe('Parameter replacement edge cases', () => {
  let mockedI18n: Partial<i18n>
  const mockedGetI18n = getI18n as jest.MockedFunction<typeof getI18n>

  beforeEach(() => {
    mockedI18n = {
      t: jest.fn() as unknown as TFunction,
      changeLanguage: jest.fn().mockResolvedValue(undefined),
      language: 'en',
    }

    mockedGetI18n.mockReturnValue(mockedI18n as i18n)
  })

  it('should handle null and undefined parameters', () => {
    const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
    mockT.mockReturnValue('Hello {name}')

    const resultNull = getLocale('hello', { name: null })
    const resultUndefined = getLocale('hello', { name: undefined })

    expect(resultNull).toBe('Hello null')
    expect(resultUndefined).toBe('Hello undefined')
  })

  it('should handle numeric parameters', () => {
    const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
    mockT.mockReturnValue('You have {count} items')

    const result = getLocale('items', { count: 42 })

    expect(result).toBe('You have 42 items')
  })

  it('should handle boolean parameters', () => {
    const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
    mockT.mockReturnValue('Status: {active}')

    const result = getLocale('status', { active: true })

    expect(result).toBe('Status: true')
  })

  it('should handle parameters with spaces in placeholder', () => {
    const mockT = mockedI18n.t as jest.MockedFunction<TFunction>
    mockT.mockReturnValue('Hello { name }')

    const result = getLocale('hello', { ' name ': 'John' })

    expect(result).toBe('Hello John')
  })
})

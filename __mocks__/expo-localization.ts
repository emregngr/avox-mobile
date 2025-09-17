export const createMockedLocale = (overrides = {}) => ({
  languageTag: 'en-US',
  languageCode: 'en',
  regionCode: 'US',
  languageScriptCode: null,
  languageRegionCode: 'US',
  languageCurrencyCode: 'USD',
  languageCurrencySymbol: '$',
  currencyCode: 'USD',
  currencySymbol: '$',
  decimalSeparator: '.',
  digitGroupingSeparator: ',',
  textDirection: 'ltr',
  measurementSystem: 'us',
  temperatureUnit: 'fahrenheit',
  ...overrides,
})

export const getLocales = jest.fn(() => [createMockedLocale()])

export const getCalendars = jest.fn(() => [createMockedLocale()])

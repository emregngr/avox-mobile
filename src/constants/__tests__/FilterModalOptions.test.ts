import * as optionGenerators from '@/constants/filterModalOptions'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

describe('Filter and Rating Option Generators', () => {
  const allFunctions = Object.entries(optionGenerators).filter(
    ([, value]) => typeof value === 'function',
  )

  const filterOptionFunctions = allFunctions.filter(([name]) => !name.includes('Rating'))
  const ratingFunctions = allFunctions.filter(([name]) => name.includes('Rating'))

  describe('Filter Option Generators', () => {
    test.each(filterOptionFunctions)(
      '%s should return a valid array of filter options',
      (_, generatorFunc) => {
        const options = (generatorFunc as any)()

        expect(Array.isArray(options)).toBe(true)
        expect(options.length).toBeGreaterThan(0)

        options.forEach((option: any) => {
          expect(option).toHaveProperty('label')
          expect(typeof option.label).toBe('string')
          expect(option).toHaveProperty('value')
          expect(typeof option.value).toBe('string')
        })

        expect(options).toMatchSnapshot()
      },
    )
  })

  describe('Rating Generators', () => {
    test.each(ratingFunctions)('%s should return an array of numbers', (_, generatorFunc) => {
      const ratings = (generatorFunc as any)()

      expect(Array.isArray(ratings)).toBe(true)
      expect(ratings.length).toBeGreaterThan(0)

      ratings.forEach((rating: any) => {
        expect(typeof rating).toBe('number')
      })

      expect(ratings).toMatchSnapshot()
    })
  })
})

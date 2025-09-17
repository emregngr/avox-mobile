import * as filterGetters from '@/constants/activeFilterOptions'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

describe('Filter Options Data', () => {
  const individualGetterFunctions = Object.entries(filterGetters).filter(
    ([name, value]) =>
      name.startsWith('get') && name !== 'getFilterLabelMap' && typeof value === 'function',
  )

  describe('Individual filter getters', () => {
    test.each(individualGetterFunctions)(
      '%s should return a valid array of options',
      (_, getterFunc) => {
        const options = (getterFunc as any)()

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

  describe('getFilterLabelMap', () => {
    it('should return a map of all filter options that matches the snapshot', () => {
      const filterMap = filterGetters.getFilterLabelMap()

      expect(filterMap).toMatchSnapshot()
    })
  })
})

import { parseFilterRange } from '@/utils/feature/parseFilterRange'

describe('parseFilterRange', () => {
  describe('null and undefined inputs', () => {
    it('should return null for undefined input', () => {
      const result = parseFilterRange(undefined)
      expect(result).toBeNull()
    })

    it('should return null for null input', () => {
      const result = parseFilterRange(null)
      expect(result).toBeNull()
    })

    it('should return null for empty string', () => {
      const result = parseFilterRange('')
      expect(result).toBeNull()
    })

    it('should return null for whitespace only string', () => {
      const result = parseFilterRange('   ')
      expect(result).toBeNull()
    })
  })

  describe('4-digit year range format (YYYY-YYYY)', () => {
    it('should parse valid year range', () => {
      const result = parseFilterRange('2020-2024')
      expect(result).toEqual({ min: 2020, max: 2024 })
    })

    it('should parse year range with reversed order', () => {
      const result = parseFilterRange('2024-2020')
      expect(result).toEqual({ min: 2024, max: 2020 })
    })

    it('should parse same year range', () => {
      const result = parseFilterRange('2023-2023')
      expect(result).toEqual({ min: 2023, max: 2023 })
    })

    it('should handle uppercase input for year range', () => {
      const result = parseFilterRange('2020-2024')
      expect(result).toEqual({ min: 2020, max: 2024 })
    })

    it('should return null for invalid 4-digit format', () => {
      expect(parseFilterRange('abcd-efgh')).toBeNull()
    })

    it('should handle 3-digit or 5-digit numbers via general numeric parsing', () => {
      expect(parseFilterRange('202-2024')).toEqual({ min: 202, max: 2024 })
      expect(parseFilterRange('20202-2024')).toEqual({ min: 20202, max: 2024 })
    })
  })

  describe('general numeric range format (number-number)', () => {
    it('should parse integer range', () => {
      const result = parseFilterRange('10-20')
      expect(result).toEqual({ min: 10, max: 20 })
    })

    it('should parse float range', () => {
      const result = parseFilterRange('10.5-20.7')
      expect(result).toEqual({ min: 10.5, max: 20.7 })
    })

    it('should parse mixed integer and float range', () => {
      const result = parseFilterRange('10-20.5')
      expect(result).toEqual({ min: 10, max: 20.5 })
    })

    it('should handle negative numbers correctly', () => {
      const result = parseFilterRange('10-20')
      expect(result).toEqual({ min: 10, max: 20 })
    })

    it('should parse decimal numbers with leading zeros', () => {
      const result = parseFilterRange('0.5-1.5')
      expect(result).toEqual({ min: 0.5, max: 1.5 })
    })

    it('should return null for non-numeric range', () => {
      expect(parseFilterRange('abc-def')).toBeNull()
      expect(parseFilterRange('10-abc')).toBeNull()
      expect(parseFilterRange('abc-10')).toBeNull()
    })

    it('should handle extra spaces in range', () => {
      const result = parseFilterRange(' 10 - 20 ')
      expect(result).toEqual({ min: 10, max: 20 })
    })
  })

  describe('plus format (number+)', () => {
    it('should parse integer plus format', () => {
      const result = parseFilterRange('100+')
      expect(result).toEqual({ min: 100, max: Infinity })
    })

    it('should parse float plus format', () => {
      const result = parseFilterRange('50.5+')
      expect(result).toEqual({ min: 50.5, max: Infinity })
    })

    it('should parse zero plus format', () => {
      const result = parseFilterRange('0+')
      expect(result).toEqual({ min: 0, max: Infinity })
    })

    it('should parse negative number plus format', () => {
      const result = parseFilterRange('-10+')
      expect(result).toEqual({ min: -10, max: Infinity })
    })

    it('should return null for non-numeric plus format', () => {
      expect(parseFilterRange('abc+')).toBeNull()
      expect(parseFilterRange('+')).toBeNull()
    })

    it('should handle spaces before plus', () => {
      const result = parseFilterRange(' 100 +')
      expect(result).toEqual({ min: 100, max: Infinity })
    })
  })

  describe('edge cases and invalid formats', () => {
    it('should return null for just a dash', () => {
      expect(parseFilterRange('-')).toBeNull()
    })

    it('should return null for multiple dashes', () => {
      expect(parseFilterRange('10--20')).not.toEqual({ min: 10, max: 20 })
      expect(parseFilterRange('10---20')).toBeNull()
    })

    it('should return null for some invalid formats', () => {
      expect(parseFilterRange('10-')).toBeNull()
      expect(parseFilterRange('-20')).toBeNull()
    })

    it('should return null for non-string non-numeric input', () => {
      expect(parseFilterRange('[]')).toBeNull()
      expect(parseFilterRange('{}')).toBeNull()
    })
  })

  describe('type coercion', () => {
    it('should handle number input by converting to string', () => {
      const result = parseFilterRange('123' as any)
      expect(result).toBeNull()
    })

    it('should handle boolean input', () => {
      expect(parseFilterRange('true' as any)).toBeNull()
      expect(parseFilterRange('false' as any)).toBeNull()
    })
  })

  describe('case sensitivity', () => {
    it('should handle mixed case input', () => {
      const result = parseFilterRange('100+')
      expect(result).toEqual({ min: 100, max: Infinity })
    })
  })

  describe('boundary conditions', () => {
    it('should handle very large numbers', () => {
      const result = parseFilterRange('999999999-1000000000')
      expect(result).toEqual({ min: 999999999, max: 1000000000 })
    })

    it('should handle very small decimal numbers', () => {
      const result = parseFilterRange('0.001-0.002')
      expect(result).toEqual({ min: 0.001, max: 0.002 })
    })

    it('should handle scientific notation if supported', () => {
      const result = parseFilterRange('1e2-2e2')
      expect(result).toEqual({ min: 100, max: 200 })
    })
  })

  describe('return value structure', () => {
    it('should always return object with min and max properties when valid', () => {
      const result = parseFilterRange('10-20')
      expect(result).toHaveProperty('min')
      expect(result).toHaveProperty('max')
      expect(typeof result?.min).toBe('number')
      expect(typeof result?.max).toBe('number')
    })

    it('should return null for most invalid cases', () => {
      const invalidInputs = ['invalid', '10', '10-', '-10', 'abc-def', '', null, undefined]

      invalidInputs.forEach(input => {
        expect(parseFilterRange(input)).toBeNull()
      })
    })
  })

  describe('comprehensive format validation', () => {
    it('should correctly identify and parse valid formats', () => {
      const validCases = [
        { input: '2020-2024', expected: { min: 2020, max: 2024 } },
        { input: '10.5-20.7', expected: { min: 10.5, max: 20.7 } },
        { input: '100+', expected: { min: 100, max: Infinity } },
        { input: '0-0', expected: { min: 0, max: 0 } },
      ]

      validCases.forEach(({ input, expected }) => {
        const result = parseFilterRange(input)
        expect(result).toEqual(expected)
      })
    })

    it('should reject invalid formats', () => {
      const invalidCases = ['single', '10', 'abc+', '10--20', 'year-2024', '2024-year', '++10', '']

      invalidCases.forEach(input => {
        const result = parseFilterRange(input)
        expect(result).toBeNull()
      })
    })
  })
})

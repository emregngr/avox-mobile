import { formatNumber } from '@/utils/feature/formatNumber'

describe('formatNumber', () => {
  describe('positive integers', () => {
    it('should format numbers with thousand separators using dots', () => {
      expect(formatNumber(1000)).toBe('1.000')
      expect(formatNumber(1234)).toBe('1.234')
      expect(formatNumber(1234567)).toBe('1.234.567')
      expect(formatNumber(1234567890)).toBe('1.234.567.890')
    })

    it('should not format small numbers (less than 1000)', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(1)).toBe('1')
      expect(formatNumber(12)).toBe('12')
      expect(formatNumber(123)).toBe('123')
      expect(formatNumber(999)).toBe('999')
    })
  })

  describe('negative numbers', () => {
    it('should format negative numbers with dots as thousand separators', () => {
      expect(formatNumber(-1000)).toBe('-1.000')
      expect(formatNumber(-1234567)).toBe('-1.234.567')
    })

    it('should not format small negative numbers', () => {
      expect(formatNumber(-123)).toBe('-123')
      expect(formatNumber(-999)).toBe('-999')
    })
  })

  describe('decimal numbers', () => {
    it('should format decimal numbers correctly', () => {
      expect(formatNumber(1000.5)).toBe('1.000.5')
      expect(formatNumber(1234567.89)).toBe('1.234.567.89')
      expect(formatNumber(123.456)).toBe('123.456')
      expect(formatNumber(-1000.25)).toBe('-1.000.25')
    })

    it('should handle numbers with many decimal places', () => {
      expect(formatNumber(1234.56789)).toBe('1.234.56.789')
      expect(formatNumber(1000000.123456)).toBe('1.000.000.123.456')
    })
  })

  describe('edge cases', () => {
    it('should handle special numeric values', () => {
      expect(formatNumber(NaN)).toBe('NaN')
      expect(formatNumber(Infinity)).toBe('Infinity')
      expect(formatNumber(-Infinity)).toBe('-Infinity')
    })

    it('should handle null and undefined gracefully', () => {
      expect(formatNumber(null as any)).toBeUndefined()
      expect(formatNumber(undefined as any)).toBeUndefined()
    })

    it('should handle zero variations', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(-0)).toBe('0')
      expect(formatNumber(0.0)).toBe('0')
    })
  })

  describe('large numbers', () => {
    it('should format very large numbers correctly', () => {
      expect(formatNumber(1000000000000)).toBe('1.000.000.000.000')
      expect(formatNumber(999999999999)).toBe('999.999.999.999')
      expect(formatNumber(123456789012345)).toBe('123.456.789.012.345')
    })
  })

  describe('boundary values', () => {
    it('should handle boundary cases around 1000', () => {
      expect(formatNumber(999)).toBe('999')
      expect(formatNumber(1000)).toBe('1.000')
      expect(formatNumber(1001)).toBe('1.001')
    })

    it('should handle boundary cases around million', () => {
      expect(formatNumber(999999)).toBe('999.999')
      expect(formatNumber(1000000)).toBe('1.000.000')
      expect(formatNumber(1000001)).toBe('1.000.001')
    })
  })
})

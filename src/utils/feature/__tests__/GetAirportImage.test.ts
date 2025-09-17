import { getAirportImage } from '@/utils/feature/getAirportImage'
import { AirportBadgeType } from '@/utils/feature/getBadge'

jest.mock('@/assets/images/airport/large_airport.webp', () => 'mocked-large-airport.webp', {
  virtual: true,
})
jest.mock('@/assets/images/airport/medium_airport.webp', () => 'mocked-medium-airport.webp', {
  virtual: true,
})
jest.mock('@/assets/images/airport/mega_airport.webp', () => 'mocked-mega-airport.webp', {
  virtual: true,
})
jest.mock('@/assets/images/airport/small_airport.webp', () => 'mocked-small-airport.webp', {
  virtual: true,
})

const mockedAirportBadgeTypes = {
  SmallAirport: 'small_airport',
  MediumAirport: 'medium_airport',
  LargeAirport: 'large_airport',
  MegaAirport: 'mega_airport',
}

describe('getAirportImage', () => {
  describe('valid airport types', () => {
    it('should return correct image for SmallAirport', () => {
      const result = getAirportImage(AirportBadgeType.SmallAirport)
      expect(result).toBe('mocked-small-airport.webp')
    })

    it('should return correct image for MediumAirport', () => {
      const result = getAirportImage(AirportBadgeType.MediumAirport)
      expect(result).toBe('mocked-medium-airport.webp')
    })

    it('should return correct image for LargeAirport', () => {
      const result = getAirportImage(AirportBadgeType.LargeAirport)
      expect(result).toBe('mocked-large-airport.webp')
    })

    it('should return correct image for MegaAirport', () => {
      const result = getAirportImage(AirportBadgeType.MegaAirport)
      expect(result).toBe('mocked-mega-airport.webp')
    })
  })

  describe('edge cases', () => {
    it('should return small_airport image for undefined input', () => {
      const result = getAirportImage(undefined as any)
      expect(result).toBe('mocked-small-airport.webp')
    })

    it('should return small_airport image for null input', () => {
      const result = getAirportImage(null as any)
      expect(result).toBe('mocked-small-airport.webp')
    })

    it('should return small_airport image for invalid airport type', () => {
      const result = getAirportImage('invalid_type' as any)
      expect(result).toBe('mocked-small-airport.webp')
    })

    it('should return small_airport image for empty string', () => {
      const result = getAirportImage('' as any)
      expect(result).toBe('mocked-small-airport.webp')
    })
  })

  describe('all enum values coverage', () => {
    it('should handle all possible AirportBadgeType enum values', () => {
      const AirportBadgeTypes = Object.values(AirportBadgeType)

      AirportBadgeTypes.forEach(type => {
        const result = getAirportImage(type)
        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })
  })

  describe('return type validation', () => {
    it('should always return a string', () => {
      const validTypes = [
        AirportBadgeType.SmallAirport,
        AirportBadgeType.MediumAirport,
        AirportBadgeType.LargeAirport,
        AirportBadgeType.MegaAirport,
      ]

      validTypes.forEach(type => {
        const result = getAirportImage(type)
        expect(typeof result).toBe('string')
      })
    })

    it('should never return null or undefined', () => {
      const testCases = [AirportBadgeType.SmallAirport, undefined, null, 'invalid', '']

      testCases.forEach(testCase => {
        const result = getAirportImage(testCase as any)
        expect(result).not.toBeNull()
        expect(result).not.toBeUndefined()
      })
    })
  })
})

describe('getAirportImage - with specific enum values', () => {
  it('should map enum values correctly to image paths', () => {
    Object.entries(mockedAirportBadgeTypes).forEach(([enumKey, enumValue]) => {
      const result = getAirportImage(enumValue as AirportBadgeType)
      expect(result).toContain('mocked')
      expect(result).toContain('.webp')
    })
  })
})

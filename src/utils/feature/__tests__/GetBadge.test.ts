import {
  AirlineBadgeType,
  AirportBadgeType,
  getAirlineBadge,
  getAirportBadge,
} from '@/utils/feature/getBadge'

jest.mock('@/assets/images/badge/large.webp', () => 'mocked-large-badge.webp', { virtual: true })
jest.mock('@/assets/images/badge/medium.webp', () => 'mocked-medium-badge.webp', { virtual: true })
jest.mock('@/assets/images/badge/mega.webp', () => 'mocked-mega-badge.webp', { virtual: true })
jest.mock('@/assets/images/badge/small.webp', () => 'mocked-small-badge.webp', { virtual: true })

describe('Airport and Airline Badge Functions', () => {
  describe('getAirportBadge', () => {
    describe('valid airport types', () => {
      it('should return correct badge for SmallAirport', () => {
        const result = getAirportBadge(AirportBadgeType.SmallAirport)
        expect(result).toBe('mocked-small-badge.webp')
      })

      it('should return correct badge for MediumAirport', () => {
        const result = getAirportBadge(AirportBadgeType.MediumAirport)
        expect(result).toBe('mocked-medium-badge.webp')
      })

      it('should return correct badge for LargeAirport', () => {
        const result = getAirportBadge(AirportBadgeType.LargeAirport)
        expect(result).toBe('mocked-large-badge.webp')
      })

      it('should return correct badge for MegaAirport', () => {
        const result = getAirportBadge(AirportBadgeType.MegaAirport)
        expect(result).toBe('mocked-mega-badge.webp')
      })
    })

    describe('edge cases', () => {
      it('should return small_airport badge for undefined input', () => {
        const result = getAirportBadge(undefined as any)
        expect(result).toBe('mocked-small-badge.webp')
      })

      it('should return small_airport badge for null input', () => {
        const result = getAirportBadge(null as any)
        expect(result).toBe('mocked-small-badge.webp')
      })

      it('should return small_airport badge for invalid airport type', () => {
        const result = getAirportBadge('invalid_type' as any)
        expect(result).toBe('mocked-small-badge.webp')
      })

      it('should return small_airport badge for empty string', () => {
        const result = getAirportBadge('' as any)
        expect(result).toBe('mocked-small-badge.webp')
      })
    })

    describe('all enum values coverage', () => {
      it('should handle all possible AirportBadgeType enum values', () => {
        const AirportBadgeTypes = Object.values(AirportBadgeType)

        AirportBadgeTypes.forEach(type => {
          const result = getAirportBadge(type)
          expect(result).toBeDefined()
          expect(typeof result).toBe('string')
          expect(result.length).toBeGreaterThan(0)
          expect(result).toContain('.webp')
        })
      })
    })

    describe('return type validation', () => {
      it('should always return a string', () => {
        const validTypes = Object.values(AirportBadgeType)

        validTypes.forEach(type => {
          const result = getAirportBadge(type)
          expect(typeof result).toBe('string')
        })
      })

      it('should never return null or undefined', () => {
        const testCases = [AirportBadgeType.SmallAirport, undefined, null, 'invalid', '']

        testCases.forEach(testCase => {
          const result = getAirportBadge(testCase as any)
          expect(result).not.toBeNull()
          expect(result).not.toBeUndefined()
        })
      })
    })
  })

  describe('getAirlineBadge', () => {
    describe('valid airline types', () => {
      it('should return correct badge for Cargo', () => {
        const result = getAirlineBadge(AirlineBadgeType.Cargo)
        expect(result).toBe('mocked-small-badge.webp')
      })

      it('should return correct badge for LowCost', () => {
        const result = getAirlineBadge(AirlineBadgeType.LowCost)
        expect(result).toBe('mocked-medium-badge.webp')
      })

      it('should return correct badge for Regional', () => {
        const result = getAirlineBadge(AirlineBadgeType.Regional)
        expect(result).toBe('mocked-large-badge.webp')
      })

      it('should return correct badge for MajorInternational', () => {
        const result = getAirlineBadge(AirlineBadgeType.MajorInternational)
        expect(result).toBe('mocked-mega-badge.webp')
      })
    })

    describe('edge cases', () => {
      it('should return cargo badge for undefined input', () => {
        const result = getAirlineBadge(undefined as any)
        expect(result).toBe('mocked-small-badge.webp')
      })

      it('should return cargo badge for null input', () => {
        const result = getAirlineBadge(null as any)
        expect(result).toBe('mocked-small-badge.webp')
      })

      it('should return cargo badge for invalid airline type', () => {
        const result = getAirlineBadge('invalid_type' as any)
        expect(result).toBe('mocked-small-badge.webp')
      })

      it('should return cargo badge for empty string', () => {
        const result = getAirlineBadge('' as any)
        expect(result).toBe('mocked-small-badge.webp')
      })
    })

    describe('all enum values coverage', () => {
      it('should handle all possible AirlineBadgeType enum values', () => {
        const AirlineBadgeTypes = Object.values(AirlineBadgeType)

        AirlineBadgeTypes.forEach(type => {
          const result = getAirlineBadge(type)
          expect(result).toBeDefined()
          expect(typeof result).toBe('string')
          expect(result.length).toBeGreaterThan(0)
          expect(result).toContain('.webp')
        })
      })
    })

    describe('return type validation', () => {
      it('should always return a string', () => {
        const validTypes = Object.values(AirlineBadgeType)

        validTypes.forEach(type => {
          const result = getAirlineBadge(type)
          expect(typeof result).toBe('string')
        })
      })

      it('should never return null or undefined', () => {
        const testCases = [AirlineBadgeType.Cargo, undefined, null, 'invalid', '']

        testCases.forEach(testCase => {
          const result = getAirlineBadge(testCase as any)
          expect(result).not.toBeNull()
          expect(result).not.toBeUndefined()
        })
      })
    })
  })

  describe('cross-function consistency', () => {
    it('should use the same badge images for same badge types', () => {
      const airportSmall = getAirportBadge(AirportBadgeType.SmallAirport)
      const airlineCargo = getAirlineBadge(AirlineBadgeType.Cargo)
      expect(airportSmall).toBe(airlineCargo)

      const airportMedium = getAirportBadge(AirportBadgeType.MediumAirport)
      const airlineLowCost = getAirlineBadge(AirlineBadgeType.LowCost)
      expect(airportMedium).toBe(airlineLowCost)

      const airportLarge = getAirportBadge(AirportBadgeType.LargeAirport)
      const airlineRegional = getAirlineBadge(AirlineBadgeType.Regional)
      expect(airportLarge).toBe(airlineRegional)

      const airportMega = getAirportBadge(AirportBadgeType.MegaAirport)
      const airlineMajor = getAirlineBadge(AirlineBadgeType.MajorInternational)
      expect(airportMega).toBe(airlineMajor)
    })
  })

  describe('enum value mapping verification', () => {
    it('should correctly map AirportBadgeType enum values to expected badges', () => {
      const expectedMappings = {
        [AirportBadgeType.SmallAirport]: 'mocked-small-badge.webp',
        [AirportBadgeType.MediumAirport]: 'mocked-medium-badge.webp',
        [AirportBadgeType.LargeAirport]: 'mocked-large-badge.webp',
        [AirportBadgeType.MegaAirport]: 'mocked-mega-badge.webp',
      }

      Object.entries(expectedMappings).forEach(([enumValue, expectedBadge]) => {
        const result = getAirportBadge(enumValue as AirportBadgeType)
        expect(result).toBe(expectedBadge)
      })
    })

    it('should correctly map AirlineBadgeType enum values to expected badges', () => {
      const expectedMappings = {
        [AirlineBadgeType.Cargo]: 'mocked-small-badge.webp',
        [AirlineBadgeType.LowCost]: 'mocked-medium-badge.webp',
        [AirlineBadgeType.Regional]: 'mocked-large-badge.webp',
        [AirlineBadgeType.MajorInternational]: 'mocked-mega-badge.webp',
      }

      Object.entries(expectedMappings).forEach(([enumValue, expectedBadge]) => {
        const result = getAirlineBadge(enumValue as AirlineBadgeType)
        expect(result).toBe(expectedBadge)
      })
    })
  })

  describe('performance and consistency tests', () => {
    it('should return consistent results for multiple calls', () => {
      const airportBadgeType = AirportBadgeType.LargeAirport
      const airlineBadgeType = AirlineBadgeType.MajorInternational

      const airportResult1 = getAirportBadge(airportBadgeType)
      const airportResult2 = getAirportBadge(airportBadgeType)
      expect(airportResult1).toBe(airportResult2)

      const airlineResult1 = getAirlineBadge(airlineBadgeType)
      const airlineResult2 = getAirlineBadge(airlineBadgeType)
      expect(airlineResult1).toBe(airlineResult2)
    })
  })
})

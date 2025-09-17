import type { ImageKeyType } from '@/utils/feature/getAirplaneImage'
import { getAirplaneImageKey, getAirplaneImageSource } from '@/utils/feature/getAirplaneImage'

jest.mock('@/assets/images/airplane/airbus_a320neo.webp', () => 'mocked-airbus-a320neo', {
  virtual: true,
})
jest.mock('@/assets/images/airplane/airbus_a350-900.webp', () => 'mocked-airbus-a350-900', {
  virtual: true,
})
jest.mock('@/assets/images/airplane/boeing_737-800.webp', () => 'mocked-boeing-737-800', {
  virtual: true,
})

describe('getAirplaneImageKey', () => {
  describe('default behavior', () => {
    it('should return default image for undefined input', () => {
      expect(getAirplaneImageKey(undefined as any)).toBe('airbus_a320neo')
    })

    it('should return default image for null input', () => {
      expect(getAirplaneImageKey(null as any)).toBe('airbus_a320neo')
    })

    it('should return default image for empty string', () => {
      expect(getAirplaneImageKey('')).toBe('airbus_a320neo')
    })

    it('should return default image for unknown airplane type', () => {
      expect(getAirplaneImageKey('unknown airplane')).toBe('airbus_a320neo')
    })
  })

  describe('exact file name matching', () => {
    it('should match exact file names when normalized', () => {
      expect(getAirplaneImageKey('airbus a320neo')).toBe('airbus_a320neo')
      expect(getAirplaneImageKey('airbus a350 900')).toBe('airbus_a350-900')
      expect(getAirplaneImageKey('boeing 787 9')).toBe('boeing_787-9')
      expect(getAirplaneImageKey('boeing 747 8')).toBe('boeing_747-8')
    })

    it('should handle different spacing and hyphen combinations', () => {
      expect(getAirplaneImageKey('atr 72 600')).toBe('atr_72-600')
      expect(getAirplaneImageKey('bombardier q400')).toBe('bombardier_q400')
    })
  })

  describe('specific mappings', () => {
    it('should map Airbus variants correctly', () => {
      expect(getAirplaneImageKey('airbus a319')).toBe('airbus_a320neo')
      expect(getAirplaneImageKey('airbus a321')).toBe('airbus_a320neo')
      expect(getAirplaneImageKey('airbus a350-1000')).toBe('airbus_a350-900')
      expect(getAirplaneImageKey('AIRBUS A380-800')).toBe('airbus_a380-800')
    })

    it('should map Boeing variants correctly', () => {
      expect(getAirplaneImageKey('boeing 737 max')).toBe('boeing_737-800')
      expect(getAirplaneImageKey('boeing 737-900')).toBe('boeing_737-800')
      expect(getAirplaneImageKey('boeing 747-400')).toBe('boeing_747-8')
      expect(getAirplaneImageKey('boeing 747-400er')).toBe('boeing_747-8')
      expect(getAirplaneImageKey('boeing 777-200')).toBe('boeing_777-300ER')
      expect(getAirplaneImageKey('boeing 787-8')).toBe('boeing_787-9')
      expect(getAirplaneImageKey('boeing 787-10')).toBe('boeing_787-9')
    })

    it('should map other manufacturer variants correctly', () => {
      expect(getAirplaneImageKey('embraer e195')).toBe('embraer_e190')
      expect(getAirplaneImageKey('bombardier q400')).toBe('bombardier_q400')
    })

    it('should handle case insensitive specific mappings', () => {
      expect(getAirplaneImageKey('BOEING 737 MAX')).toBe('boeing_737-800')
      expect(getAirplaneImageKey('Airbus A319')).toBe('airbus_a320neo')
    })
  })

  describe('freight aircraft rule', () => {
    it('should map freight aircraft ending with "f" to douglas md-11f', () => {
      expect(getAirplaneImageKey('boeing 747-400f')).toBe('boeing_747-8')
      expect(getAirplaneImageKey('boeing 747-8f')).toBe('boeing_747-8')
      expect(getAirplaneImageKey('cargo freighterf')).toBe('douglas_md-11f')
      expect(getAirplaneImageKey('unknown planef')).toBe('douglas_md-11f')
    })

    it('should not apply freight rule to embraer aircraft', () => {
      expect(getAirplaneImageKey('embraer somethingf')).not.toBe('douglas_md-11f')
    })

    it('should apply freight rule when no other matches found', () => {
      expect(getAirplaneImageKey('unknown freightf')).toBe('douglas_md-11f')
    })
  })

  describe('family mappings', () => {
    it('should map Airbus families correctly', () => {
      expect(getAirplaneImageKey('Airbus A220 variant')).toBe('airbus_a320neo')
      expect(getAirplaneImageKey('airbus a330 something')).toBe('airbus_a350-900')
      expect(getAirplaneImageKey('AIRBUS A340')).toBe('airbus_a350-900')
      expect(getAirplaneImageKey('airbus a380')).toBe('airbus_a380-800')
    })

    it('should map Boeing families correctly', () => {
      expect(getAirplaneImageKey('Boeing 717 variant')).toBe('boeing_737-800')
      expect(getAirplaneImageKey('boeing 737')).toBe('boeing_737-800')
      expect(getAirplaneImageKey('Boeing 747')).toBe('boeing_747-8')
      expect(getAirplaneImageKey('boeing 757')).toBe('boeing_777-300ER')
      expect(getAirplaneImageKey('Boeing 767')).toBe('boeing_777-300ER')
      expect(getAirplaneImageKey('boeing 777')).toBe('boeing_777-300ER')
      expect(getAirplaneImageKey('Boeing 787')).toBe('boeing_787-9')
    })

    it('should map regional aircraft families correctly', () => {
      expect(getAirplaneImageKey('ATR something')).toBe('atr_72-600')
      expect(getAirplaneImageKey('Bombardier CRJ')).toBe('embraer_e190')
      expect(getAirplaneImageKey('bombardier q')).toBe('bombardier_q400')
      expect(getAirplaneImageKey('Embraer E series')).toBe('embraer_e190')
    })

    it('should map other manufacturer families correctly', () => {
      expect(getAirplaneImageKey('Antonov aircraft')).toBe('antonov_an-148')
      expect(getAirplaneImageKey('cessna citation')).toBe('cessna_citation_cj4')
      expect(getAirplaneImageKey('Comac aircraft')).toBe('comac_c919')
      expect(getAirplaneImageKey('Douglas MD variant')).toBe('douglas_md-11f')
      expect(getAirplaneImageKey('Fokker aircraft')).toBe('fokker_100')
      expect(getAirplaneImageKey('Ilyushin plane')).toBe('ilyushin_II-76')
      expect(getAirplaneImageKey('Sukhoi aircraft')).toBe('boeing_737-800')
      expect(getAirplaneImageKey('Tupolev plane')).toBe('ilyushin_II-76')
    })

    it('should handle case insensitive family matching', () => {
      expect(getAirplaneImageKey('atr something')).toBe('atr_72-600')
      expect(getAirplaneImageKey('BOEING 737')).toBe('boeing_737-800')
      expect(getAirplaneImageKey('embraer e')).toBe('embraer_e190')
    })

    it('should match partial family names', () => {
      expect(getAirplaneImageKey('Some Airbus A320 variant')).toBe('airbus_a320neo')
      expect(getAirplaneImageKey('This is a Boeing 777')).toBe('boeing_777-300ER')
    })
  })

  describe('priority order', () => {
    it('should prioritize exact file name match over specific mappings', () => {
      expect(getAirplaneImageKey('airbus a320neo')).toBe('airbus_a320neo')
      expect(getAirplaneImageKey('bombardier q400')).toBe('bombardier_q400')
    })

    it('should prioritize specific mappings over freight rule', () => {
      expect(getAirplaneImageKey('boeing 747-8f')).toBe('boeing_747-8')
    })

    it('should prioritize freight rule over family mappings for unknown aircraft', () => {
      expect(getAirplaneImageKey('unknown freightf')).toBe('douglas_md-11f')
    })
  })

  describe('edge cases', () => {
    it('should fall back to default for strings with special characters that dont match patterns', () => {
      expect(getAirplaneImageKey('boeing@737#variant')).toBe('airbus_a320neo')
    })

    it('should handle very long strings', () => {
      const longString =
        'This is a very long description of an Airbus A320neo aircraft with many details'
      expect(getAirplaneImageKey(longString)).toBe('airbus_a320neo')
    })

    it('should handle strings with numbers only', () => {
      expect(getAirplaneImageKey('737800')).toBe('airbus_a320neo')
    })

    it('should handle family matching in strings', () => {
      expect(getAirplaneImageKey('This is a Boeing 737 aircraft')).toBe('boeing_737-800')
      expect(getAirplaneImageKey('Flying on Airbus A320 today')).toBe('airbus_a320neo')
    })
  })
})

describe('getAirplaneImageSource', () => {
  it('should return correct image source for valid image keys', () => {
    expect(getAirplaneImageSource('airbus_a320neo')).toBeDefined()
    expect(getAirplaneImageSource('boeing_737-800')).toBeDefined()
    expect(getAirplaneImageSource('airbus_a350-900')).toBeDefined()
  })

  it('should handle all available image types', () => {
    const imageTypes: ImageKeyType[] = [
      'airbus_a320neo',
      'airbus_a350-900',
      'airbus_a380-800',
      'antonov_an-148',
      'atr_72-600',
      'boeing_737-800',
      'boeing_747-8',
      'boeing_777-300ER',
      'boeing_787-9',
      'bombardier_q400',
      'cessna_citation_cj4',
      'comac_c919',
      'douglas_md-11f',
      'embraer_e190',
      'fokker_100',
      'ilyushin_II-76',
    ]

    imageTypes.forEach(imageType => {
      expect(getAirplaneImageSource(imageType)).toBeDefined()
    })
  })

  it('should return undefined for invalid image keys', () => {
    expect(getAirplaneImageSource('invalid_key' as ImageKeyType)).toBeUndefined()
  })
})

describe('integration tests', () => {
  it('should work end-to-end for common airplane types', () => {
    const testCases = [
      { input: 'Boeing 737-800', expectedKey: 'boeing_737-800' },
      { input: 'Airbus A320neo', expectedKey: 'airbus_a320neo' },
      { input: 'Boeing 787-9', expectedKey: 'boeing_787-9' },
      { input: 'Embraer E190', expectedKey: 'embraer_e190' },
      { input: 'ATR 72-600', expectedKey: 'atr_72-600' },
    ]

    testCases.forEach(({ input, expectedKey }) => {
      const imageKey = getAirplaneImageKey(input)
      expect(imageKey).toBe(expectedKey)

      const imageSource = getAirplaneImageSource(imageKey)
      expect(imageSource).toBeDefined()
    })
  })

  it('should handle complex airplane descriptions', () => {
    const complexInputs = [
      'Turkish Airlines Boeing 737-800 (winglets)',
      'Lufthansa Airbus A350-900 XWB',
      'Emirates Airbus A380-800 (3-class)',
      'American Airlines Boeing 777-300ER',
    ]

    complexInputs.forEach(input => {
      const imageKey = getAirplaneImageKey(input)
      expect(imageKey).toBeDefined()

      const imageSource = getAirplaneImageSource(imageKey)
      expect(imageSource).toBeDefined()
    })
  })
})

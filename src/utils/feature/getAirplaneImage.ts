const imageFiles = {
  airbus_a320neo: require('@/assets/images/aircraft/airbus_a320neo.webp'),
  'airbus_a350-900': require('@/assets/images/aircraft/airbus_a350-900.webp'),
  'airbus_a380-800': require('@/assets/images/aircraft/airbus_a380-800.webp'),
  'antonov_an-148': require('@/assets/images/aircraft/antonov_an-148.webp'),
  'atr_72-600': require('@/assets/images/aircraft/atr_72-600.webp'),
  'boeing_737-800': require('@/assets/images/aircraft/boeing_737-800.webp'),
  'boeing_747-8': require('@/assets/images/aircraft/boeing_747-8.webp'),
  'boeing_777-300ER': require('@/assets/images/aircraft/boeing_777-300ER.webp'),
  'boeing_787-9': require('@/assets/images/aircraft/boeing_787-9.webp'),
  bombardier_q400: require('@/assets/images/aircraft/bombardier_q400.webp'),
  cessna_citation_cj4: require('@/assets/images/aircraft/cessna_citation_cj4.webp'),
  comac_c919: require('@/assets/images/aircraft/comac_c919.webp'),
  'douglas_md-11f': require('@/assets/images/aircraft/douglas_md-11f.webp'),
  embraer_e190: require('@/assets/images/aircraft/embraer_e190.webp'),
  fokker_100: require('@/assets/images/aircraft/fokker_100.webp'),
  'ilyushin_II-76': require('@/assets/images/aircraft/ilyushin_II-76.webp'),
}

const imageList = [
  'airbus_a320neo',
  'airbus_a350-900',
  'airbus_a380-800',
  'boeing_737-800',
  'boeing_747-8',
  'boeing_777-300ER',
  'boeing_787-9',
  'embraer_e190',
  'bombardier_q400',
  'atr_72-600',
  'ilyushin_II-76',
  'antonov_an-148',
  'cessna_citation_cj4',
  'comac_c919',
  'douglas_md-11f',
  'fokker_100',
] as const

type ImageType = (typeof imageList)[number]

const specificMappings: { [key: string]: ImageType } = {
  'airbus a319': 'airbus_a320neo',
  'airbus a320neo': 'airbus_a320neo',
  'airbus a321': 'airbus_a320neo',
  'airbus a350-1000': 'airbus_a350-900',
  'airbus a350-900': 'airbus_a350-900',
  'airbus a380-800': 'airbus_a380-800',
  'atr 72-600': 'atr_72-600',
  'boeing 737 max': 'boeing_737-800',
  'boeing 737-800': 'boeing_737-800',
  'boeing 737-900': 'boeing_737-800',
  'boeing 747-400': 'boeing_747-8',
  'boeing 747-400er': 'boeing_747-8',
  'boeing 747-400f': 'boeing_747-8',
  'boeing 747-8': 'boeing_747-8',
  'boeing 747-8f': 'boeing_747-8',
  'boeing 747-8i': 'boeing_747-8',
  'boeing 777-200': 'boeing_777-300ER',
  'boeing 777-300er': 'boeing_777-300ER',
  'boeing 787-10': 'boeing_787-9',
  'boeing 787-8': 'boeing_787-9',
  'boeing 787-9': 'boeing_787-9',
  'bombardier q400': 'bombardier_q400',
  'embraer e190': 'embraer_e190',
  'embraer e195': 'embraer_e190',
}

const familyMappings: { [key: string]: ImageType } = {
  ATR: 'atr_72-600',
  'Airbus A220': 'airbus_a320neo',
  'Airbus A300': 'airbus_a320neo',
  'Airbus A310': 'airbus_a320neo',
  'Airbus A318': 'airbus_a320neo',
  'Airbus A320': 'airbus_a320neo',
  'Airbus A330': 'airbus_a350-900',
  'Airbus A340': 'airbus_a350-900',
  'Airbus A350': 'airbus_a350-900',
  'Airbus A380': 'airbus_a380-800',
  Antonov: 'antonov_an-148',
  Beechcraft: 'cessna_citation_cj4',
  'Boeing 717': 'boeing_737-800',
  'Boeing 737': 'boeing_737-800',
  'Boeing 747': 'boeing_747-8',
  'Boeing 757': 'boeing_777-300ER',
  'Boeing 767': 'boeing_777-300ER',
  'Boeing 777': 'boeing_777-300ER',
  'Boeing 787': 'boeing_787-9',
  'Bombardier CRJ': 'embraer_e190',
  'Bombardier Q': 'bombardier_q400',
  Cessna: 'cessna_citation_cj4',
  Comac: 'comac_c919',
  'De Havilland': 'bombardier_q400',
  'Douglas MD': 'douglas_md-11f',
  'Embraer E': 'embraer_e190',
  Falcon: 'cessna_citation_cj4',
  Fokker: 'fokker_100',
  Ilyushin: 'ilyushin_II-76',
  Jetstream: 'atr_72-600',
  Saab: 'atr_72-600',
  Sukhoi: 'boeing_737-800',
  Tupolev: 'ilyushin_II-76',
}

const getAirplaneImageKey = (aircraftType: string): ImageType => {
  const defaultImage: ImageType = 'airbus_a320neo'
  let imageName: ImageType = defaultImage

  const normalizedForFile = aircraftType?.toLowerCase()?.replace(/[\s-]/g, '_')
  const normalizedLower = aircraftType?.toLowerCase()

  if (imageList?.some(img => img === normalizedForFile)) {
    imageName = normalizedForFile as ImageType
  } else if (specificMappings?.[normalizedLower]) {
    imageName = specificMappings?.[normalizedLower]
  } else if (normalizedLower?.endsWith('f') && !normalizedLower?.includes('embraer')) {
    imageName = 'douglas_md-11f'
  } else {
    for (const [family, image] of Object?.entries(familyMappings)) {
      if (normalizedLower?.includes(family?.toLowerCase())) {
        imageName = image
        break
      }
    }
  }

  return imageName
}

const getAirplaneImageSource = (imageKey: ImageType): string => imageFiles?.[imageKey]

export { getAirplaneImageKey, getAirplaneImageSource, ImageType }

import { render } from '@testing-library/react-native'

import { Certifications } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Certifications'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedAirportSectionRow = jest.fn()

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')
  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/components/feature/Airport/AirportDetail/AirportSectionRow', () => {
  const { View } = require('react-native')
  return {
    AirportSectionRow: (props: any) => {
      mockedAirportSectionRow(props)
      return <View testID="mocked-section-row">{props.children}</View>
    },
  }
})

const mockedSafety = {
  certifications: ['ISO 9001', 'ISO 14001'],
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedGetLocale.mockReturnValue('Certificates')
})

describe('Certifications Component', () => {
  it('should render the section with the correct title', async () => {
    await render(<Certifications safety={mockedSafety} />)
    expect(mockedGetLocale).toHaveBeenCalledWith('certifications')
    expect(mockedAirportSectionRow).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Certificates' }),
    )
  })

  it('should render the certifications text by joining the array', async () => {
    const { getByText } = await render(<Certifications safety={mockedSafety} />)
    expect(getByText('ISO 9001ISO 14001')).toBeTruthy()
  })

  it('should pass correct props to child components', async () => {
    await render(<Certifications safety={mockedSafety} />)
  })

  it('should render gracefully if safety or certifications are missing', async () => {
    const { rerender } = await render(<Certifications safety={undefined as any} />)

    await rerender(<Certifications safety={{} as any} />)
  })
})

describe('Certifications Component Snapshot', () => {
  it('should render the Certifications Component successfully', async () => {
    const { toJSON } = await render(<Certifications safety={mockedSafety} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

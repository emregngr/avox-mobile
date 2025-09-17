import { render } from '@testing-library/react-native'

import { CertificationsList } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Cards/CertificationsList'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock(
  '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Cards/CertificationCard',
  () => {
    const { View, Text } = require('react-native')

    return {
      CertificationCard: ({ certification }: { certification: string }) => (
        <View testID="certification-card">
          <Text>{certification}</Text>
        </View>
      ),
    }
  },
)

const mockedTitle = 'Industry Certifications'
const mockedIconColor = '#FFA500'
const mockedCertifications = ['IOSA Certified', 'EASA Compliant', 'Stage 4 Noise Certified']

describe('CertificationsList Component', () => {
  it('should render the title and a card for each certification', () => {
    const { getByText, getAllByTestId } = render(
      <CertificationsList
        certifications={mockedCertifications}
        iconColor={mockedIconColor}
        title={mockedTitle}
      />,
    )

    expect(getByText(`${mockedTitle}:`)).toBeTruthy()

    const cards = getAllByTestId('certification-card')
    expect(cards).toHaveLength(mockedCertifications.length)

    mockedCertifications.forEach(certText => {
      expect(getByText(certText)).toBeTruthy()
    })
  })

  it('should render only the title when the certifications list is empty', () => {
    const { getByText, queryAllByTestId } = render(
      <CertificationsList certifications={[]} iconColor={mockedIconColor} title={mockedTitle} />,
    )

    expect(getByText(`${mockedTitle}:`)).toBeTruthy()

    const cards = queryAllByTestId('certification-card')
    expect(cards).toHaveLength(0)
  })

  it('should render only the title when certifications prop is null or undefined', () => {
    const { rerender, getByText, queryAllByTestId } = render(
      <CertificationsList
        certifications={null as any}
        iconColor={mockedIconColor}
        title={mockedTitle}
      />,
    )

    expect(getByText(`${mockedTitle}:`)).toBeTruthy()
    expect(queryAllByTestId('certification-card')).toHaveLength(0)

    rerender(
      <CertificationsList
        certifications={undefined as any}
        iconColor={mockedIconColor}
        title={mockedTitle}
      />,
    )

    expect(getByText(`${mockedTitle}:`)).toBeTruthy()
    expect(queryAllByTestId('certification-card')).toHaveLength(0)
  })
})

describe('CertificationsList Component Snapshot', () => {
  it('should render the CertificationsList Component successfully', () => {
    const { toJSON } = render(
      <CertificationsList
        certifications={mockedCertifications}
        iconColor={mockedIconColor}
        title={mockedTitle}
      />,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})

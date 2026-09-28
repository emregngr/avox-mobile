import { render } from '@testing-library/react-native'

import { CertificationCard } from '@/components/feature/Airline/AirlineDetail/Tab/SafetyEnvTab/Cards/CertificationCard'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedCertification = 'React Native Certified'
const mockedIconColor = 'blue'

describe('CertificationCard Component', () => {
  it('should render the certification text correctly', async () => {
    const { getByText } = await render(
      <CertificationCard certification={mockedCertification} iconColor={mockedIconColor} />,
    )
    const certificationText = getByText(mockedCertification)
    expect(certificationText).toBeTruthy()
  })

  it('should pass the correct props to the MaterialCommunityIcons component', async () => {
    const { getByTestId } = await render(
      <CertificationCard certification={mockedCertification} iconColor={mockedIconColor} />,
    )
    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.name).toBe('certificate')
    expect(icon.props.size).toBe(16)
    expect(icon.props.color).toBe(mockedIconColor)
  })
})

describe('CertificationCard Component Snapshot', () => {
  it('should render the CertificationCard Component successfully', async () => {
    const { toJSON } = await render(
      <CertificationCard certification={mockedCertification} iconColor={mockedIconColor} />,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})

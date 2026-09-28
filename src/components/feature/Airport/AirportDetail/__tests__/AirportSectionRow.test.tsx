import { render } from '@testing-library/react-native'
import { Text, View } from 'react-native'

import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

describe('AirportSectionRow Component', () => {
  it('should render the title correctly', async () => {
    const title = 'Fleet Information'
    const { getByText } = await render(
      <AirportSectionRow title={title}>
        <View />
      </AirportSectionRow>,
    )

    expect(getByText(title)).toBeTruthy()
  })

  it('should render its children correctly', async () => {
    const title = 'Contact Details'
    const childText = 'Phone: 123-456-7890'

    const { getByText } = await render(
      <AirportSectionRow title={title}>
        <Text>{childText}</Text>
      </AirportSectionRow>,
    )

    expect(getByText(childText)).toBeTruthy()
  })

  it('should render multiple children', async () => {
    const title = 'Notes'
    const firstChildText = 'This is the first note.'
    const secondChildText = 'This is the second note.'

    const { getByText } = await render(
      <AirportSectionRow title={title}>
        <Text>{firstChildText}</Text>
        <Text>{secondChildText}</Text>
      </AirportSectionRow>,
    )

    expect(getByText(firstChildText)).toBeTruthy()
    expect(getByText(secondChildText)).toBeTruthy()
  })
})

describe('AirportSectionRow Snapshot', () => {
  it('should render the AirportSectionRow successfully', async () => {
    const { toJSON } = await render(
      <AirportSectionRow title="Snapshot Title">
        <Text>Snapshot child content</Text>
      </AirportSectionRow>,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})

import { render } from '@testing-library/react-native'
import { Text, View } from 'react-native'

import { AirlineSectionRow } from '@/components/feature/Airline/AirlineDetail/AirlineSectionRow'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

describe('AirlineSectionRow Component', () => {
  it('should render the title correctly', async () => {
    const title = 'Fleet Information'
    const { getByText } = await render(
      <AirlineSectionRow title={title}>
        <View />
      </AirlineSectionRow>,
    )

    expect(getByText(title)).toBeTruthy()
  })

  it('should render its children correctly', async () => {
    const title = 'Contact Details'
    const childText = 'Phone: 123-456-7890'

    const { getByText } = await render(
      <AirlineSectionRow title={title}>
        <Text>{childText}</Text>
      </AirlineSectionRow>,
    )

    expect(getByText(childText)).toBeTruthy()
  })

  it('should render multiple children', async () => {
    const title = 'Notes'
    const firstChildText = 'This is the first note.'
    const secondChildText = 'This is the second note.'

    const { getByText } = await render(
      <AirlineSectionRow title={title}>
        <Text>{firstChildText}</Text>
        <Text>{secondChildText}</Text>
      </AirlineSectionRow>,
    )

    expect(getByText(firstChildText)).toBeTruthy()
    expect(getByText(secondChildText)).toBeTruthy()
  })
})

describe('AirlineSectionRow Component Snapshot', () => {
  it('should render the AirlineSectionRow Component successfully', async () => {
    const { toJSON } = await render(
      <AirlineSectionRow title="Snapshot Title">
        <Text>Snapshot child content</Text>
      </AirlineSectionRow>,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})

import { fireEvent, render } from '@testing-library/react-native'
import { View } from 'react-native'
import type { SvgProps } from 'react-native-svg'

import { AirportRowItem } from '@/components/feature/Airport/AirportDetail/AirportRowItem'
import useThemeStore from '@/store/theme'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const MockedCustomIcon = (props: SvgProps) => <View testID="custom-icon" {...props} />

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('AirportRowItem Component', () => {
  it('should render the label and value correctly', async () => {
    const { getByText } = await render(<AirportRowItem label="Rating" value="5 Stars" />)

    expect(getByText('Rating')).toBeTruthy()
    expect(getByText('5 Stars')).toBeTruthy()
  })

  it('should render a MaterialCommunityIcons icon when provided', async () => {
    const { getByTestId } = await render(
      <AirportRowItem icon="web" label="Website" value="example.com" />,
    )

    expect(getByTestId('mocked-material-community-icon')).toBeTruthy()
  })

  it('should render a custom icon when provided', async () => {
    const { getByTestId } = await render(
      <AirportRowItem customIcon={MockedCustomIcon} label="Custom" value="Value" />,
    )

    expect(getByTestId('custom-icon')).toBeTruthy()
  })

  it('should not render any icon if none is provided', async () => {
    const { queryByTestId } = await render(<AirportRowItem label="No Icon" value="None" />)

    expect(queryByTestId('icon-web')).toBeNull()
    expect(queryByTestId('custom-icon')).toBeNull()
  })

  it('should render a chevron-right icon when an onPress handler is provided', async () => {
    const { getByTestId } = await render(
      <AirportRowItem label="Clickable" onPress={() => {}} value="Press Me" />,
    )

    expect(getByTestId('mocked-material-community-icon')).toBeTruthy()
  })

  it('should not render a chevron-right icon when onPress is not provided', async () => {
    const { queryByTestId } = await render(<AirportRowItem label="Not Clickable" value="Static" />)

    expect(queryByTestId('icon-chevron-right')).toBeNull()
  })

  it('should call the onPress handler when pressed', async () => {
    const mockedHandlePress = jest.fn()
    const { getByText } = await render(
      <AirportRowItem label="Button" onPress={mockedHandlePress} value="Click" />,
    )

    await fireEvent.press(getByText('Button'))
    expect(mockedHandlePress).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when no onPress handler is provided', async () => {
    const mockedHandlePress = jest.fn()
    const { getByText } = await render(<AirportRowItem label="Disabled" value="Cannot Click" />)

    await fireEvent.press(getByText('Disabled'))

    expect(mockedHandlePress).not.toHaveBeenCalled()
  })
})

describe('AirportRowItem Snapshot', () => {
  it('should render the AirportRowItem successfully', async () => {
    const { toJSON } = await render(
      <AirportRowItem icon="star" label="Rating" onPress={() => {}} value="5 Stars" />,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})

describe('AirportRowItem Snapshot', () => {
  it('should render the AirportRowItem Component without icon and onPress successfully', async () => {
    const { toJSON } = await render(<AirportRowItem label="Rating" value="5 Stars" />)

    expect(toJSON()).toMatchSnapshot()
  })
})

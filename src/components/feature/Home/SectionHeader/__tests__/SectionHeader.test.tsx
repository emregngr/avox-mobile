import { fireEvent, render } from '@testing-library/react-native'

import { SectionHeader } from '@/components/feature/Home/SectionHeader'
import { getLocale } from '@/locales/i18next'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

beforeEach(() => {
  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      viewAll: 'View All',
    }
    return translations[key] || key
  })
})

describe('SectionHeader Component', () => {
  it('should render the title correctly', async () => {
    const title = 'Trending Topics'
    const { getByText } = await render(<SectionHeader title={title} />)

    expect(getByText(title)).toBeTruthy()
  })

  it('should not render the "View All" button by default', async () => {
    const { queryByTestId } = await render(<SectionHeader title="My Section" />)

    expect(queryByTestId('view-all-button')).toBeNull()
  })

  it('should not render the "View All" button when showViewAll is false', async () => {
    const { queryByTestId } = await render(
      <SectionHeader showViewAll={false} title="Another Section" />,
    )

    expect(queryByTestId('view-all-button')).toBeNull()
  })

  it('should render the "View All" button when showViewAll is true', async () => {
    const { getByTestId } = await render(<SectionHeader title="Featured" showViewAll />)

    const viewAllButton = getByTestId('view-all-button-Featured')
    expect(viewAllButton).toBeTruthy()
  })

  it('should call the onViewAll callback when the "View All" button is pressed', async () => {
    const mockedOnViewAll = jest.fn()

    const { getByTestId } = await render(
      <SectionHeader onViewAll={mockedOnViewAll} title="All Items" showViewAll />,
    )

    const viewAllButton = getByTestId('view-all-button-All Items')

    expect(viewAllButton).toBeTruthy()
    await fireEvent.press(viewAllButton)

    expect(mockedOnViewAll).toHaveBeenCalledTimes(1)
  })

  it('should not throw an error if onViewAll is not provided and button is pressed', async () => {
    const { getByTestId } = await render(<SectionHeader title="No Callback" showViewAll />)

    const viewAllButton = getByTestId('view-all-button-No Callback')

    expect(viewAllButton).toBeTruthy()
    await fireEvent.press(viewAllButton)
  })

  it('should render the view all button with correct properties', async () => {
    const { getByTestId } = await render(<SectionHeader title="Structure Test" showViewAll />)

    const viewAllButton = getByTestId('view-all-button-Structure Test')

    expect(viewAllButton).toBeTruthy()
    expect(viewAllButton.props.testID).toBe('view-all-button-Structure Test')

    expect(viewAllButton.props.accessible).toBe(true)
  })
})

describe('SectionHeader Component Snapshot', () => {
  it('should render the SectionHeader Component successfully', async () => {
    const { toJSON } = await render(<SectionHeader title="SectionHeader" />)

    expect(toJSON()).toMatchSnapshot()
  })
})

import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

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
  it('should render the title correctly', () => {
    const title = 'Trending Topics'
    const { getByText } = render(<SectionHeader title={title} />)

    expect(getByText(title)).toBeTruthy()
  })

  it('should not render the "View All" button by default', () => {
    const { queryByTestId } = render(<SectionHeader title="My Section" />)

    expect(queryByTestId('view-all-button')).toBeNull()
  })

  it('should not render the "View All" button when showViewAll is false', () => {
    const { queryByTestId } = render(<SectionHeader showViewAll={false} title="Another Section" />)

    expect(queryByTestId('view-all-button')).toBeNull()
  })

  it('should render the "View All" button when showViewAll is true', () => {
    const { getByTestId } = render(<SectionHeader title="Featured" showViewAll />)

    const viewAllButton = getByTestId('view-all-button-Featured')
    expect(viewAllButton).toBeTruthy()
  })

  it('should call the onViewAll callback when the "View All" button is pressed', () => {
    const mockedOnViewAll = jest.fn()

    const { getByTestId } = render(
      <SectionHeader onViewAll={mockedOnViewAll} title="All Items" showViewAll />,
    )

    const viewAllButton = getByTestId('view-all-button-All Items')

    expect(viewAllButton).toBeTruthy()
    fireEvent.press(viewAllButton)

    expect(mockedOnViewAll).toHaveBeenCalledTimes(1)
  })

  it('should not throw an error if onViewAll is not provided and button is pressed', () => {
    const { getByTestId } = render(<SectionHeader title="No Callback" showViewAll />)

    const viewAllButton = getByTestId('view-all-button-No Callback')

    expect(viewAllButton).toBeTruthy()
    expect(() => fireEvent.press(viewAllButton)).not.toThrow()
  })

  it('should render the view all button with correct properties', () => {
    const { getByTestId } = render(<SectionHeader title="Structure Test" showViewAll />)

    const viewAllButton = getByTestId('view-all-button-Structure Test')

    expect(viewAllButton).toBeTruthy()
    expect(viewAllButton.props.testID).toBe('view-all-button-Structure Test')

    expect(viewAllButton.props.accessible).toBe(true)
  })
})

describe('SectionHeader Component Snapshot', () => {
  it('should render the SectionHeader Component successfully', () => {
    const { toJSON } = render(<SectionHeader title="SectionHeader" />)

    expect(toJSON()).toMatchSnapshot()
  })
})

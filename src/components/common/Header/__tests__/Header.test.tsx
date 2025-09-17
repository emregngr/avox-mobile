import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { Header } from '@/components/common/Header'
import useThemeStore from '@/store/theme'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedBack = jest.fn()
const mockedRightButton = jest.fn()
const mockedRightIcon = jest.fn()
const mockedShareIcon = jest.fn()

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('Header Component', () => {
  it('renders the title when provided', () => {
    const { getByText } = render(<Header title="Test Title" />)
    expect(getByText('Test Title')).toBeTruthy()
  })

  it('does not render the title when not provided', () => {
    const { queryByText } = render(<Header />)
    expect(queryByText('Test Title')).toBeNull()
  })

  it('renders back icon by default and calls onPress when pressed', () => {
    const { getByTestId } = render(<Header backIconOnPress={mockedBack} title="Back Test" />)

    fireEvent.press(getByTestId('header-back-icon'))
    expect(mockedBack).toHaveBeenCalled()
  })

  it('does not render back icon when backIcon={false}', () => {
    const { queryByTestId } = render(<Header backIcon={false} />)
    expect(queryByTestId('header-back-icon')).toBeNull()
  })

  it('renders right button when label is provided and calls onPress', () => {
    const { getByText } = render(
      <Header rightButtonLabel="Save" rightButtonOnPress={mockedRightButton} />,
    )

    fireEvent.press(getByText('Save'))
    expect(mockedRightButton).toHaveBeenCalled()
  })

  it('renders right icon when provided and calls onPress', () => {
    const { getByTestId } = render(<Header rightIcon={<></>} rightIconOnPress={mockedRightIcon} />)

    fireEvent.press(getByTestId('header-right-icon'))
    expect(mockedRightIcon).toHaveBeenCalled()
  })

  it('renders share icon when provided and calls onPress', () => {
    const { getByTestId } = render(<Header shareIcon={<></>} shareIconOnPress={mockedShareIcon} />)

    fireEvent.press(getByTestId('header-share-icon'))
    expect(mockedShareIcon).toHaveBeenCalled()
  })
})

describe('Header Component Snapshot', () => {
  it('should render the Header Component successfully', () => {
    const { toJSON } = render(<Header title="Test Title" />)

    expect(toJSON()).toMatchSnapshot()
  })
})

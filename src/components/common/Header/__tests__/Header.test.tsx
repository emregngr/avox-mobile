import { fireEvent, render } from '@testing-library/react-native'

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
  it('renders the title when provided', async () => {
    const { getByText } = await render(<Header title="Test Title" />)
    expect(getByText('Test Title')).toBeTruthy()
  })

  it('does not render the title when not provided', async () => {
    const { queryByText } = await render(<Header />)
    expect(queryByText('Test Title')).toBeNull()
  })

  it('renders back icon by default and calls onPress when pressed', async () => {
    const { getByTestId } = await render(<Header backIconOnPress={mockedBack} title="Back Test" />)

    await fireEvent.press(getByTestId('header-back-icon'))
    expect(mockedBack).toHaveBeenCalled()
  })

  it('does not render back icon when backIcon={false}', async () => {
    const { queryByTestId } = await render(<Header backIcon={false} />)
    expect(queryByTestId('header-back-icon')).toBeNull()
  })

  it('renders right button when label is provided and calls onPress', async () => {
    const { getByText } = await render(
      <Header rightButtonLabel="Save" rightButtonOnPress={mockedRightButton} />,
    )

    await fireEvent.press(getByText('Save'))
    expect(mockedRightButton).toHaveBeenCalled()
  })

  it('renders right icon when provided and calls onPress', async () => {
    const { getByTestId } = await render(
      <Header rightIcon={<></>} rightIconOnPress={mockedRightIcon} />,
    )

    await fireEvent.press(getByTestId('header-right-icon'))
    expect(mockedRightIcon).toHaveBeenCalled()
  })

  it('renders share icon when provided and calls onPress', async () => {
    const { getByTestId } = await render(
      <Header shareIcon={<></>} shareIconOnPress={mockedShareIcon} />,
    )

    await fireEvent.press(getByTestId('header-share-icon'))
    expect(mockedShareIcon).toHaveBeenCalled()
  })
})

describe('Header Component Snapshot', () => {
  it('should render the Header Component successfully', async () => {
    const { toJSON } = await render(<Header title="Test Title" />)

    expect(toJSON()).toMatchSnapshot()
  })
})

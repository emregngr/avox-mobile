import { render } from '@testing-library/react-native'

import { OnboardingItem } from '@/components/common/OnboardingItem'
import type { OnboardingType } from '@/types/common/onboarding'

const mockedItem: OnboardingType = {
  id: '1',
  image: 'https://example.com/image.png',
  title: 'Welcome to the App',
  text: 'This is the onboarding description text',
}

describe('OnboardingItem Component', () => {
  it('renders the title correctly', async () => {
    const { getByText } = await render(<OnboardingItem item={mockedItem} />)
    expect(getByText('Welcome to the App')).toBeTruthy()
  })

  it('renders the text correctly', async () => {
    const { getByText } = await render(<OnboardingItem item={mockedItem} />)
    expect(getByText('This is the onboarding description text')).toBeTruthy()
  })

  it('renders the image with correct props', async () => {
    const { getByTestId } = await render(<OnboardingItem item={mockedItem} />)
    const image = getByTestId('mocked-image')
    expect(image).toBeTruthy()
    expect(image.props.style).toMatchObject({
      height: '45%',
      width: '100%',
      marginVertical: 20,
    })
  })
})

describe('OnboardingItem Component Snapshot', () => {
  it('should render the OnboardingItem Component successfully', async () => {
    const { toJSON } = await render(<OnboardingItem item={mockedItem} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

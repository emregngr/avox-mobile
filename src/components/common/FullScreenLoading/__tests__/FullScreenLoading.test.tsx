import { render } from '@testing-library/react-native'

import { FullScreenLoading } from '@/components/common/FullScreenLoading'

describe('FullScreenLoading Component', () => {
  it('renders the container and the Lottie animation', async () => {
    const { getByTestId } = await render(<FullScreenLoading />)

    expect(getByTestId('full-screen-loading')).toBeTruthy()

    expect(getByTestId('loading-lottie')).toBeTruthy()
  })

  it('has correct styling for the container', async () => {
    const { getByTestId } = await render(<FullScreenLoading />)
    const container = getByTestId('full-screen-loading')

    expect(container.props.className).toBe(
      'flex-1 items-center justify-center bg-background-primary',
    )
  })

  it('has correct properties for the LottieView', async () => {
    const { getByTestId } = await render(<FullScreenLoading />)
    const lottieAnimation = getByTestId('loading-lottie')

    expect(lottieAnimation.props.autoPlay).toBe(true)
    expect(lottieAnimation.props.loop).toBe(true)

    expect(lottieAnimation.props.style).toEqual({ width: 500, height: 500 })
  })
})

describe('FullScreenLoading Component Snapshot', () => {
  it('should render the FullScreenLoading Component successfully', async () => {
    const { toJSON } = await render(<FullScreenLoading />)

    expect(toJSON()).toMatchSnapshot()
  })
})

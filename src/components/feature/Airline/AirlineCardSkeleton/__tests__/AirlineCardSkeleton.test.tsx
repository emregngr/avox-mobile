import { render } from '@testing-library/react-native'
import * as Reanimated from 'react-native-reanimated'

import { AirlineCardSkeleton } from '@/components/feature/Airline'

const mockedReanimatedUseSharedValue = Reanimated.useSharedValue as jest.Mock
const mockedReanimatedUseAnimatedStyle = Reanimated.useAnimatedStyle as jest.Mock
const mockedReanimatedWithTiming = Reanimated.withTiming as jest.Mock
const mockedReanimatedWithRepeat = Reanimated.withRepeat as jest.Mock

beforeEach(() => {
  mockedReanimatedUseSharedValue.mockReturnValue({ value: 0.5 })
  mockedReanimatedUseAnimatedStyle.mockImplementation(styleFactory => styleFactory())
  mockedReanimatedWithTiming.mockImplementation(value => value)
  mockedReanimatedWithRepeat.mockImplementation(animation => animation)
})

describe('AirlineCardSkeleton Component', () => {
  it('calls withRepeat + withTiming to start pulse animation', async () => {
    await render(<AirlineCardSkeleton />)

    expect(Reanimated.withTiming).toHaveBeenCalledWith(1, { duration: 1000 })
    expect(Reanimated.withRepeat).toHaveBeenCalledWith(1, -1, true)
  })

  it('renders multiple skeleton blocks', async () => {
    const { getAllByTestId } = await render(<AirlineCardSkeleton />)
    expect(getAllByTestId('skeleton-block').length).toBeGreaterThan(0)
  })
})

describe('AirlineCardSkeleton Component Snapshot', () => {
  it('should render the AirlineCardSkeleton Component successfully', async () => {
    const { toJSON } = await render(<AirlineCardSkeleton />)

    expect(toJSON()).toMatchSnapshot()
  })
})

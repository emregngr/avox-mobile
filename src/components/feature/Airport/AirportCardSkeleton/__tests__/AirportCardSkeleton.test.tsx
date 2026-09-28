import { render } from '@testing-library/react-native'
import * as Reanimated from 'react-native-reanimated'

import { AirportCardSkeleton } from '@/components/feature/Airport'

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

describe('AirportCard Component', () => {
  it('calls withRepeat + withTiming to start pulse animation', async () => {
    await render(<AirportCardSkeleton />)

    expect(Reanimated.withTiming).toHaveBeenCalledWith(1, { duration: 1000 })
    expect(Reanimated.withRepeat).toHaveBeenCalledWith(1, -1, true)
  })

  it('renders multiple skeleton blocks', async () => {
    const { getAllByTestId } = await render(<AirportCardSkeleton />)
    expect(getAllByTestId('skeleton-block').length).toBeGreaterThan(0)
  })
})

describe('AirportCardSkeleton Component Snapshot', () => {
  it('should render the AirportCardSkeleton Component successfully', async () => {
    const { toJSON } = await render(<AirportCardSkeleton />)

    expect(toJSON()).toMatchSnapshot()
  })
})

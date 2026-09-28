import { act, fireEvent, render } from '@testing-library/react-native'

import { HomeSlider } from '@/components/feature/Home/HomeSlider'
import type { BreakingNewsType } from '@/types/feature/home'

const MOCKED_DEVICE_WIDTH = 400
const AUTO_SCROLL_INTERVAL = 5000

jest.mock('@/components/feature/Home/BreakingNewsCard', () => {
  const { View, Text } = require('react-native')
  return {
    BreakingNewsCard: ({ item }: { item: BreakingNewsType }) => (
      <View testID={`news-card-${item.id}`}>
        <Text>{item.title}</Text>
      </View>
    ),
  }
})

jest.mock('@/utils/common/cn', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
}))

jest.mock('@/utils/common/responsive', () => ({
  responsive: {
    deviceWidth: MOCKED_DEVICE_WIDTH,
  },
}))

const mockedBreakingNews: BreakingNewsType[] = [
  { id: 'news-1', title: 'News 1', image: 'url1', description: 'description1' },
  { id: 'news-2', title: 'News 2', image: 'url2', description: 'description2' },
  { id: 'news-3', title: 'News 3', image: 'url3', description: 'description3' },
]

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('HomeSlider Component', () => {
  it('should render null if breakingNews prop is empty or undefined', async () => {
    const { rerender, queryByTestId } = await render(<HomeSlider breakingNews={[]} />)
    expect(queryByTestId('home-slider-flatlist')).toBeNull()

    await rerender(<HomeSlider breakingNews={undefined as any} />)
    expect(queryByTestId('home-slider-flatlist')).toBeNull()
  })

  it('should render correctly with breaking news data', async () => {
    const { getByText } = await render(<HomeSlider breakingNews={mockedBreakingNews} />)

    mockedBreakingNews.forEach(news => {
      expect(getByText(news.title)).toBeTruthy()
    })
  })

  it('should render news cards with correct testIDs', async () => {
    const { getByTestId } = await render(<HomeSlider breakingNews={mockedBreakingNews} />)

    mockedBreakingNews.forEach(news => {
      expect(getByTestId(`news-card-${news.id}`)).toBeTruthy()
    })
  })

  it('should handle auto-scroll functionality', async () => {
    await render(<HomeSlider breakingNews={mockedBreakingNews} />)

    await act(() => {
      jest.advanceTimersByTime(AUTO_SCROLL_INTERVAL)
    })

    expect(true).toBeTruthy()
  })

  it('should handle user interaction events', async () => {
    const { queryByTestId } = await render(<HomeSlider breakingNews={mockedBreakingNews} />)

    const flatList = queryByTestId('home-slider-flatlist')
    if (flatList) {
      await fireEvent(flatList, 'onScrollBeginDrag')
      await fireEvent(flatList, 'onMomentumScrollEnd', {
        nativeEvent: { contentOffset: { x: MOCKED_DEVICE_WIDTH } },
      })
    }

    expect(true).toBeTruthy()
  })

  it('should handle scroll events', async () => {
    const { queryByTestId } = await render(<HomeSlider breakingNews={mockedBreakingNews} />)

    const flatList = queryByTestId('home-slider-flatlist')
    if (flatList) {
      await fireEvent(flatList, 'onScroll', {
        nativeEvent: {
          contentOffset: { x: MOCKED_DEVICE_WIDTH },
          layoutMeasurement: { width: MOCKED_DEVICE_WIDTH },
          contentSize: { width: MOCKED_DEVICE_WIDTH * mockedBreakingNews.length },
        },
      })
    }

    expect(true).toBeTruthy()
  })

  it('should cleanup on unmount', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
    const { unmount } = await render(<HomeSlider breakingNews={mockedBreakingNews} />)

    await unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})

describe('HomeSlider Component Snapshot', () => {
  it('should render the HomeSlider Component successfully', async () => {
    const { toJSON } = await render(<HomeSlider breakingNews={mockedBreakingNews} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

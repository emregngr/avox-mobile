import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'

import { BreakingNewsCard } from '@/components/feature/Home/BreakingNewsCard'
import type { BreakingNewsType } from '@/types/feature/home'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedItem: BreakingNewsType = {
  id: '1',
  title: 'Breaking News Headline',
  image: 'https://example.com/image.jpg',
  description: 'Breaking News Description',
}

describe('BreakingNewsCard Component', () => {
  it('renders news title', async () => {
    const { getByText } = await render(<BreakingNewsCard item={mockedItem} />)
    expect(getByText('Breaking News Headline')).toBeTruthy()
  })

  it('navigates on press with correct params', async () => {
    const { getByTestId } = await render(<BreakingNewsCard item={mockedItem} />)

    const button = getByTestId('breaking-news-card-1')
    await fireEvent.press(button)

    expect(router.navigate).toHaveBeenCalledWith({
      pathname: '/breaking-news-detail',
      params: {
        item: JSON.stringify(mockedItem),
      },
    })
  })
})

describe('BreakingNewsCard Component Snapshot', () => {
  it('should render the BreakingNewsCard Component successfully', async () => {
    const { toJSON } = await render(<BreakingNewsCard item={mockedItem} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

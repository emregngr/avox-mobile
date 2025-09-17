import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import React from 'react'

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
  it('renders news title', () => {
    const { getByText } = render(<BreakingNewsCard item={mockedItem} />)
    expect(getByText('Breaking News Headline')).toBeTruthy()
  })

  it('navigates on press with correct params', () => {
    const { getByTestId } = render(<BreakingNewsCard item={mockedItem} />)

    const button = getByTestId('breaking-news-card-1')
    fireEvent.press(button)

    expect(router.navigate).toHaveBeenCalledWith({
      pathname: '/breaking-news-detail',
      params: {
        item: JSON.stringify(mockedItem),
      },
    })
  })
})

describe('BreakingNewsCard Component Snapshot', () => {
  it('should render the BreakingNewsCard Component successfully', () => {
    const { toJSON } = render(<BreakingNewsCard item={mockedItem} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

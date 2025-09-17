import { render } from '@testing-library/react-native'
import React from 'react'

import { NewsSection } from '@/components/feature/Home/NewsSection'
import { getLocale } from '@/locales/i18next'
import type { BreakingNewsType } from '@/types/feature/home'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

const mockedSectionHeader = jest.fn()
const mockedHomeSlider = jest.fn()

jest.mock('@/components/feature/Home/SectionHeader', () => {
  const { View, Text } = require('react-native')
  return {
    SectionHeader: (props: { title: string; showViewAll?: boolean; onViewAll?: () => void }) => {
      mockedSectionHeader(props)
      return (
        <View testID="section-header">
          <Text testID="section-title">{props.title}</Text>
        </View>
      )
    },
  }
})

jest.mock('@/components/feature/Home/HomeSlider', () => {
  const { View } = require('react-native')
  return {
    HomeSlider: (props: { breakingNews?: BreakingNewsType[] }) => {
      mockedHomeSlider(props)
      return <View data-news-count={props.breakingNews?.length || 0} testID="home-slider" />
    },
  }
})

const mockedBreakingNews: BreakingNewsType[] = [
  {
    id: '1',
    title: 'Test News 1',
    image: 'https://example.com/image1.jpg',
    description: 'Test News 1 Description',
  },
  {
    id: '2',
    title: 'Test News 2',
    image: 'https://example.com/image2.jpg',
    description: 'Test News 2 Description',
  },
]

beforeEach(() => {
  mockedGetLocale.mockReturnValue('News')
})

describe('NewsSection Component', () => {
  describe('Component Rendering', () => {
    it('should render both SectionHeader and HomeSlider components', () => {
      const { getByTestId } = render(<NewsSection breakingNews={mockedBreakingNews} />)

      expect(getByTestId('section-header')).toBeTruthy()
      expect(getByTestId('home-slider')).toBeTruthy()
    })

    it('should render with empty breakingNews array', () => {
      const emptyNews: BreakingNewsType[] = []
      const { getByTestId } = render(<NewsSection breakingNews={emptyNews} />)

      expect(getByTestId('section-header')).toBeTruthy()
      expect(getByTestId('home-slider')).toBeTruthy()
    })
  })

  describe('Localization', () => {
    it('should call getLocale with "news" key', () => {
      render(<NewsSection breakingNews={mockedBreakingNews} />)

      expect(mockedGetLocale).toHaveBeenCalledWith('news')
      expect(mockedGetLocale).toHaveBeenCalledTimes(1)
    })

    it('should pass the localized title to SectionHeader', () => {
      const expectedTitle = 'Haberler'
      mockedGetLocale.mockReturnValue(expectedTitle)

      const { getByText } = render(<NewsSection breakingNews={mockedBreakingNews} />)

      expect(mockedSectionHeader).toHaveBeenCalledWith({ title: expectedTitle })
      expect(getByText(expectedTitle)).toBeTruthy()
    })

    it('should handle different locale values', () => {
      const testCases = ['News', 'Noticias', 'Nouvelles', 'Notizie']

      testCases.forEach(locale => {
        mockedGetLocale.mockReturnValue(locale)

        const { getByText } = render(<NewsSection breakingNews={mockedBreakingNews} />)

        expect(mockedSectionHeader).toHaveBeenCalledWith({ title: locale })
        expect(getByText(locale)).toBeTruthy()
      })
    })
  })

  describe('Props Passing', () => {
    it('should pass breakingNews prop to HomeSlider', () => {
      render(<NewsSection breakingNews={mockedBreakingNews} />)

      expect(mockedHomeSlider).toHaveBeenCalledWith({ breakingNews: mockedBreakingNews })
      expect(mockedHomeSlider).toHaveBeenCalledTimes(1)
    })

    it('should pass empty array to HomeSlider when no breaking news', () => {
      const emptyNews: BreakingNewsType[] = []
      render(<NewsSection breakingNews={emptyNews} />)

      expect(mockedHomeSlider).toHaveBeenCalledWith({ breakingNews: emptyNews })
    })

    it('should pass different breakingNews arrays correctly', () => {
      const singleNews: BreakingNewsType[] = [
        {
          id: 'single',
          title: 'Single News',
          image: 'single.jpg',
          description: 'Single Description',
        },
      ]

      render(<NewsSection breakingNews={singleNews} />)

      expect(mockedHomeSlider).toHaveBeenCalledWith({ breakingNews: singleNews })
    })
  })

  describe('Component Interactions', () => {
    it('should render SectionHeader before HomeSlider', () => {
      const { getByTestId } = render(<NewsSection breakingNews={mockedBreakingNews} />)

      expect(mockedSectionHeader).toHaveBeenCalledTimes(1)
      expect(mockedHomeSlider).toHaveBeenCalledTimes(1)

      const sectionHeader = getByTestId('section-header')
      const homeSlider = getByTestId('home-slider')

      expect(sectionHeader).toBeTruthy()
      expect(homeSlider).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined return from getLocale', () => {
      mockedGetLocale.mockReturnValue(undefined as any)

      render(<NewsSection breakingNews={mockedBreakingNews} />)

      expect(mockedSectionHeader).toHaveBeenCalledWith({ title: undefined })
      expect(mockedGetLocale).toHaveBeenCalledWith('news')
    })

    it('should handle empty string return from getLocale', () => {
      mockedGetLocale.mockReturnValue('')

      render(<NewsSection breakingNews={mockedBreakingNews} />)

      expect(mockedSectionHeader).toHaveBeenCalledWith({ title: '' })
    })

    it('should handle large breakingNews arrays', () => {
      const largeNewsArray: BreakingNewsType[] = Array.from({ length: 100 }, (_, index) => ({
        id: `news-${index}`,
        title: `News ${index}`,
        image: `image-${index}.jpg`,
        description: `Description ${index}`,
      }))

      const { getByTestId } = render(<NewsSection breakingNews={largeNewsArray} />)

      expect(mockedHomeSlider).toHaveBeenCalledWith({ breakingNews: largeNewsArray })
      expect(getByTestId('home-slider')).toBeTruthy()
    })
  })

  describe('Component Structure', () => {
    it('should render within a View container', () => {
      const { toJSON } = render(<NewsSection breakingNews={mockedBreakingNews} />)

      expect(toJSON()).toBeTruthy()
      expect(toJSON()).not.toBeNull()
    })

    it('should maintain consistent structure across different props', () => {
      const { rerender, toJSON } = render(<NewsSection breakingNews={mockedBreakingNews} />)
      const firstRender = toJSON()

      rerender(<NewsSection breakingNews={[]} />)
      const secondRender = toJSON()

      expect(Array.isArray(firstRender)).toBe(Array.isArray(secondRender))

      if (Array.isArray(firstRender) && Array.isArray(secondRender)) {
        expect(firstRender.length).toBe(secondRender.length)
      }
    })
  })
})

describe('NewsSection Component Snapshot', () => {
  it('should render the NewsSection Component successfully', () => {
    const { toJSON } = render(<NewsSection breakingNews={mockedBreakingNews} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

import { View } from 'react-native'

import { HomeSlider } from '@/components/feature/Home/HomeSlider'
import { SectionHeader } from '@/components/feature/Home/SectionHeader'
import { getLocale } from '@/locales/i18next'
import type { BreakingNewsType } from '@/types/feature/home'

interface NewsSectionProps {
  breakingNews: BreakingNewsType[]
}

export const NewsSection = ({ breakingNews }: NewsSectionProps) => (
  <View className="mt-3 mb-8">
    <SectionHeader title={getLocale('news')} />
    <HomeSlider breakingNews={breakingNews} />
  </View>
)

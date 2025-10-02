import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { OnboardingItem } from '@/components/common/OnboardingItem'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { OnboardingType } from '@/types/common/onboarding'

const mockedOnboardingData: OnboardingType[] = [
  {
    id: '1',
    title: 'Welcome to Our App',
    text: 'Discover amazing features and start your journey with us. Experience the best way to manage your daily tasks.',
    image: require('@/assets/images/onboarding/1.webp'),
  },
  {
    id: '2',
    title: 'Stay Organized',
    text: 'Keep track of all your important tasks and never miss a deadline. Our intuitive interface makes organization effortless.',
    image: require('@/assets/images/onboarding/2.webp'),
  },
  {
    id: '3',
    title: 'Achieve Your Goals',
    text: 'Set goals, track progress, and celebrate your achievements. Turn your dreams into reality with our powerful tools.',
    image: require('@/assets/images/onboarding/3.webp'),
  },
  {
    id: '4',
    title: 'Very Long Title That Should Be Truncated When It Exceeds The Available Space',
    text: 'This is a very long description text that should demonstrate how the component handles lengthy content. It should be truncated after 4 lines to maintain the layout consistency and ensure the best user experience across different screen sizes and device orientations.',
    image: require('@/assets/images/onboarding/4.webp'),
  },
]

const mockedImageSource = require('@/assets/images/onboarding/1.webp')

const meta: Meta<typeof OnboardingItem> = {
  title: 'Components/OnboardingItem',
  component: OnboardingItem,
  parameters: {
    docs: {
      description: {
        component:
          'Onboarding item component displaying an image, title, and description text for user introduction screens.',
      },
    },
  },
  decorators: [
    Story => (
      <View className="flex-1 bg-background-primary">
        <Story />
      </View>
    ),
  ],
  argTypes: {
    item: {
      description: 'Onboarding data object containing image, title, and text',
    },
  },
}

export default meta

type Story = StoryObj<typeof OnboardingItem>

export const Default: Story = {
  args: {
    item: {
      id: '1',
      title: 'Welcome to Our App',
      text: 'Discover amazing features and start your journey with us. Experience the best way to manage your daily tasks.',
      image: mockedImageSource,
    },
  },
}

export const LongContent: Story = {
  args: {
    item: {
      id: '2',
      title:
        'Very Long Title That Should Be Truncated When It Exceeds The Available Space On Screen',
      text: 'This is a very long description text that should demonstrate how the component handles lengthy content. It should be truncated after 4 lines to maintain the layout consistency and ensure the best user experience across different screen sizes and device orientations. Additional text to test the truncation behavior.',
      image: mockedImageSource,
    },
  },
}

export const ShortContent: Story = {
  args: {
    item: {
      id: '3',
      title: 'Quick Start',
      text: 'Get started in seconds.',
      image: mockedImageSource,
    },
  },
}

export const OnboardingFlow: Story = {
  render: () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const nextItem = () => {
      setCurrentIndex(prev => (prev + 1) % mockedOnboardingData.length)
    }

    const prevItem = () => {
      setCurrentIndex(
        prev => (prev - 1 + mockedOnboardingData.length) % mockedOnboardingData.length,
      )
    }

    const currentItem: OnboardingType = {
      id: mockedOnboardingData?.[currentIndex]?.id as string,
      title: mockedOnboardingData?.[currentIndex]?.title as string,
      text: mockedOnboardingData?.[currentIndex]?.text as string,
      image: mockedOnboardingData?.[currentIndex]?.image as string,
    }

    return (
      <View className="flex-1">
        <OnboardingItem item={currentItem} />

        <View className="absolute bottom-12 left-0 right-0 flex-row justify-between px-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-background-tertiary p-3 rounded-xl"
            onPress={prevItem}
          >
            <ThemedText type="body1" color="text-100">
              ← Previous
            </ThemedText>
          </TouchableOpacity>

          <View className="bg-background-secondary px-3 py-2 rounded-xl justify-center items-center">
            <ThemedText type="body2" color="text-100">
              {currentIndex + 1} / {mockedOnboardingData.length}
            </ThemedText>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-background-tertiary p-3 rounded-xl"
            onPress={nextItem}
          >
            <ThemedText type="body1" color="text-100">
              Next →{' '}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    )
  },
}

export const ContentLengthShowcase: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const contentVariations: OnboardingType[] = [
      {
        id: 'short',
        title: 'Short',
        text: 'Brief.',
        image: require('@/assets/images/onboarding/1.webp'),
      },
      {
        id: 'medium',
        title: 'Medium Length Title',
        text: 'This is a medium length description that provides more context about the feature.',
        image: require('@/assets/images/onboarding/2.webp'),
      },
      {
        id: 'long',
        title: 'Very Long Title That Will Be Truncated',
        text: 'This is a very long description that exceeds the normal length and will be truncated after the specified number of lines to maintain layout consistency.',
        image: require('@/assets/images/onboarding/3.webp'),
      },
    ]

    const [selectedIndex, setSelectedIndex] = useState<number>(0)

    return (
      <View className="flex-1">
        <OnboardingItem item={contentVariations?.[selectedIndex] as OnboardingType} />

        <View className="absolute bottom-7 left-5 right-5 flex-row justify-center gap-2.5">
          {contentVariations.map((_, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  index === selectedIndex ? colors?.onPrimary100 : colors?.background?.quaternary,
              }}
              onPress={() => setSelectedIndex(index)}
            />
          ))}
        </View>
      </View>
    )
  },
}

export const Playground: Story = {
  args: {
    item: {
      id: 'playground',
      title: 'Playground Title',
      text: 'This is a playground description where you can test different props and see how they affect the component rendering.',
      image: mockedImageSource,
    },
  },
}

import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { FullScreenLoading } from '@/components/common/FullScreenLoading'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const meta: Meta<typeof FullScreenLoading> = {
  title: 'Components/FullScreenLoading',
  component: FullScreenLoading,
  parameters: {
    docs: {
      description: {
        component:
          'Full screen loading component with Lottie animation for displaying loading states.',
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
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof FullScreenLoading>

export const Default: Story = {
  render: () => <FullScreenLoading />,
  parameters: {
    docs: {
      description: {
        story: 'Default full screen loading with plane animation.',
      },
    },
  },
}

export const Centered: Story = {
  render: () => (
    <View className="flex-1 justify-center items-center">
      <FullScreenLoading />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full screen loading centered within a container.',
      },
    },
  },
}

export const WithCustomContainer: Story = {
  render: () => (
    <View className="flex-1 bg-background-secondary p-4 rounded-xl m-4">
      <FullScreenLoading />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full screen loading with custom container styling.',
      },
    },
  },
}

export const MultipleStates: Story = {
  render: () => (
    <View className="flex-1 gap-4">
      <View className="flex-1">
        <FullScreenLoading />
      </View>
      <View className="flex-1">
        <FullScreenLoading />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple loading components with different background colors.',
      },
    },
  },
}

export const ThemeShowcase: Story = {
  render: () => (
    <View className="flex-1">
      <View className="flex-1 flex-row">
        <View className="flex-1 bg-background-quaternary">
          <View className="flex-1 bg-background-secondary m-2 rounded-lg">
            <FullScreenLoading />
          </View>
        </View>

        <View className="flex-1 bg-background-quaternary">
          <View className="flex-1 bg-background-secondary m-2 rounded-lg">
            <FullScreenLoading />
          </View>
        </View>
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading component displayed in different theme contexts.',
      },
    },
  },
}

export const MultipleInstances: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <View className="flex-1 flex-row flex-wrap">
        {Array.from({ length: 4 }, (_, index) => (
          <View
            key={index}
            className="w-1/2 h-1/2 border border-background-quaternary"
            style={{
              backgroundColor:
                index % 2 === 0 ? colors?.background?.primary : colors?.background?.secondary,
            }}
          >
            <FullScreenLoading />
          </View>
        ))}
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple loading instances to test performance and memory usage.',
      },
    },
  },
}

export const UsageExamples: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const [showLoading, setShowLoading] = useState<boolean>(true)

    return (
      <View className="flex-1">
        <View className="p-4 bg-background-primary border-b border-background-quaternary">
          <TouchableOpacity
            activeOpacity={0.7}
            className="p-3 rounded-lg items-center"
            style={{
              backgroundColor: showLoading ? colors?.info : colors?.success,
            }}
            onPress={() => setShowLoading(!showLoading)}
          >
            <ThemedText type="body1" color="text-100">
              {showLoading ? 'Hide Loading' : 'Show Loading'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View className="flex-1 relative">
          <View className="flex-1 p-4 justify-center items-center bg-background-primary">
            <View className="w-[200px] h-[200px] bg-background-quaternary rounded-xl mb-5" />
            <ThemedText type="body1" color="text-100" center>
              App Content Here
            </ThemedText>
          </View>

          {showLoading ? (
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-background-secondary">
              <FullScreenLoading />
            </View>
          ) : null}
        </View>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing how to toggle loading state in a real app scenario.',
      },
    },
  },
}

import { ThemedGradientButton } from '@/components/common/ThemedGradientButton'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import { Alert, ScrollView, View } from 'react-native'

const meta: Meta<typeof ThemedGradientButton> = {
  title: 'Components/ThemedGradientButton',
  component: ThemedGradientButton,
  parameters: {
    docs: {
      description: {
        component:
          'A gradient button component with haptic feedback, loading states, and customizable styling.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Button text label',
    },
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'custom'],
      description: 'Button type with predefined gradient colors',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    hapticFeedback: {
      control: 'boolean',
      description: 'Enable haptic feedback on press',
    },
    hapticType: {
      control: 'select',
      options: ['light', 'medium', 'heavy'],
      description: 'Haptic feedback intensity',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    customLabelColor: {
      control: 'text',
      description: 'Custom label color (for custom type)',
    },
    customGradientColors: {
      control: 'object',
      description: 'Custom gradient colors array',
    },
    gradientStart: {
      control: 'object',
      description: 'Gradient start position',
    },
    gradientEnd: {
      control: 'object',
      description: 'Gradient end position',
    },
    onPress: {
      action: 'pressed',
      description: 'Press handler function',
    },
  },
  decorators: [
    Story => {
      return (
        <View className="flex-1 p-4 bg-background-primary">
          <Story />
        </View>
      )
    },
  ],
}

export default meta

type Story = StoryObj<typeof ThemedGradientButton>

export const Default: Story = {
  args: {
    label: 'Default Button',
    type: 'primary',
    onPress: () => Alert.alert('Button Pressed', 'Default gradient button was pressed!'),
  },
}

export const ButtonTypes: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
      <View>
        <ThemedText type="body2" color="text-100" className="mb-2">
          Primary Button
        </ThemedText>
        <ThemedGradientButton
          label="Primary Gradient"
          type="primary"
          onPress={() => Alert.alert('Primary Button')}
        />
      </View>

      <View>
        <ThemedText type="body2" color="text-100" className="mb-2">
          Secondary Button
        </ThemedText>
        <ThemedGradientButton
          label="Secondary Gradient"
          type="secondary"
          onPress={() => Alert.alert('Secondary Button')}
        />
      </View>

      <View>
        <ThemedText type="body2" color="text-100" className="mb-2">
          Custom Button
        </ThemedText>
        <ThemedGradientButton
          label="Custom Gradient"
          type="custom"
          customGradientColors={['#ff6b6b', '#4ecdc4', '#45b7d1']}
          onPress={() => Alert.alert('Custom Button')}
        />
      </View>
    </ScrollView>
  ),
}

export const WithIcons: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
        <ThemedGradientButton
          label="Download"
          type="primary"
          icon={<MaterialCommunityIcons name="download" size={24} color={colors?.onPrimary100} />}
          onPress={() => Alert.alert('Download')}
        />

        <ThemedGradientButton
          label="Share"
          type="secondary"
          icon={<MaterialCommunityIcons name="share" size={24} color={colors?.onPrimary100} />}
          onPress={() => Alert.alert('Share')}
        />

        <ThemedGradientButton
          label="Upload"
          type="custom"
          customGradientColors={[colors?.primaryGradientStart, colors?.primaryGradientEnd]}
          icon={
            <MaterialCommunityIcons name="cloud-upload" size={24} color={colors?.onPrimary100} />
          }
          onPress={() => Alert.alert('Upload')}
        />

        <ThemedGradientButton
          label="Delete"
          type="custom"
          customGradientColors={['#ff6b6b', '#ee5a24']}
          icon={<MaterialCommunityIcons name="delete" size={24} color={colors?.onPrimary100} />}
          onPress={() => Alert.alert('Delete')}
        />
      </ScrollView>
    )
  },
}

export const LoadingStates: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
      <View>
        <ThemedText type="body2" color="text-100" className="mb-2">
          Normal State
        </ThemedText>
        <ThemedGradientButton
          label="Click Me"
          type="primary"
          onPress={() => Alert.alert('Normal')}
        />
      </View>

      <View>
        <ThemedText type="body2" color="text-100" className="mb-2">
          Loading State
        </ThemedText>
        <ThemedGradientButton
          label="Loading..."
          type="primary"
          loading={true}
          onPress={() => Alert.alert('Should not fire')}
        />
      </View>

      <View>
        <ThemedText type="body2" color="text-100" className="mb-2">
          Loading with Secondary
        </ThemedText>
        <ThemedGradientButton
          label="Processing"
          type="secondary"
          loading={true}
          onPress={() => Alert.alert('Should not fire')}
        />
      </View>
    </ScrollView>
  ),
}

export const DisabledStates: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
        <View>
          <ThemedText type="body2" color="text-100" className="mb-2">
            Enabled Button
          </ThemedText>
          <ThemedGradientButton
            label="Enabled"
            type="primary"
            onPress={() => Alert.alert('Enabled')}
          />
        </View>

        <View>
          <ThemedText type="body2" color="text-100" className="mb-2">
            Disabled Button
          </ThemedText>
          <ThemedGradientButton
            label="Disabled"
            type="primary"
            disabled={true}
            onPress={() => Alert.alert('Should not fire')}
          />
        </View>

        <View>
          <ThemedText type="body2" color="text-100" className="mb-2">
            Disabled with Icon
          </ThemedText>
          <ThemedGradientButton
            label="Disabled with Icon"
            type="secondary"
            disabled={true}
            icon={
              <MaterialCommunityIcons
                name="menu"
                size={24}
                color={colors?.background?.quaternary}
              />
            }
            onPress={() => Alert.alert('Should not fire')}
          />
        </View>
      </ScrollView>
    )
  },
}

export const HapticFeedback: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
      <View>
        <ThemedText type="body2" color="text-100" className="mb-2">
          Light Haptic
        </ThemedText>
        <ThemedGradientButton
          label="Light Vibration"
          type="primary"
          hapticType="light"
          onPress={() => Alert.alert('Light haptic feedback')}
        />
      </View>

      <View>
        <ThemedText type="body2" color="text-100" className="mb-2">
          Medium Haptic
        </ThemedText>
        <ThemedGradientButton
          label="Medium Vibration"
          type="secondary"
          hapticType="medium"
          onPress={() => Alert.alert('Medium haptic feedback')}
        />
      </View>

      <View>
        <ThemedText type="body2" color="text-100" className="mb-2">
          Heavy Haptic
        </ThemedText>
        <ThemedGradientButton
          label="Heavy Vibration"
          type="custom"
          customGradientColors={['#ff9a9e', '#fecfef']}
          hapticType="heavy"
          onPress={() => Alert.alert('Heavy haptic feedback')}
        />
      </View>

      <View>
        <ThemedText type="body2" color="text-100" className="mb-2">
          No Haptic
        </ThemedText>
        <ThemedGradientButton
          label="No Vibration"
          type="primary"
          hapticFeedback={false}
          onPress={() => Alert.alert('No haptic feedback')}
        />
      </View>
    </ScrollView>
  ),
}

export const ThemedCustomGradients: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
        <View>
          <ThemedText type="body2" color="text-100" className="mb-2">
            Primary Theme Colors
          </ThemedText>
          <ThemedGradientButton
            label="Primary Gradient"
            type="custom"
            customGradientColors={[colors?.primaryGradientStart, colors?.primaryGradientEnd]}
            onPress={() => Alert.alert('Primary theme gradient')}
          />
        </View>

        <View>
          <ThemedText type="body2" color="text-100" className="mb-2">
            Secondary Theme Colors
          </ThemedText>
          <ThemedGradientButton
            label="Secondary Gradient"
            type="custom"
            customGradientColors={[colors?.secondaryGradientStart, colors?.secondaryGradientEnd]}
            onPress={() => Alert.alert('Secondary theme gradient')}
          />
        </View>

        <View>
          <ThemedText type="body2" color="text-100" className="mb-2">
            Background Gradient
          </ThemedText>
          <ThemedGradientButton
            label="Background Colors"
            type="custom"
            customGradientColors={[colors?.background?.secondary, colors?.background?.tertiary]}
            customLabelColor="text-100"
            onPress={() => Alert.alert('Background gradient')}
          />
        </View>

        <View>
          <ThemedText type="body2" color="text-100" className="mb-2">
            Custom Mix
          </ThemedText>
          <ThemedGradientButton
            label="Mixed Theme Colors"
            type="custom"
            customGradientColors={[
              colors?.primaryGradientStart,
              colors?.secondaryGradientStart,
              colors?.primaryGradientEnd,
            ]}
            onPress={() => Alert.alert('Mixed gradient')}
          />
        </View>
      </ScrollView>
    )
  },
}

export const CustomGradients: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
      <ThemedGradientButton
        label="Sunset"
        type="custom"
        customGradientColors={['#ff7e5f', '#feb47b']}
        onPress={() => Alert.alert('Sunset gradient')}
      />

      <ThemedGradientButton
        label="Ocean"
        type="custom"
        customGradientColors={['#00c6ff', '#0072ff']}
        onPress={() => Alert.alert('Ocean gradient')}
      />

      <ThemedGradientButton
        label="Forest"
        type="custom"
        customGradientColors={['#11998e', '#38ef7d']}
        onPress={() => Alert.alert('Forest gradient')}
      />

      <ThemedGradientButton
        label="Purple Rain"
        type="custom"
        customGradientColors={['#667eea', '#764ba2']}
        onPress={() => Alert.alert('Purple rain gradient')}
      />

      <ThemedGradientButton
        label="Fire"
        type="custom"
        customGradientColors={['#ff6b6b', '#feca57', '#ff9ff3']}
        onPress={() => Alert.alert('Fire gradient')}
      />
    </ScrollView>
  ),
}

export const GradientDirections: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
        <View>
          <ThemedText type="body2" color="text-100" className="mb-2">
            Horizontal (Default)
          </ThemedText>
          <ThemedGradientButton
            label="Left to Right"
            type="custom"
            customGradientColors={[colors?.primaryGradientStart, colors?.primaryGradientEnd]}
            gradientStart={{ x: 0, y: 0 }}
            gradientEnd={{ x: 1, y: 0 }}
            onPress={() => Alert.alert('Horizontal')}
          />
        </View>

        <View>
          <ThemedText type="body2" color="text-100" className="mb-2">
            Vertical
          </ThemedText>
          <ThemedGradientButton
            label="Top to Bottom"
            type="custom"
            customGradientColors={[colors?.primaryGradientStart, colors?.primaryGradientEnd]}
            gradientStart={{ x: 0, y: 0 }}
            gradientEnd={{ x: 0, y: 1 }}
            onPress={() => Alert.alert('Vertical')}
          />
        </View>

        <View>
          <ThemedText type="body2" color="text-100" className="mb-2">
            Diagonal
          </ThemedText>
          <ThemedGradientButton
            label="Diagonal"
            type="custom"
            customGradientColors={[colors?.primaryGradientStart, colors?.primaryGradientEnd]}
            gradientStart={{ x: 0, y: 0 }}
            gradientEnd={{ x: 1, y: 1 }}
            onPress={() => Alert.alert('Diagonal')}
          />
        </View>
      </ScrollView>
    )
  },
}

export const InteractiveLoading: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handlePress = () => {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        Alert.alert('Success', 'Operation completed!')
      }, 2000)
    }

    return (
      <View className="gap-4">
        <ThemedText type="body2" color="text-100">
          Click to simulate loading
        </ThemedText>

        <ThemedGradientButton
          label={isLoading ? 'Processing...' : 'Start Process'}
          type="primary"
          loading={isLoading}
          onPress={handlePress}
        />
      </View>
    )
  },
}

export const Interactive: Story = {
  args: {
    label: 'Interactive Button',
    type: 'primary',
    disabled: false,
    loading: false,
    hapticFeedback: true,
    hapticType: 'medium',
    className: 'mx-4',
    customGradientColors: ['#667eea', '#764ba2'],
    customLabelColor: 'text-100',
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 0 },
    onPress: () => Alert.alert('Interactive', 'You can modify props in the controls!'),
  },
}

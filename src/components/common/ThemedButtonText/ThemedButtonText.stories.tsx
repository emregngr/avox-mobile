import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { Alert, View } from 'react-native'

import { ThemedButtonText } from '@/components/common/ThemedButtonText'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const meta: Meta<typeof ThemedButtonText> = {
  title: 'Components/ThemedButtonText',
  component: ThemedButtonText,
  parameters: {
    docs: {
      description: {
        component:
          'A themed button component that displays text with optional icon and customizable typography.',
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
      options: [
        'bigTitle',
        'title',
        'h1',
        'h2',
        'h3',
        'h4',
        'body1',
        'body2',
        'body3',
        'body4',
        'button1',
        'button2',
        'tabBar',
      ],
      description: 'Typography type',
    },
    textColor: {
      control: 'text',
      description: 'Text color class',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction',
    },
    hitSlop: {
      control: 'number',
      description: 'Touch area extension',
    },
    containerStyle: {
      control: 'text',
      description: 'Additional container styles',
    },
    textStyle: {
      control: 'text',
      description: 'Additional text styles',
    },
    onPress: {
      action: 'pressed',
      description: 'Press handler function',
    },
  },
  decorators: [
    Story => (
      <View className="flex-1 p-4 bg-background-primary">
        <Story />
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof ThemedButtonText>

export const Default: Story = {
  args: {
    label: 'Default Button',
    textColor: 'primary-100',
    onPress: () => Alert.alert('Button Pressed', 'Default button was pressed!'),
  },
}

export const TypographyVariations: Story = {
  render: () => (
    <View className="gap-4">
      <ThemedButtonText
        label="Big Title Button"
        type="bigTitle"
        textColor="text-70"
        onPress={() => Alert.alert('Big Title')}
      />
      <ThemedButtonText
        label="Title Button"
        type="title"
        textColor="text-70"
        onPress={() => Alert.alert('Title')}
      />
      <ThemedButtonText
        label="H1 Button"
        type="h1"
        textColor="text-70"
        onPress={() => Alert.alert('H1')}
      />
      <ThemedButtonText
        label="Body1 Button"
        type="body1"
        textColor="text-70"
        onPress={() => Alert.alert('Body1')}
      />
      <ThemedButtonText
        label="Button1 Style"
        type="button1"
        textColor="primary-100"
        onPress={() => Alert.alert('Button1')}
      />
      <ThemedButtonText
        label="Button2 Style"
        type="button2"
        textColor="primary-100"
        onPress={() => Alert.alert('Button2')}
      />
    </View>
  ),
}

export const ColorVariations: Story = {
  render: () => (
    <View className="gap-4">
      <ThemedButtonText
        label="Primary Color"
        textColor="primary-100"
        onPress={() => Alert.alert('Primary')}
      />
      <ThemedButtonText
        label="Secondary Color"
        textColor="secondary-100"
        onPress={() => Alert.alert('Secondary')}
      />
      <ThemedButtonText
        label="Success Color"
        textColor="success"
        onPress={() => Alert.alert('Success')}
      />
      <ThemedButtonText
        label="Warning Color"
        textColor="warning"
        onPress={() => Alert.alert('Warning')}
      />
      <ThemedButtonText
        label="Danger Color"
        textColor="error"
        onPress={() => Alert.alert('Danger')}
      />
    </View>
  ),
}

export const WithIcons: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <View className="gap-4">
        <ThemedButtonText
          label="Download"
          textColor="text-100"
          icon={<MaterialCommunityIcons name="download" size={20} color={colors?.primary100} />}
          onPress={() => Alert.alert('Download')}
        />
        <ThemedButtonText
          label="Share"
          textColor="text-100"
          icon={<MaterialCommunityIcons name="share" size={20} color={colors?.success} />}
          onPress={() => Alert.alert('Share')}
        />
        <ThemedButtonText
          label="Delete"
          textColor="text-100"
          icon={<MaterialCommunityIcons name="delete" size={20} color={colors?.error} />}
          onPress={() => Alert.alert('Delete')}
        />
        <ThemedButtonText
          label="File"
          textColor="text-100"
          icon={<MaterialCommunityIcons name="file" size={20} color={colors?.secondary100} />}
          onPress={() => Alert.alert('File')}
        />
      </View>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <View className="gap-4">
        <ThemedButtonText
          label="Enabled Button"
          textColor="text-100"
          onPress={() => Alert.alert('Enabled')}
        />
        <ThemedButtonText
          label="Disabled Button"
          textColor="text-50"
          disabled={true}
          onPress={() => Alert.alert('This should not show')}
        />
        <ThemedButtonText
          label="Disabled with Icon"
          textColor="text-50"
          disabled={true}
          icon={
            <MaterialCommunityIcons name="lock" size={20} color={colors?.background?.quaternary} />
          }
          onPress={() => Alert.alert('This should not show')}
        />
      </View>
    )
  },
}

export const CustomStyling: Story = {
  render: () => (
    <View className="gap-4">
      <ThemedButtonText
        label="Custom Container"
        textColor="text-100"
        containerStyle="bg-primary-100 px-6 py-3 rounded-lg"
        onPress={() => Alert.alert('Custom Container')}
      />
      <ThemedButtonText
        label="Custom Text Style"
        textColor="primary-100"
        textStyle="font-bold underline"
        onPress={() => Alert.alert('Custom Text')}
      />
      <ThemedButtonText
        label="Centered Button"
        textColor="text-100"
        containerStyle="justify-center bg-primary-100 py-4 rounded-full"
        onPress={() => Alert.alert('Centered')}
      />
    </View>
  ),
}

export const Interactive: Story = {
  args: {
    label: 'Interactive Button',
    type: 'button1',
    textColor: 'text-100',
    disabled: false,
    hitSlop: 20,
    containerStyle: 'bg-primary-100 px-4 py-2 rounded-md',
    textStyle: 'font-medium',
    onPress: () => Alert.alert('Interactive', 'You can modify props in the controls!'),
  },
}

export const HitSlopDemo: Story = {
  render: () => (
    <View className="gap-8 items-center">
      <View>
        <ThemedText type="body2" color="text-70">
          Small hit area (hitSlop: 5)
        </ThemedText>
        <ThemedButtonText
          label="Hard to tap"
          textColor="error"
          hitSlop={5}
          onPress={() => Alert.alert('Small hit area')}
        />
      </View>

      <View>
        <ThemedText type="body2" color="text-70">
          Large hit area (hitSlop: 40)
        </ThemedText>
        <ThemedButtonText
          label="Easy to tap"
          textColor="success"
          hitSlop={40}
          onPress={() => Alert.alert('Large hit area')}
        />
      </View>
    </View>
  ),
}

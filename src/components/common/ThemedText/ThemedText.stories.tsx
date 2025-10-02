import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { ScrollView, View } from 'react-native'

import { ThemedText, type TypographyType } from '@/components/common/ThemedText'

const meta: Meta<typeof ThemedText> = {
  title: 'Components/ThemedText',
  component: ThemedText,
  parameters: {
    docs: {
      description: {
        component:
          'A flexible text component with predefined typography styles and theme-based colors.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Text content to display',
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
      description: 'Typography style type',
    },
    color: {
      control: 'text',
      description: 'Theme-based color (e.g., text-100, primary-50, etc.)',
    },
    center: {
      control: 'boolean',
      description: 'Center align text',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
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

type Story = StoryObj<typeof ThemedText>

export const Default: Story = {
  args: {
    children: 'Default themed text',
    type: 'body1',
    color: 'text-100',
  },
}

export const TypographyHierarchy: Story = {
  render: () => {
    const typographyTypes: { type: TypographyType; label: string; description: string }[] = [
      { type: 'bigTitle', label: 'Big Title', description: '55px - Main hero titles' },
      { type: 'title', label: 'Title', description: '32px - Page titles' },
      { type: 'h1', label: 'Heading 1', description: '24px - Section headers' },
      { type: 'h2', label: 'Heading 2', description: '20px - Subsection headers' },
      { type: 'h3', label: 'Heading 3', description: '18px - Minor headers' },
      { type: 'h4', label: 'Heading 4', description: '16px - Small headers' },
      { type: 'body1', label: 'Body 1', description: '16px - Primary body text' },
      { type: 'body2', label: 'Body 2', description: '14px - Secondary body text' },
      { type: 'body3', label: 'Body 3', description: '13px - Small body text' },
      { type: 'body4', label: 'Body 4', description: '12px - Caption text' },
      { type: 'button1', label: 'Button 1', description: '16px - Primary button text' },
      { type: 'button2', label: 'Button 2', description: '14px - Secondary button text' },
      { type: 'tabBar', label: 'Tab Bar', description: '12px - Navigation tabs' },
    ]

    return (
      <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
        {typographyTypes.map(({ type, label, description }) => (
          <View key={type} className="border-b border-onPrimary-100 pb-4">
            <ThemedText type={type} color="text-100">
              {label}
            </ThemedText>
            <ThemedText type="body4" color="text-70" className="mt-1">
              {description}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    )
  },
}

export const TextColors: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
      <View>
        <ThemedText type="h3" color="text-100" className="mb-3">
          Text Colors
        </ThemedText>
        <View className="gap-2">
          <ThemedText type="body1" color="text-100">
            text-100 - Primary text
          </ThemedText>
          <ThemedText type="body1" color="text-90">
            text-90 - High emphasis
          </ThemedText>
          <ThemedText type="body1" color="text-70">
            text-70 - Medium emphasis
          </ThemedText>
          <ThemedText type="body1" color="text-70">
            text-70 - Low emphasis
          </ThemedText>
          <ThemedText type="body1" color="text-30">
            text-30 - Disabled text
          </ThemedText>
        </View>
      </View>

      <View>
        <ThemedText type="h3" color="text-100" className="mb-3">
          Primary Colors
        </ThemedText>
        <View className="gap-2">
          <ThemedText type="body1" color="primary-100">
            primary-100 - Full primary
          </ThemedText>
          <ThemedText type="body1" color="primary-70">
            primary-70 - Medium primary
          </ThemedText>
          <ThemedText type="body1" color="primary-50">
            primary-50 - Light primary
          </ThemedText>
          <ThemedText type="body1" color="primary-30">
            primary-30 - Subtle primary
          </ThemedText>
        </View>
      </View>

      <View>
        <ThemedText type="h3" color="text-100" className="mb-3">
          Secondary Colors
        </ThemedText>
        <View className="gap-2">
          <ThemedText type="body1" color="secondary-100">
            secondary-100 - Full secondary
          </ThemedText>
          <ThemedText type="body1" color="secondary-50">
            secondary-50 - Medium secondary
          </ThemedText>
          <ThemedText type="body1" color="secondary-30">
            secondary-30 - Light secondary
          </ThemedText>
          <ThemedText type="body1" color="secondary-15">
            secondary-15 - Subtle secondary
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  ),
}

export const StatusColors: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
      <View>
        <ThemedText type="h3" color="text-100" className="mb-3">
          Status Colors
        </ThemedText>
        <View className="gap-2">
          <ThemedText type="body1" color="success">
            ✓ Success message
          </ThemedText>
          <ThemedText type="body1" color="error">
            ✗ Error message
          </ThemedText>
          <ThemedText type="body1" color="warning">
            ⚠ Warning message
          </ThemedText>
          <ThemedText type="body1" color="info">
            ⓘ Info message
          </ThemedText>
        </View>
      </View>

      <View>
        <ThemedText type="h3" color="text-100" className="mb-3">
          Regional Colors
        </ThemedText>
        <View className="gap-2">
          <ThemedText type="body1" color="na">
            🌎 North America
          </ThemedText>
          <ThemedText type="body1" color="eu">
            🌍 Europe
          </ThemedText>
          <ThemedText type="body1" color="as">
            🌏 Asia
          </ThemedText>
          <ThemedText type="body1" color="af">
            🌍 Africa
          </ThemedText>
          <ThemedText type="body1" color="sa">
            🌎 South America
          </ThemedText>
          <ThemedText type="body1" color="oc">
            🌏 Oceania
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  ),
}

export const TextAlignment: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
      <View>
        <ThemedText type="body2" color="text-70" className="mb-2">
          Default (Left) Alignment
        </ThemedText>
        <ThemedText type="body1" color="text-100">
          This text is aligned to the left by default. It flows naturally from left to right.
        </ThemedText>
      </View>

      <View>
        <ThemedText type="body2" color="text-70" className="mb-2">
          Center Alignment
        </ThemedText>
        <ThemedText type="body1" color="text-100" center>
          This text is centered using the center prop. Perfect for headlines and important messages.
        </ThemedText>
      </View>

      <View>
        <ThemedText type="body2" color="text-70" className="mb-2">
          Custom Alignment with className
        </ThemedText>
        <ThemedText type="body1" color="text-100" className="text-right">
          This text is right-aligned using custom className styling.
        </ThemedText>
      </View>
    </ScrollView>
  ),
}

export const RealWorldExamples: Story = {
  render: () => {
    return (
      <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
        <View className="pb-4 border-b border-onPrimary-100">
          <ThemedText type="title" color="text-100" className="mb-2">
            The Future of Mobile Development
          </ThemedText>
          <ThemedText type="body3" color="text-70">
            Published on Sep 29, 2025 • 5 min read
          </ThemedText>
        </View>

        <View className="bg-background-secondary p-4 rounded-xl">
          <ThemedText type="h2" color="text-100" className="mb-2">
            Product Features
          </ThemedText>
          <ThemedText type="body1" color="text-70" className="mb-4">
            Discover what makes our platform unique and powerful for your business needs.
          </ThemedText>
          <ThemedText type="body2" color="success" className="mb-1">
            ✓ Real-time synchronization
          </ThemedText>
          <ThemedText type="body2" color="success" className="mb-1">
            ✓ Advanced analytics
          </ThemedText>
          <ThemedText type="body2" color="success">
            ✓ 24/7 customer support
          </ThemedText>
        </View>

        <View className="gap-3">
          <View className="bg-background-secondary p-3 rounded-md border-l-4 border-info">
            <ThemedText type="button2" color="info">
              Your account has been successfully verified!
            </ThemedText>
          </View>

          <View className="bg-background-secondary p-3 rounded-md border-l-4 border-error">
            <ThemedText type="button2" color="error">
              Unable to connect to server. Please try again.
            </ThemedText>
          </View>
        </View>

        <View className="gap-2">
          <View className="p-3 rounded-md items-center bg-primary-100">
            <ThemedText type="button1" color="text-100">
              Primary Action
            </ThemedText>
          </View>

          <View className="bg-transparent border border-background-quaternary p-3 rounded-md items-center">
            <ThemedText type="button2" color="text-70">
              Secondary Action
            </ThemedText>
          </View>
        </View>

        <View className="flex-row rounded-full p-1 bg-background-tertiary">
          <View className="flex-1 p-2 rounded-full items-center bg-primary-100">
            <ThemedText type="tabBar" color="text-100">
              HOME
            </ThemedText>
          </View>
          <View className="flex-1 p-2 items-center">
            <ThemedText type="tabBar" color="text-100">
              SEARCH
            </ThemedText>
          </View>
          <View className="flex-1 p-2 items-center">
            <ThemedText type="tabBar" color="text-100">
              PROFILE
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    )
  },
}

export const CustomStyling: Story = {
  render: () => {
    return (
      <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
        <View>
          <ThemedText type="h3" color="text-100" className="mb-3">
            Custom Classes
          </ThemedText>
          <ThemedText type="body1" color="primary-100" className="underline">
            Underlined primary text
          </ThemedText>
          <ThemedText type="body1" color="text-100" className="font-bold italic">
            Bold italic text
          </ThemedText>
          <ThemedText type="body1" color="text-70" className="line-through">
            Strikethrough text
          </ThemedText>
        </View>

        <View>
          <ThemedText type="h3" color="text-100" className="mb-3">
            Spacing Examples
          </ThemedText>
          <ThemedText type="body1" color="text-100" className="mb-2">
            Paragraph with margin bottom
          </ThemedText>
          <ThemedText type="body1" color="text-70" className="pl-4">
            Indented text with left padding
          </ThemedText>
        </View>

        <View>
          <ThemedText type="h3" color="text-100" className="mb-3">
            Background Examples
          </ThemedText>
          <ThemedText
            type="body1"
            color="text-100"
            className="px-2 py-1 rounded-md bg-background-quaternary"
          >
            Highlighted text
          </ThemedText>
          <ThemedText
            type="body1"
            color="text-100"
            className="px-3 py-2 rounded-xl mt-2 bg-primary-100"
          >
            Badge-like text
          </ThemedText>
        </View>
      </ScrollView>
    )
  },
}

export const Interactive: Story = {
  args: {
    children: 'Interactive themed text',
    type: 'body1',
    color: 'text-100',
    center: false,
    className: '',
  },
}

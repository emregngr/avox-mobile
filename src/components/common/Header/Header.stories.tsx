import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import { Alert, TouchableOpacity, View } from 'react-native'

import { Header } from '@/components/common/Header'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    docs: {
      description: {
        component:
          'Header component with back button, title, and customizable right actions including glass effect styling.',
      },
    },
  },
  decorators: [
    Story => (
      <View className="flex-1 bg-background-primary pt-[20px]">
        <Story />
        <View className="flex-1 bg-background-secondary m-4 rounded-xl justify-center items-center">
          <ThemedText type="h3" color="text-100">
            Content Area
          </ThemedText>
        </View>
      </View>
    ),
  ],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Header title text',
    },
    backIcon: {
      control: { type: 'boolean' },
      description: 'Show back button',
    },
    rightButtonLabel: {
      control: { type: 'text' },
      description: 'Right button label text',
    },
    hapticFeedback: {
      control: { type: 'boolean' },
      description: 'Enable haptic feedback on interactions',
    },
    isFavorite: {
      control: { type: 'boolean' },
      description: 'Favorite state for haptic feedback intensity',
    },
    containerClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for container',
    },
    titleClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for title',
    },
    testID: {
      control: { type: 'text' },
      description: 'Test identifier',
    },
  },
}

export default meta

type Story = StoryObj<typeof Header>

export const Default: Story = {
  args: {
    title: 'Page Title',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic header with title and back button.',
      },
    },
  },
}

export const NoBackButton: Story = {
  args: {
    title: 'Settings',
    backIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header without back button for top-level pages.',
      },
    },
  },
}

export const WithRightButton: Story = {
  args: {
    title: 'Edit Profile',
    rightButtonLabel: 'Save',
    rightButtonOnPress: () => Alert.alert('Save', 'Save button pressed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with text button on the right side.',
      },
    },
  },
}

export const WithRightIcon: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <Header
        title="Article Title"
        rightIcon={
          <MaterialCommunityIcons color={colors?.onPrimary100} name={'heart-outline'} size={20} />
        }
        rightIconOnPress={() => Alert.alert('Favorite', 'Added to favorites')}
        hapticFeedback={true}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with icon button on the right side with haptic feedback.',
      },
    },
  },
}

export const WithShareIcon: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <Header
        title="Shared Content"
        shareIcon={
          <MaterialCommunityIcons
            color={colors?.onPrimary100}
            name={'share-variant-outline'}
            size={20}
          />
        }
        rightIcon={
          <MaterialCommunityIcons color={colors?.onPrimary100} name={'dots-horizontal'} size={20} />
        }
        shareIconOnPress={() => Alert.alert('Share', 'Share dialog opened')}
        rightIconOnPress={() => Alert.alert('More', 'More options menu')}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with both share and more icons.',
      },
    },
  },
}

export const LongTitle: Story = {
  args: {
    title:
      'This is a very long title that should be truncated properly when it exceeds the available space',
    rightButtonLabel: 'Done',
    rightButtonOnPress: () => Alert.alert('Done', 'Done button pressed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with long title that gets truncated.',
      },
    },
  },
}

export const NoTitle: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <Header
        rightIcon={
          <MaterialCommunityIcons color={colors?.onPrimary100} name={'heart-outline'} size={20} />
        }
        rightIconOnPress={() => Alert.alert('Heart', 'Heart icon pressed')}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Header without title, showing only navigation elements.',
      },
    },
  },
}

export const AllFeatures: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <Header
        title="Full Featured Header"
        shareIcon={
          <MaterialCommunityIcons
            color={colors?.onPrimary100}
            name={'share-variant-outline'}
            size={20}
          />
        }
        rightIcon={
          <MaterialCommunityIcons color={colors?.onPrimary100} name={'heart-outline'} size={20} />
        }
        backIconOnPress={() => Alert.alert('Back', 'Navigation back')}
        shareIconOnPress={() => Alert.alert('Share', 'Share content')}
        rightIconOnPress={() => Alert.alert('Favorite', 'Toggle favorite')}
        hapticFeedback={true}
        isFavorite={true}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with all available features enabled.',
      },
    },
  },
}

export const InteractiveStates: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const [isFavorite, setIsFavorite] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('Interactive Header')

    return (
      <Header
        title={title}
        backIconOnPress={() => Alert.alert('Back', 'Going back...')}
        rightIcon={
          <MaterialCommunityIcons
            color={isFavorite ? colors?.tertiary100 : colors?.onPrimary100}
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
          />
        }
        rightIconOnPress={() => {
          setIsFavorite(!isFavorite)
          setTitle(isFavorite ? 'Removed from favorites' : 'Added to favorites')
          setTimeout(() => setTitle('Interactive Header'), 2000)
        }}
        hapticFeedback={true}
        isFavorite={isFavorite}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive header with state changes and feedback.',
      },
    },
  },
}

export const LayoutVariations: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <View className="gap-4">
        <View>
          <ThemedText type="body4" color="text-70" className="mb-2">
            Back + Title
          </ThemedText>
          <Header title="Back with Title" />
        </View>
        <View>
          <ThemedText type="body4" color="text-70" className="mb-2">
            Title + Right Button
          </ThemedText>
          <Header
            title="Title with Button"
            backIcon={false}
            rightButtonLabel="Action"
            rightButtonOnPress={() => Alert.alert('Action', 'Button pressed')}
          />
        </View>
        <View>
          <ThemedText type="body4" color="text-70" className="mb-2">
            Title + Multiple Icons
          </ThemedText>
          <Header
            title="Multiple Icons"
            shareIcon={
              <MaterialCommunityIcons
                color={colors?.onPrimary100}
                name={'share-variant-outline'}
                size={20}
              />
            }
            shareIconOnPress={() => Alert.alert('Share', 'Share pressed')}
            rightIcon={
              <MaterialCommunityIcons
                color={colors?.onPrimary100}
                name={'dots-horizontal'}
                size={20}
              />
            }
            rightIconOnPress={() => Alert.alert('More', 'More pressed')}
          />
        </View>
        <View>
          <ThemedText type="body4" color="text-70" className="mb-2">
            Icons Only
          </ThemedText>
          <Header
            shareIcon={
              <MaterialCommunityIcons
                color={colors?.onPrimary100}
                name={'share-variant-outline'}
                size={20}
              />
            }
            shareIconOnPress={() => Alert.alert('Share', 'Share pressed')}
            rightIcon={
              <MaterialCommunityIcons
                color={colors?.onPrimary100}
                name={'heart-outline'}
                size={20}
              />
            }
            rightIconOnPress={() => Alert.alert('Heart', 'Heart pressed')}
          />
        </View>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Different layout variations of the header component.',
      },
    },
  },
}

export const CustomStyling: Story = {
  args: {
    title: 'Custom Styled Header',
    containerClassName: 'bg-primary-100 rounded-xl mx-4 h-16 border-2 border-onPrimary-100',
    titleClassName: 'font-bold',
    rightButtonLabel: 'Custom',
    rightButtonOnPress: () => Alert.alert('Custom', 'Custom styled button'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with custom styling and classes.',
      },
    },
  },
}

export const ErrorHandling: Story = {
  render: () => (
    <Header
      title="Error Test Header"
      rightButtonLabel="Error"
      rightButtonOnPress={() => {
        try {
          throw new Error('Test error')
        } catch (error) {
          Alert.alert('Error', 'Something went wrong!')
        }
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header with error handling in button press.',
      },
    },
  },
}

export const Playground: Story = {
  argTypes: {
    rightIconType: {
      control: { type: 'select' },
      options: ['none', 'heart', 'share', 'more'],
      description: 'Select right icon type',
    },
    shareIconType: {
      control: { type: 'select' },
      options: ['none', 'heart', 'share', 'more'],
      description: 'Select share icon type',
    },
  } as any,
  render: args => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const { rightIconType = 'heart', shareIconType = 'none', ...headerProps } = args as any

    return (
      <Header
        {...headerProps}
        rightIcon={
          rightIconType !== 'none' ? (
            <MaterialCommunityIcons color={colors?.onPrimary100} name={'heart-outline'} size={20} />
          ) : undefined
        }
        shareIcon={
          shareIconType !== 'none' ? (
            <MaterialCommunityIcons
              color={colors?.onPrimary100}
              name={'share-variant-outline'}
              size={20}
            />
          ) : undefined
        }
        rightIconOnPress={() => Alert.alert('Right Icon', `${rightIconType} icon pressed`)}
        shareIconOnPress={() => Alert.alert('Share Icon', `${shareIconType} icon pressed`)}
      />
    )
  },
  args: {
    title: 'Playground Header',
    backIcon: true,
    rightButtonLabel: '',
    hapticFeedback: true,
    isFavorite: false,
    testID: 'playground-header',
    rightIconType: 'heart',
    shareIconType: 'none',
  } as any,
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all props and configurations.',
      },
    },
  },
}

export const IconPlayground: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const [selectedIcon, setSelectedIcon] = useState<
      'heart-outline' | 'share-variant-outline' | 'dots-horizontal'
    >('heart-outline')
    const [showShareIcon, setShowShareIcon] = useState<boolean>(false)

    const iconButtons = [
      { type: 'heart-outline' as const, label: 'Heart' },
      { type: 'share-variant-outline' as const, label: 'Share' },
      { type: 'dots-horizontal' as const, label: 'More' },
    ]

    return (
      <View>
        <Header
          title="Icon Playground"
          rightIcon={
            <MaterialCommunityIcons color={colors?.onPrimary100} name={selectedIcon} size={20} />
          }
          shareIcon={
            showShareIcon ? (
              <MaterialCommunityIcons
                color={colors?.onPrimary100}
                name={'share-variant-outline'}
                size={20}
              />
            ) : undefined
          }
          rightIconOnPress={() => Alert.alert('Right Icon', `${selectedIcon} pressed`)}
          shareIconOnPress={() => Alert.alert('Share', 'Share pressed')}
          hapticFeedback={true}
        />

        <View className="p-4 gap-3">
          <ThemedText type="body4" color="text-70">
            Right Icon Type:
          </ThemedText>
          <View className="flex-row gap-2">
            {iconButtons.map(icon => (
              <TouchableOpacity
                key={icon.type}
                activeOpacity={0.7}
                className="p-2 rounded min-w-[60px] items-center"
                style={{
                  backgroundColor:
                    selectedIcon === icon.type ? colors?.primary100 : colors?.secondary100,
                }}
                onPress={() => setSelectedIcon(icon.type)}
              >
                <ThemedText type="body4" color="text-100">
                  {icon.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="p-2 rounded items-center mt-2"
            style={{ backgroundColor: showShareIcon ? colors?.primary100 : colors?.secondary100 }}
            onPress={() => setShowShareIcon(!showShareIcon)}
          >
            <ThemedText type="body4" color="text-100">
              {showShareIcon ? 'Hide' : 'Show'} Share Icon
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test different icon combinations.',
      },
    },
  },
}

export const ButtonPlayground: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const [buttonLabel, setButtonLabel] = useState<string>('Action')
    const [showButton, setShowButton] = useState<boolean>(true)

    const buttonLabels = ['Save', 'Done', 'Edit', 'More', 'Action']

    return (
      <View>
        <Header
          title="Button Playground"
          rightButtonLabel={showButton ? buttonLabel : ''}
          rightButtonOnPress={() => Alert.alert('Button', `${buttonLabel} pressed`)}
          hapticFeedback={true}
        />

        <View className="p-4 gap-3">
          <ThemedText type="body4" color="text-70">
            Button Labels:
          </ThemedText>
          <View className="flex-row flex-wrap gap-2">
            {buttonLabels.map(label => (
              <TouchableOpacity
                key={label}
                activeOpacity={0.7}
                className="p-2 rounded min-w-[50px] items-center"
                style={{
                  backgroundColor:
                    buttonLabel === label ? colors?.primary100 : colors?.secondary100,
                }}
                onPress={() => setButtonLabel(label)}
              >
                <ThemedText type="body4" color="text-100">
                  {label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="p-2 rounded items-center mt-2"
            style={{ backgroundColor: showButton ? colors?.primary100 : colors?.secondary100 }}
            onPress={() => setShowButton(!showButton)}
          >
            <ThemedText type="body4" color="text-100">
              {showButton ? 'Hide' : 'Show'} Button
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test different button configurations.',
      },
    },
  },
}

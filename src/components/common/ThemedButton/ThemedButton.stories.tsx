import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native'

import Apple from '@/assets/icons/apple.svg'
import Google from '@/assets/icons/google.svg'
import { ThemedButton } from '@/components/common/ThemedButton'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

type ButtonType = 'normal' | 'border' | 'social' | 'danger'
type HapticType = 'light' | 'medium' | 'heavy'

interface ButtonConfig {
  label: string
  type: ButtonType
  disabled: boolean
  loading: boolean
  hapticFeedback: boolean
  hapticType: HapticType
  withIcon: boolean
}

interface Interactions {
  pressCount: number
  lastPressed: string | null
}

interface LoadingStates {
  normal: boolean
  border: boolean
  social: boolean
  danger: boolean
}

const PlayIcon = ({ color }: { color: string }) => (
  <MaterialCommunityIcons name="play" size={24} color={color} />
)

const DownloadIcon = ({ color }: { color: string }) => (
  <MaterialCommunityIcons name="download" size={24} color={color} />
)

const HeartIcon = ({ color }: { color: string }) => (
  <MaterialCommunityIcons name="heart" size={24} color={color} />
)

const DeleteIcon = ({ color }: { color: string }) => (
  <MaterialCommunityIcons name="delete" size={24} color={color} />
)

const AppleIcon = () => {
  const { selectedTheme } = useThemeStore()
  const colors = themeColors?.[selectedTheme]

  return <Apple color={colors?.background?.primary} height={24} width={24} />
}

const ButtonDemo = ({
  buttonProps,
  showInteraction = true,
}: {
  buttonProps: any
  showInteraction?: boolean
}) => {
  const [pressCount, setPressCount] = useState<number>(0)
  const [lastPressed, setLastPressed] = useState<string | null>(null)

  const handlePress = () => {
    setPressCount(prev => prev + 1)
    setLastPressed(new Date().toLocaleTimeString())
    buttonProps.onPress?.()
  }

  return (
    <View>
      <ThemedButton {...buttonProps} onPress={handlePress} />

      {showInteraction ? (
        <View className="mt-4 p-3 bg-background-secondary rounded-lg min-w-[200px] items-center">
          <ThemedText color="text-70" type="h3">
            Pressed: {pressCount} times
          </ThemedText>
          {lastPressed ? (
            <ThemedText color="text-50" type="h3">
              Last: {lastPressed}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

const meta: Meta<typeof ThemedButton> = {
  title: 'Components/ThemedButton',
  component: ThemedButton,
  parameters: {
    docs: {
      description: {
        component:
          'Versatile themed button component with multiple variants, loading states, haptic feedback, and icon support. Includes normal, border, social, and danger types.',
      },
    },
  },
  decorators: [
    Story => (
      <View className="flex-1 p-4 bg-background-primary">
        <Story />
      </View>
    ),
  ],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Button text label',
    },
    type: {
      control: { type: 'select' },
      options: ['normal', 'border', 'social', 'danger'],
      description: 'Button variant type',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable button interaction',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Show loading state with spinner',
    },
    hapticFeedback: {
      control: { type: 'boolean' },
      description: 'Enable haptic feedback on press',
    },
    hapticType: {
      control: { type: 'select' },
      options: ['light', 'medium', 'heavy'],
      description: 'Haptic feedback intensity',
    },
  },
}

export default meta

type Story = StoryObj<typeof ThemedButton>

export const Default: Story = {
  args: {
    label: 'Default Button',
    onPress: () => Alert.alert('Pressed', 'Default button pressed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default normal button with primary styling.',
      },
    },
  },
}

export const ButtonTypes: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <ScrollView contentContainerClassName="gap-4 py-4" showsVerticalScrollIndicator={false}>
        <View>
          <ThemedText color="text-100" type="h4" className="mb-3">
            Normal Button
          </ThemedText>
          <ButtonDemo
            buttonProps={{
              label: 'Primary Action',
              type: 'normal',
              onPress: () => Alert.alert('Normal', 'Normal button pressed'),
            }}
            showInteraction={false}
          />
        </View>

        <View>
          <ThemedText color="text-100" type="h4" className="mb-3">
            Border Button
          </ThemedText>
          <ButtonDemo
            buttonProps={{
              label: 'Secondary Action',
              type: 'border',
              onPress: () => Alert.alert('Border', 'Border button pressed'),
            }}
            showInteraction={false}
          />
        </View>

        <View>
          <ThemedText color="text-100" type="h4" className="mb-3">
            Social Button
          </ThemedText>
          <ButtonDemo
            buttonProps={{
              label: 'Continue with Google',
              type: 'social',
              icon: <Google />,
              onPress: () => Alert.alert('Social', 'Social button pressed'),
            }}
            showInteraction={false}
          />
        </View>

        <View>
          <ThemedText color="text-100" type="h4" className="mb-3">
            Danger Button
          </ThemedText>
          <ButtonDemo
            buttonProps={{
              label: 'Delete Account',
              type: 'danger',
              icon: <DeleteIcon color={colors?.onPrimary100} />,
              onPress: () => Alert.alert('Danger', 'Danger button pressed'),
            }}
            showInteraction={false}
          />
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'All button type variants with their respective styling.',
      },
    },
  },
}

export const WithIcons: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <ScrollView contentContainerClassName="gap-4 py-4" showsVerticalScrollIndicator={false}>
        <ButtonDemo
          buttonProps={{
            label: 'Play Video',
            icon: <PlayIcon color={colors?.onPrimary100} />,
            type: 'normal',
            onPress: () => Alert.alert('Play', 'Playing video'),
          }}
          showInteraction={false}
        />

        <ButtonDemo
          buttonProps={{
            label: 'Download File',
            icon: <DownloadIcon color={colors?.onPrimary100} />,
            type: 'border',
            onPress: () => Alert.alert('Download', 'Downloading file'),
          }}
          showInteraction={false}
        />

        <ButtonDemo
          buttonProps={{
            label: 'Add to Favorites',
            icon: <HeartIcon color={colors?.onPrimary100} />,
            type: 'normal',
            onPress: () => Alert.alert('Favorite', 'Added to favorites'),
          }}
          showInteraction={false}
        />

        <ButtonDemo
          buttonProps={{
            label: 'Social Button',
            icon: <AppleIcon />,
            type: 'social',
            onPress: () => Alert.alert('Social', 'Social content'),
          }}
          showInteraction={false}
        />
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Buttons with various icons demonstrating icon integration.',
      },
    },
  },
}

export const LoadingStates: Story = {
  render: () => {
    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
      normal: false,
      border: false,
      social: false,
      danger: false,
    })

    const toggleLoading = (type: keyof typeof loadingStates) => {
      setLoadingStates(prev => ({ ...prev, [type]: !prev[type] }))

      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [type]: false }))
      }, 3000)
    }

    return (
      <ScrollView contentContainerClassName="gap-4 py-4" showsVerticalScrollIndicator={false}>
        <View className="items-center">
          <ThemedText color="text-100" type="h4" className="mb-3">
            Loading States Demo
          </ThemedText>
          <ThemedText color="text-70" type="body2" className="mb-5 text-center">
            Click buttons to see loading states (auto-resets in 3s)
          </ThemedText>
        </View>

        <ThemedButton
          label="Normal Loading"
          type="normal"
          disabled={loadingStates.normal}
          loading={loadingStates.normal}
          onPress={() => toggleLoading('normal')}
        />

        <ThemedButton
          label="Border Loading"
          type="border"
          disabled={loadingStates.border}
          loading={loadingStates.border}
          onPress={() => toggleLoading('border')}
        />

        <ThemedButton
          label="Social Loading"
          type="social"
          icon={<Google />}
          disabled={loadingStates.social}
          loading={loadingStates.social}
          onPress={() => toggleLoading('social')}
        />

        <ThemedButton
          label="Danger Loading"
          type="danger"
          disabled={loadingStates.danger}
          loading={loadingStates.danger}
          onPress={() => toggleLoading('danger')}
        />

        <View className="mt-5 p-4 bg-background-secondary rounded-lg">
          <ThemedText color="text-100" type="body2" className="mb-2">
            Loading State Features:
          </ThemedText>
          <ThemedText color="text-70" type="h3">
            • ActivityIndicator replaces button content{'\n'}• Button remains disabled during
            loading{'\n'}• Haptic feedback disabled while loading{'\n'}• Consistent spinner color
            across themes
          </ThemedText>
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading states for all button types with automatic reset.',
      },
    },
  },
}

export const DisabledStates: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    return (
      <ScrollView contentContainerClassName="gap-4 py-4" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-5">
          <ThemedText color="text-100" type="h4" className="mb-2">
            Disabled Button States
          </ThemedText>
          <ThemedText color="text-70" type="body2" className="text-center">
            All button types in their disabled state
          </ThemedText>
        </View>

        <ThemedButton label="Disabled Normal" type="normal" disabled={true} onPress={() => {}} />

        <ThemedButton label="Disabled Border" type="border" disabled={true} onPress={() => {}} />

        <ThemedButton
          label="Disabled Social"
          type="social"
          icon={<Google />}
          disabled={true}
          onPress={() => {}}
        />

        <ThemedButton
          label="Disabled Danger"
          type="danger"
          icon={<DeleteIcon color={colors?.onPrimary100} />}
          disabled={true}
          onPress={() => {}}
        />

        <View className="mt-5 p-4 bg-background-secondary rounded-lg">
          <ThemedText color="text-100" type="body2" className="mb-2">
            Disabled State Features:
          </ThemedText>
          <ThemedText color="text-70" type="h3">
            • Gray background (background-quaternary){'\n'}• Reduced text opacity (text-50){'\n'}•
            No haptic feedback{'\n'}• onPress handler ignored{'\n'}• Visual indication of
            non-interactive state
          </ThemedText>
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled states showing visual feedback for non-interactive buttons.',
      },
    },
  },
}

export const HapticFeedback: Story = {
  render: () => {
    const [lastHaptic, setLastHaptic] = useState<string | null>(null)

    const createHapticHandler = (type: string, hapticType?: 'light' | 'medium' | 'heavy') => () => {
      setLastHaptic(`${type} - ${hapticType || 'default'}`)
      Alert.alert('Haptic Feedback', `${type} haptic triggered`)
    }

    return (
      <ScrollView contentContainerClassName="gap-4 py-4" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-5">
          <ThemedText color="text-100" type="h4" className="mb-2">
            Haptic Feedback Types
          </ThemedText>
          <ThemedText color="text-70" type="body2" className="text-center">
            Feel the difference between haptic intensities
          </ThemedText>
        </View>

        <ThemedButton
          label="Light Haptic"
          type="normal"
          hapticType="light"
          onPress={createHapticHandler('Light', 'light')}
        />

        <ThemedButton
          label="Medium Haptic (Default)"
          type="border"
          hapticType="medium"
          onPress={createHapticHandler('Medium', 'medium')}
        />

        <ThemedButton
          label="Heavy Haptic"
          type="social"
          hapticType="heavy"
          onPress={createHapticHandler('Heavy', 'heavy')}
        />

        <ThemedButton
          label="Danger (Auto Heavy)"
          type="danger"
          onPress={createHapticHandler('Danger')}
        />

        <ThemedButton
          label="No Haptic Feedback"
          type="normal"
          hapticFeedback={false}
          onPress={createHapticHandler('None (Disabled)')}
        />

        {lastHaptic ? (
          <View className="p-4 bg-background-secondary rounded-lg items-center">
            <ThemedText color="success" type="body2">
              Last Haptic: {lastHaptic}
            </ThemedText>
          </View>
        ) : null}

        <View className="mt-5 p-4 bg-background-secondary rounded-lg">
          <ThemedText color="text-100" type="body2" className="mb-2">
            Haptic Features:
          </ThemedText>
          <ThemedText color="text-70" type="h3">
            • Light: Subtle feedback for secondary actions{'\n'}• Medium: Standard feedback for
            primary actions{'\n'}• Heavy: Strong feedback for important actions{'\n'}• Danger
            buttons automatically use heavy haptic{'\n'}• Can be disabled per button{'\n'}• No
            haptic when disabled or loading
          </ThemedText>
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Different haptic feedback intensities and configurations.',
      },
    },
  },
}

export const InteractivePlayground: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const [buttonConfig, setButtonConfig] = useState<ButtonConfig>({
      label: 'Interactive Button',
      type: 'normal',
      disabled: false,
      loading: false,
      hapticFeedback: true,
      hapticType: 'medium',
      withIcon: false,
    })

    const [interactions, setInteractions] = useState<Interactions>({
      pressCount: 0,
      lastPressed: null,
    })

    const handlePress = () => {
      setInteractions(prev => ({
        pressCount: prev.pressCount + 1,
        lastPressed: new Date().toLocaleTimeString(),
      }))
      Alert.alert('Button Pressed', `Configuration: ${JSON.stringify(buttonConfig, null, 2)}`)
    }

    const getIcon = () => {
      if (!buttonConfig.withIcon) return undefined

      switch (buttonConfig.type) {
        case 'normal':
          return <PlayIcon color={colors?.onPrimary100} />
        case 'border':
          return <DownloadIcon color={colors?.onPrimary100} />
        case 'social':
          return <Google />
        case 'danger':
          return <DeleteIcon color={colors?.onPrimary100} />
        default:
          return undefined
      }
    }

    return (
      <ScrollView contentContainerClassName="py-4" showsVerticalScrollIndicator={false}>
        <View className="p-4 bg-background-secondary rounded-xl mb-8">
          <ThemedText color="text-100" type="h4" className="mb-4">
            Button Configuration
          </ThemedText>

          <View className="mb-4">
            <ThemedText color="text-90" type="body2" className="mb-2">
              Button Type:
            </ThemedText>
            <View className="flex-row flex-wrap gap-2">
              {(['normal', 'border', 'social', 'danger'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  activeOpacity={0.7}
                  className="p-2 rounded-md"
                  style={{
                    backgroundColor:
                      buttonConfig.type === type ? colors?.success : colors?.background?.quaternary,
                  }}
                  onPress={() => setButtonConfig(prev => ({ ...prev, type }))}
                >
                  <ThemedText color={buttonConfig.type === type ? 'text-100' : 'text-70'} type="h3">
                    {type}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="gap-3">
            {[
              { key: 'disabled', label: 'Disabled' },
              { key: 'loading', label: 'Loading' },
              { key: 'hapticFeedback', label: 'Haptic Feedback' },
              { key: 'withIcon', label: 'With Icon' },
            ].map(toggle => (
              <TouchableOpacity
                key={toggle.key}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-3 bg-background-primary rounded-lg"
                onPress={() =>
                  setButtonConfig(prev => ({
                    ...prev,
                    [toggle.key]: !prev[toggle.key as keyof typeof prev],
                  }))
                }
              >
                <ThemedText color="text-100" type="body2">
                  {toggle.label}
                </ThemedText>
                <View
                  className="w-5 h-5 rounded-full"
                  style={{
                    backgroundColor: buttonConfig[toggle.key as keyof typeof buttonConfig]
                      ? colors?.success
                      : colors?.background?.quaternary,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {buttonConfig.hapticFeedback ? (
            <View className="mt-4">
              <ThemedText color="text-100" type="body2" className="mb-2">
                Haptic Type:
              </ThemedText>
              <View className="flex-row gap-2">
                {(['light', 'medium', 'heavy'] as const).map(hapticType => (
                  <TouchableOpacity
                    key={hapticType}
                    activeOpacity={0.7}
                    className="p-2 rounded-md flex-1 items-center"
                    style={{
                      backgroundColor:
                        buttonConfig.hapticType === hapticType
                          ? colors?.success
                          : colors?.background?.quaternary,
                    }}
                    onPress={() => setButtonConfig(prev => ({ ...prev, hapticType }))}
                  >
                    <ThemedText
                      color={buttonConfig.hapticType === hapticType ? 'text-100' : 'text-70'}
                      type="h3"
                    >
                      {hapticType}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        <View className="mb-5">
          <ThemedButton
            label={buttonConfig.label}
            type={buttonConfig.type}
            disabled={buttonConfig.disabled}
            loading={buttonConfig.loading}
            hapticFeedback={buttonConfig.hapticFeedback}
            hapticType={buttonConfig.hapticType}
            icon={getIcon()}
            onPress={handlePress}
          />
        </View>

        <View className="p-4 bg-background-tertiary rounded-xl">
          <ThemedText color="text-100" type="h4" className="mb-4">
            Interaction Stats
          </ThemedText>

          <View className="flex-row justify-between mb-3">
            <ThemedText color="text-90" type="body2">
              Press Count:
            </ThemedText>
            <ThemedText color="text-100" type="body2">
              {interactions.pressCount}
            </ThemedText>
          </View>

          {interactions.lastPressed ? (
            <View className="flex-row justify-between mb-3">
              <ThemedText color="text-90" type="body2">
                Last Pressed:
              </ThemedText>
              <ThemedText color="text-100" type="body2">
                {interactions.lastPressed}
              </ThemedText>
            </View>
          ) : null}

          <View className="flex-row justify-between">
            <ThemedText color="text-90" type="body2">
              Current State:
            </ThemedText>
            <ThemedText
              color={buttonConfig.disabled || buttonConfig.loading ? 'error' : 'success'}
              type="body2"
            >
              {buttonConfig.disabled ? 'Disabled' : buttonConfig.loading ? 'Loading' : 'Active'}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all button configurations and states.',
      },
    },
  },
}

export const AccessibilityTesting: Story = {
  render: () => (
    <ScrollView contentContainerClassName="py-4 gap-4" showsVerticalScrollIndicator={false}>
      <View className="p-4 bg-background-tertiary rounded-xl">
        <ThemedText color="text-100" type="h3" className="mb-4">
          Test Identifiers
        </ThemedText>

        <View className="bg-background-primary p-3 rounded-lg mb-4">
          <ThemedText color="success" type="body1" className="mb-2">
            Available Test IDs:
          </ThemedText>
          <ThemedText color="text-70" type="body2">
            themed-button{'\n'}
            activity-indicator (when loading)
          </ThemedText>
        </View>

        <ThemedText color="text-100" type="body1" className="mb-2">
          Accessibility Features:
        </ThemedText>
        <ThemedText color="text-70" type="body2">
          • Hit slop of 20px for better touch targets{'\n'}• Proper disabled state handling{'\n'}•
          Loading state with activity indicator{'\n'}• Semantic button role{'\n'}• Haptic feedback
          for better UX{'\n'}• High contrast color ratios
        </ThemedText>
      </View>

      <ThemedButton
        label="Test Button"
        onPress={() => Alert.alert('Accessibility', 'Button is fully accessible!')}
      />

      <ThemedButton label="Disabled Test Button" disabled={true} onPress={() => {}} />

      <ThemedButton label="Loading Test Button" loading={true} onPress={() => {}} />
    </ScrollView>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features and testing capabilities.',
      },
    },
  },
}

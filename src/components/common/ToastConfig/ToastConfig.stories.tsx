import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { ScrollView, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { ThemedGradientButton } from '@/components/common/ThemedGradientButton'
import { ThemedText } from '@/components/common/ThemedText'
import { useToastConfig } from '@/components/common/ToastConfig'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const ToastConfigDemo = () => {
  const { selectedTheme } = useThemeStore()
  const colors = themeColors?.[selectedTheme]

  const toastConfig = useToastConfig()

  const showSuccessToast = (title: string, message: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
    })
  }

  const showErrorToast = (title: string, message: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
    })
  }

  return (
    <View className="flex-1 p-4">
      <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
        <View>
          <ThemedText type="h2" color="text-100" className="mb-4">
            Toast Configuration Demo
          </ThemedText>
          <ThemedText type="body2" color="text-70" className="mb-6">
            Test different toast types and configurations. The toasts will appear at the top of the
            screen.
          </ThemedText>
        </View>

        <View>
          <ThemedText type="h3" color="text-100" className="mb-3">
            Success Toasts
          </ThemedText>

          <View className="gap-3">
            <ThemedGradientButton
              label="Show Success Toast"
              type="custom"
              customGradientColors={[colors?.success, colors?.success]}
              onPress={() => showSuccessToast('Success!', 'Operation completed successfully')}
            />

            <ThemedGradientButton
              label="Long Success Message"
              type="custom"
              customGradientColors={[colors?.success, colors?.success]}
              onPress={() =>
                showSuccessToast(
                  'Data Sync Complete',
                  'Your data has been synchronized across all devices and is now up to date',
                )
              }
            />

            <ThemedGradientButton
              label="Simple Success"
              type="custom"
              customGradientColors={[colors?.success, colors?.success]}
              onPress={() => showSuccessToast('Saved', 'Changes saved')}
            />
          </View>
        </View>

        <View>
          <ThemedText type="h3" color="text-100" className="mb-3">
            Error Toasts
          </ThemedText>

          <View className="gap-3">
            <ThemedGradientButton
              label="Show Error Toast"
              type="custom"
              customGradientColors={[colors?.error, colors?.error]}
              onPress={() => showErrorToast('Error!', 'Something went wrong')}
            />

            <ThemedGradientButton
              label="Network Error"
              type="custom"
              customGradientColors={[colors?.error, colors?.error]}
              onPress={() =>
                showErrorToast(
                  'Connection Failed',
                  'Unable to connect to server. Please check your internet connection and try again',
                )
              }
            />

            <ThemedGradientButton
              label="Validation Error"
              type="custom"
              customGradientColors={[colors?.error, colors?.error]}
              onPress={() => showErrorToast('Invalid Input', 'Please fill in all required fields')}
            />
          </View>
        </View>

        <View>
          <ThemedText type="h3" color="text-100" className="mb-3">
            Real-world Examples
          </ThemedText>

          <View className="gap-3">
            <ThemedGradientButton
              label="Login Success"
              type="primary"
              onPress={() =>
                showSuccessToast('Welcome Back!', 'You have been successfully logged in')
              }
            />

            <ThemedGradientButton
              label="File Upload"
              type="primary"
              onPress={() =>
                showSuccessToast('Upload Complete', 'Your file has been uploaded and processed')
              }
            />

            <ThemedGradientButton
              label="Payment Error"
              type="custom"
              customGradientColors={[colors?.error, colors?.error]}
              onPress={() =>
                showErrorToast(
                  'Payment Failed',
                  'Your card was declined. Please try a different payment method',
                )
              }
            />

            <ThemedGradientButton
              label="Server Error"
              type="custom"
              customGradientColors={[colors?.error, colors?.error]}
              onPress={() =>
                showErrorToast(
                  'Server Error (500)',
                  'Internal server error. Our team has been notified',
                )
              }
            />
          </View>
        </View>

        <View>
          <ThemedText type="h3" color="text-100" className="mb-3">
            Toast Timing
          </ThemedText>

          <View className="gap-3">
            <ThemedGradientButton
              label="Quick Toast (1s)"
              type="secondary"
              onPress={() => {
                Toast.show({
                  type: 'success',
                  text1: 'Quick Message',
                  text2: 'This will disappear in 1 second',
                  visibilityTime: 1000,
                })
              }}
            />

            <ThemedGradientButton
              label="Long Toast (5s)"
              type="secondary"
              onPress={() => {
                Toast.show({
                  type: 'error',
                  text1: 'Important Notice',
                  text2: 'This message will stay for 5 seconds',
                  visibilityTime: 5000,
                })
              }}
            />
          </View>
        </View>

        <View>
          <ThemedText type="h3" color="text-100" className="mb-3">
            Multiple Toasts
          </ThemedText>

          <View className="gap-3">
            <ThemedGradientButton
              label="Show Sequential Toasts"
              type="custom"
              customGradientColors={[colors?.primaryGradientStart, colors?.primaryGradientEnd]}
              onPress={() => {
                showSuccessToast('Step 1', 'First operation completed')

                setTimeout(() => {
                  showSuccessToast('Step 2', 'Second operation completed')
                }, 1500)

                setTimeout(() => {
                  showSuccessToast('Complete', 'All operations finished')
                }, 3000)
              }}
            />

            <ThemedGradientButton
              label="Mixed Toast Types"
              type="custom"
              customGradientColors={[colors?.warning, colors?.warning]}
              onPress={() => {
                showSuccessToast('Success', 'First part completed')

                setTimeout(() => {
                  showErrorToast('Warning', 'Second part had issues')
                }, 2000)
              }}
            />
          </View>
        </View>

        <View className="h-[100px]" />
      </ScrollView>

      <Toast config={toastConfig} />
    </View>
  )
}

const meta: Meta<typeof ToastConfigDemo> = {
  title: 'Components/ToastConfig',
  component: ToastConfigDemo,
  parameters: {
    docs: {
      description: {
        component:
          'A hook that provides themed toast configuration for success and error messages with consistent styling.',
      },
    },
  },
  decorators: [
    Story => {
      return (
        <View className="flex-1 bg-background-primary">
          <Story />
        </View>
      )
    },
  ],
}

export default meta

type Story = StoryObj<typeof ToastConfigDemo>

export const BasicUsage: Story = {
  render: () => <ToastConfigDemo />,
}

export const SuccessToasts: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const toastConfig = useToastConfig()

    const examples = [
      { title: 'Simple Success', message: 'Task completed' },
      { title: 'Data Saved', message: 'Your changes have been saved successfully' },
      { title: 'Upload Complete', message: 'File uploaded and processed successfully' },
      {
        title: 'Settings Updated',
        message: 'Your preferences have been updated and will take effect immediately',
      },
    ]

    return (
      <View className="flex-1 p-4">
        <ThemedText type="h2" color="text-100" className="mb-4">
          Success Toast Examples
        </ThemedText>

        <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
          {examples.map((example, index) => (
            <ThemedGradientButton
              key={index}
              label={example.title}
              type="custom"
              customGradientColors={[colors?.success, colors?.success]}
              onPress={() => {
                Toast.show({
                  type: 'success',
                  text1: example.title,
                  text2: example.message,
                })
              }}
            />
          ))}
        </ScrollView>

        <Toast config={toastConfig} />
      </View>
    )
  },
}

export const ErrorToasts: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const toastConfig = useToastConfig()

    const examples = [
      { title: 'Network Error', message: 'Unable to connect to server' },
      { title: 'Validation Error', message: 'Please check your input and try again' },
      { title: 'Permission Denied', message: 'You do not have permission to perform this action' },
      { title: 'Server Timeout', message: 'Request timed out. Please try again later' },
    ]

    return (
      <View className="flex-1 p-4">
        <ThemedText type="h2" color="text-100" className="mb-4">
          Error Toast Examples
        </ThemedText>

        <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
          {examples.map((example, index) => (
            <ThemedGradientButton
              key={index}
              label={example.title}
              type="custom"
              customGradientColors={[colors?.error, colors?.error]}
              onPress={() => {
                Toast.show({
                  type: 'error',
                  text1: example.title,
                  text2: example.message,
                })
              }}
            />
          ))}
        </ScrollView>

        <Toast config={toastConfig} />
      </View>
    )
  },
}

export const ConfigurationShowcase: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const toastConfig = useToastConfig()

    return (
      <View className="flex-1 p-4">
        <ThemedText type="h2" color="text-100" className="mb-2">
          Toast Configuration
        </ThemedText>
        <ThemedText type="body2" color="text-70" className="mb-6">
          Demonstrates the themed styling and configuration options
        </ThemedText>

        <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
          <View>
            <ThemedText type="h4" color="text-100" className="mb-2">
              Standard Configuration
            </ThemedText>
            <ThemedText type="body3" color="text-70" className="mb-3">
              • 70px height, 12px border radius • Theme-based background and text colors • Font
              scaling disabled for consistency • 2-line text support
            </ThemedText>
            <ThemedGradientButton
              label="Show Standard Toast"
              type="primary"
              onPress={() => {
                Toast.show({
                  type: 'success',
                  text1: 'Standard Configuration',
                  text2: 'This uses the default toast styling with theme colors',
                })
              }}
            />
          </View>

          <View>
            <ThemedText type="h4" color="text-100" className="mb-2">
              Long Text Handling
            </ThemedText>
            <ThemedText type="body3" color="text-70" className="mb-3">
              Text automatically wraps to 2 lines maximum
            </ThemedText>
            <ThemedGradientButton
              label="Show Long Text"
              type="secondary"
              onPress={() => {
                Toast.show({
                  type: 'error',
                  text1: 'Very Long Title That Might Wrap',
                  text2:
                    'This is a very long message that demonstrates how the toast handles text that exceeds the normal length and might need to wrap to multiple lines',
                })
              }}
            />
          </View>

          <View>
            <ThemedText type="h4" color="text-100" className="mb-2">
              Custom Positioning
            </ThemedText>
            <ThemedText type="body3" color="text-70" className="mb-3">
              20px top margin with device-width responsive sizing
            </ThemedText>
            <ThemedGradientButton
              label="Show Positioned Toast"
              type="custom"
              customGradientColors={[colors?.primaryGradientStart, colors?.secondaryGradientEnd]}
              onPress={() => {
                Toast.show({
                  type: 'success',
                  text1: 'Positioned Toast',
                  text2: 'Notice the consistent positioning and sizing',
                  position: 'top',
                })
              }}
            />
          </View>
        </ScrollView>

        <Toast config={toastConfig} />
      </View>
    )
  },
}

import Instagram from '@/assets/icons/instagram.svg'
import Tiktok from '@/assets/icons/tiktok.svg'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { Meta, StoryObj } from '@storybook/react-native'
import React, { ComponentProps, ComponentType, useState } from 'react'
import { Alert, ScrollView, View } from 'react-native'

import { ProfileItem } from '@/components/common/ProfileItem'
import { SvgProps } from 'react-native-svg'

interface MenuItem {
  id: string
  label: string
  leftIcon?: IconName
  customLeftIcon?: ComponentType<SvgProps>
  rightIcon?: boolean
  danger?: boolean
  isLastItem?: boolean
  onPress: () => void
}

type IconName = keyof typeof MaterialCommunityIcons.glyphMap

const meta: Meta<typeof ProfileItem> = {
  title: 'Components/ProfileItem',
  component: ProfileItem,
  parameters: {
    docs: {
      description: {
        component:
          'Profile menu item component with customizable icons, labels, and actions for user profile screens.',
      },
    },
  },
  decorators: [
    Story => (
      <View className="flex-1 bg-background-primary p-4">
        <Story />
      </View>
    ),
  ],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Item label text',
    },
    leftIcon: {
      control: { type: 'select' },
      options: ['account', 'settings', 'security', 'help-circle', 'logout'],
      description: 'Material Community Icons name for left icon',
    },
    customLeftIcon: {
      control: { type: 'select' },
      options: ['account', 'settings', 'security', 'help-circle', 'logout'],
      description: 'Custom icon component for left icon',
    },
    rightIcon: {
      control: { type: 'boolean' },
      description: 'Show right arrow icon',
    },
    danger: {
      control: { type: 'boolean' },
      description: 'Apply danger styling (red color)',
    },
    isLastItem: {
      control: { type: 'boolean' },
      description: 'Hide bottom separator for last item',
    },
    testID: {
      control: { type: 'text' },
      description: 'Test identifier',
    },
  },
}

export default meta

type Story = StoryObj<typeof ProfileItem>

export const Default: Story = {
  args: {
    label: 'Account',
    leftIcon: 'account-outline' as IconName,
    isLastItem: true,
    onPress: () => Alert.alert('Pressed', 'Account clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic profile item with Material Community Icons.',
      },
    },
  },
}

export const WithCustomIcon: Story = {
  args: {
    label: 'Custom Instagram',
    customLeftIcon: Instagram,
    rightIcon: false,
    isLastItem: true,
    onPress: () => Alert.alert('Custom', 'Custom icon item pressed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile item with custom SVG icon component.',
      },
    },
  },
}

export const NoRightIcon: Story = {
  args: {
    label: 'Notifications',
    leftIcon: 'bell-outline' as IconName,
    rightIcon: false,
    isLastItem: true,
    onPress: () => Alert.alert('Pressed', 'Notifications clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile item without right arrow icon.',
      },
    },
  },
}

export const Danger: Story = {
  args: {
    label: 'Delete Account',
    leftIcon: 'delete-outline' as IconName,
    danger: true,
    isLastItem: true,
    onPress: () => Alert.alert('Danger', 'Delete Account clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile item with danger styling (red color).',
      },
    },
  },
}

export const LastItem: Story = {
  args: {
    label: 'Logout',
    leftIcon: 'logout' as IconName,
    isLastItem: true,
    danger: true,
    onPress: () => Alert.alert('Logout', 'User logged out'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Last profile item without bottom separator.',
      },
    },
  },
}

export const LongLabel: Story = {
  args: {
    label: 'This is a very long profile item label that should be handled properly',
    leftIcon: 'information-outline' as IconName,
    isLastItem: true,
    onPress: () => Alert.alert('Pressed', 'Long label item clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile item with long label text.',
      },
    },
  },
}

export const ProfileMenuList: Story = {
  render: () => {
    const menuItems: MenuItem[] = [
      {
        id: '1',
        label: 'Edit Profile',
        leftIcon: 'account-edit-outline' as IconName,
        onPress: () => Alert.alert('Profile', 'Edit Profile clicked'),
      },
      {
        id: '2',
        label: 'Tiktok',
        customLeftIcon: Tiktok,
        rightIcon: false,
        onPress: () => Alert.alert('Settings', 'Settings clicked'),
      },
      {
        id: '3',
        label: 'Privacy & Security',
        leftIcon: 'shield-account-outline' as IconName,
        onPress: () => Alert.alert('Privacy', 'Privacy & Security clicked'),
      },
      {
        id: '4',
        label: 'Notifications',
        leftIcon: 'bell-outline' as IconName,
        onPress: () => Alert.alert('Notifications', 'Notifications clicked'),
      },
      {
        id: '5',
        label: 'Help & Support',
        leftIcon: 'help-circle-outline' as IconName,
        onPress: () => Alert.alert('Help', 'Help & Support clicked'),
      },
      {
        id: '6',
        label: 'About',
        leftIcon: 'information-outline' as IconName,
        onPress: () => Alert.alert('About', 'About clicked'),
      },
      {
        id: '7',
        label: 'Logout',
        leftIcon: 'logout' as IconName,
        danger: true,
        isLastItem: true,
        onPress: () => Alert.alert('Logout', 'User logged out'),
      },
    ]

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-background-secondary rounded-xl overflow-hidden">
          {menuItems.map((item, index) => {
            const props: ComponentProps<typeof ProfileItem> = {
              label: item.label,
              onPress: item.onPress,
              testID: `profile-item-${index}`,
            }

            if (item.leftIcon !== undefined) {
              props.leftIcon = item.leftIcon
            }
            if (item.customLeftIcon !== undefined) {
              props.customLeftIcon = item.customLeftIcon
            }
            if (item.danger !== undefined) {
              props.danger = item.danger
            }
            if (item.isLastItem !== undefined) {
              props.isLastItem = item.isLastItem
            }
            if (item.rightIcon !== undefined) {
              props.rightIcon = item.rightIcon
            }

            return <ProfileItem key={item.id} {...props} />
          })}
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete profile menu with multiple items including regular and danger items.',
      },
    },
  },
}

export const AllStates: Story = {
  render: () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-4">
        <View className="bg-background-secondary rounded-xl overflow-hidden">
          <ProfileItem
            label="Normal Item"
            leftIcon={'star-outline' as IconName}
            onPress={() => Alert.alert('Normal', 'Normal item pressed')}
          />
          <ProfileItem
            label="Custom Tiktok"
            customLeftIcon={Tiktok}
            rightIcon={false}
            onPress={() => Alert.alert('Custom', 'Custom icon item pressed')}
          />
          <ProfileItem
            label="Without Right Icon"
            leftIcon={'cog-outline' as IconName}
            rightIcon={false}
            isLastItem={true}
            onPress={() => Alert.alert('No Right', 'No right icon item pressed')}
          />
        </View>

        <View className="bg-background-secondary rounded-xl overflow-hidden">
          <ProfileItem
            label="Danger Item"
            leftIcon={'alert-outline' as IconName}
            danger={true}
            onPress={() => Alert.alert('Danger', 'Danger item pressed')}
          />
          <ProfileItem
            label="Delete Account"
            leftIcon={'delete-outline' as IconName}
            danger={true}
            isLastItem={true}
            onPress={() => Alert.alert('Delete', 'Delete account pressed')}
          />
        </View>

        <View className="bg-background-primary rounded-xl overflow-hidden">
          <ProfileItem
            label="Very Long Item Label That Tests Text Wrapping"
            leftIcon={'information-outline' as IconName}
            isLastItem={true}
            onPress={() => Alert.alert('Long', 'Long label item pressed')}
          />
        </View>
      </View>
    </ScrollView>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All possible states and variations of the profile item component.',
      },
    },
  },
}

export const InteractiveStates: Story = {
  render: () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true)
    const [darkMode, setDarkMode] = useState<boolean>(false)

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-background-secondary rounded-xl overflow-hidden my-4">
          <ProfileItem
            label={`Notifications ${notificationsEnabled ? 'On' : 'Off'}`}
            leftIcon={
              notificationsEnabled ? ('bell-outline' as IconName) : ('bell-off-outline' as IconName)
            }
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          <ProfileItem
            label={`Theme: ${darkMode ? 'Dark' : 'Light'}`}
            leftIcon={darkMode ? ('weather-night' as IconName) : ('weather-sunny' as IconName)}
            onPress={() => setDarkMode(!darkMode)}
          />
          <ProfileItem
            label="Reset Settings"
            leftIcon={'restore' as IconName}
            onPress={() => {
              setNotificationsEnabled(true)
              setDarkMode(false)
              Alert.alert('Reset', 'Settings have been reset')
            }}
            isLastItem={true}
          />
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive profile items with state changes and dynamic labels.',
      },
    },
  },
}

export const ErrorHandling: Story = {
  render: () => (
    <View className="bg-background-primary rounded-xl overflow-hidden">
      <ProfileItem
        label="Error Test Item"
        leftIcon={'bug-outline' as IconName}
        onPress={() => {
          try {
            throw new Error('Test error')
          } catch (error) {
            Alert.alert('Error', 'Something went wrong!')
          }
        }}
        isLastItem={true}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Profile item with error handling in onPress action.',
      },
    },
  },
}

export const Playground: Story = {
  args: {
    label: 'Playground Item',
    leftIcon: 'account-outline' as IconName,
    rightIcon: true,
    danger: false,
    isLastItem: true,
    testID: 'playground-profile-item',
    onPress: () => Alert.alert('Playground', 'Playground item clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all props and configurations.',
      },
    },
  },
}

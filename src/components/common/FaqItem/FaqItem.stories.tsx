import type { Meta, StoryObj } from '@storybook/react-native'
import { ComponentProps, useState } from 'react'
import { View } from 'react-native'

import { FaqItem } from '@/components/common/FaqItem'
import type { FaqItemType } from '@/types/common/faq'

const mockedFaqItem: FaqItemType = {
  id: '1',
  title: 'How do I use the application?',
  description:
    'To use the application, you need to register first. After registration, you can access all features from the main page. You can update your personal information from the profile section and customize your preferences from the settings menu.',
}

const longMockedFaqItem: FaqItemType = {
  id: '2',
  title:
    'This is a very long title example - This title should be long enough to wrap to multiple lines',
  description:
    'This is a very long description text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
}

const shortFaqItem: FaqItemType = {
  id: '4',
  title: 'Short question?',
  description: 'Short answer.',
}

const meta: Meta<typeof FaqItem> = {
  title: 'Components/FaqItem',
  component: FaqItem,
  parameters: {
    docs: {
      description: {
        component:
          'Expandable item component for frequently asked questions. Works like an accordion.',
      },
    },
    controls: {
      exclude: ['toggleExpanded'],
    },
  },
  decorators: [
    Story => (
      <View className="p-4 bg-background-primary flex-1">
        <Story />
      </View>
    ),
  ],
  argTypes: {
    index: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
      description: 'The order number of the FAQ item',
    },
    isExpanded: {
      control: { type: 'boolean' },
      description: 'Expanded/collapsed state of the item',
    },
    item: {
      control: { type: 'object' },
      description: 'FAQ item data (id, title, description)',
    },
  },
}

export default meta

type Story = StoryObj<typeof FaqItem>

const InteractiveFaqItem = ({
  item,
  ...props
}: Omit<ComponentProps<typeof FaqItem>, 'isExpanded' | 'toggleExpanded'>) => {
  const [index, setIndex] = useState<number>(0)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const toggleExpanded = (_index: number) => {
    setIndex(_index)
    setIsExpanded(!isExpanded)
  }

  return (
    <FaqItem
      {...props}
      item={item}
      index={index}
      isExpanded={isExpanded}
      toggleExpanded={toggleExpanded}
    />
  )
}

export const Default: Story = {
  render: args => <InteractiveFaqItem {...args} />,
  args: {
    index: 0,
    item: mockedFaqItem,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic FAQ item. Click to expand or collapse.',
      },
    },
  },
}

export const Expanded: Story = {
  args: {
    index: 0,
    isExpanded: true,
    item: mockedFaqItem,
    toggleExpanded: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'FAQ item in expanded state. Shows how content appears when opened.',
      },
    },
  },
}

export const Collapsed: Story = {
  args: {
    index: 0,
    isExpanded: false,
    item: mockedFaqItem,
    toggleExpanded: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'FAQ item in collapsed state. Only title is visible.',
      },
    },
  },
}

export const ShortContent: Story = {
  render: args => <InteractiveFaqItem {...args} />,
  args: {
    index: 0,
    item: shortFaqItem,
  },
  parameters: {
    docs: {
      description: {
        story: 'FAQ item with minimal content to test layout with short text.',
      },
    },
  },
}

export const LongContent: Story = {
  render: args => <InteractiveFaqItem {...args} />,
  args: {
    index: 0,
    item: longMockedFaqItem,
  },
  parameters: {
    docs: {
      description: {
        story: 'FAQ item with long content to test text wrapping and layout.',
      },
    },
  },
}

export const MultipleItems: Story = {
  render: () => {
    const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({})

    const toggleExpanded = (index: number) => {
      setExpandedItems(prev => ({
        ...prev,
        [index]: !prev[index],
      }))
    }

    const items = [
      mockedFaqItem,
      longMockedFaqItem,
      {
        id: '3',
        title: 'How do I delete my account?',
        description:
          'To delete your account, go to the settings menu and click on "Delete Account" option.',
      },
      shortFaqItem,
    ]

    return (
      <View>
        {items.map((item, index) => (
          <FaqItem
            key={item.id}
            index={index}
            item={item}
            isExpanded={expandedItems[index] || false}
            toggleExpanded={toggleExpanded}
          />
        ))}
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple FAQ items working together. Test accordion behavior with multiple items.',
      },
    },
  },
}

export const Playground: Story = {
  render: args => <InteractiveFaqItem {...args} />,
  args: {
    index: 0,
    item: mockedFaqItem,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all props and configurations.',
      },
    },
  },
}

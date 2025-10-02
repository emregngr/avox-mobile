import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { Tabs } from 'react-native-collapsible-tab-view'

import { RenderDetailTabBar } from '@/components/common/RenderDetailTabBar'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const TabContent = ({ title, content }: { title: string; content: string }) => (
  <View className="flex-1 p-4 items-center justify-center">
    <ThemedText color="text-100" type="h3" className="mb-4">
      {title}
    </ThemedText>
    <ThemedText color="text-70" type="body1" center>
      {content}
    </ThemedText>
  </View>
)

const AirportTabsDemo = ({ indicatorColor = 'primary100' }: { indicatorColor?: string }) => {
  const { selectedTheme } = useThemeStore()
  const colors = themeColors?.[selectedTheme]

  const [activeIndex, setActiveIndex] = useState<number>(0)

  return (
    <View className="flex-1 bg-background-primary">
      <Tabs.Container
        renderHeader={() => null}
        renderTabBar={props => (
          <RenderDetailTabBar
            activeIndex={activeIndex}
            indicatorBackgroundColor={indicatorColor}
            props={props}
            tabType="airport"
          />
        )}
        onIndexChange={setActiveIndex}
        headerContainerStyle={{
          backgroundColor: colors?.background?.primary,
          elevation: 0,
          shadowOpacity: 0,
        }}
      >
        <Tabs.Tab name="General">
          <Tabs.ScrollView>
            <TabContent
              title="General Information"
              content="Basic airport details, location, and general information about the airport facilities and services."
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Infrastructure">
          <Tabs.ScrollView>
            <TabContent
              title="Infrastructure"
              content="Runways, terminals, gates, and other infrastructure details of the airport."
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Flights">
          <Tabs.ScrollView>
            <TabContent
              title="Airport Flights"
              content="Flight schedules, departures, arrivals, and airline information for this airport."
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Nearby">
          <Tabs.ScrollView>
            <TabContent
              title="Nearby Places"
              content="Hotels, restaurants, attractions, and other points of interest near the airport."
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  )
}

const AirlineTabsDemo = ({ indicatorColor = 'primary100' }: { indicatorColor?: string }) => {
  const { selectedTheme } = useThemeStore()
  const colors = themeColors?.[selectedTheme]

  const [activeIndex, setActiveIndex] = useState<number>(0)

  return (
    <View className="flex-1 bg-background-primary">
      <Tabs.Container
        renderHeader={() => null}
        renderTabBar={props => (
          <RenderDetailTabBar
            activeIndex={activeIndex}
            indicatorBackgroundColor={indicatorColor}
            props={props}
            tabType="airline"
          />
        )}
        onIndexChange={setActiveIndex}
        headerContainerStyle={{
          backgroundColor: colors?.background?.primary,
          elevation: 0,
          shadowOpacity: 0,
        }}
      >
        <Tabs.Tab name="Company">
          <Tabs.ScrollView>
            <TabContent
              title="Company Information"
              content="Airline company details, history, headquarters, and corporate information."
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Fleet">
          <Tabs.ScrollView>
            <TabContent
              title="Fleet Details"
              content="Aircraft types, fleet size, age, and technical specifications of the airline's fleet."
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Flights">
          <Tabs.ScrollView>
            <TabContent
              title="Airline Flights"
              content="Route network, flight schedules, destinations, and booking information."
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Safety">
          <Tabs.ScrollView>
            <TabContent
              title="Safety & Environment"
              content="Safety records, environmental initiatives, and sustainability practices."
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  )
}

const meta: Meta<typeof RenderDetailTabBar> = {
  title: 'Components/RenderDetailTabBar',
  component: RenderDetailTabBar,
  parameters: {
    docs: {
      description: {
        component:
          'Customizable tab bar component using react-native-collapsible-tab-view for detail screens with material design indicators and themed styling. Supports airport and airline tab types with responsive layout.',
      },
    },
  },
  decorators: [
    Story => (
      <View className="flex-1 bg-background-primary pt-5">
        <Story />
      </View>
    ),
  ],
  argTypes: {
    activeIndex: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Currently active tab index',
    },
    indicatorBackgroundColor: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
      description: 'Color key from theme colors for tab indicator',
    },
    tabType: {
      control: { type: 'select' },
      options: ['airport', 'airline'],
      description: 'Type of tab configuration (affects testIDs and layout)',
    },
  },
}

export default meta

type Story = StoryObj<typeof AirportTabsDemo>

export const AirportTabs: Story = {
  render: () => <AirportTabsDemo indicatorColor="primary100" />,
  parameters: {
    docs: {
      description: {
        story: 'Airport detail tabs with General, Infrastructure, Flights, and Nearby sections.',
      },
    },
  },
}

export const AirlineTabs: Story = {
  render: () => <AirlineTabsDemo indicatorColor="primary100" />,
  parameters: {
    docs: {
      description: {
        story: 'Airline detail tabs with Company, Fleet, Flights, and Safety sections.',
      },
    },
  },
}

export const IndicatorColors: Story = {
  render: () => (
    <ScrollView className="flex-1 gap-4 pb-5" showsVerticalScrollIndicator={false}>
      <View className="h-96">
        <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
          Primary Indicator
        </ThemedText>
        <AirportTabsDemo indicatorColor="primary100" />
      </View>

      <View className="h-96">
        <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
          Secondary Indicator
        </ThemedText>
        <AirportTabsDemo indicatorColor="secondary100" />
      </View>

      <View className="h-96">
        <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
          Success Indicator
        </ThemedText>
        <AirportTabsDemo indicatorColor="success" />
      </View>

      <View className="h-96">
        <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
          Warning Indicator
        </ThemedText>
        <AirportTabsDemo indicatorColor="warning" />
      </View>

      <View className="h-96">
        <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
          Error Indicator
        </ThemedText>
        <AirportTabsDemo indicatorColor="error" />
      </View>
    </ScrollView>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different indicator color variants using theme colors.',
      },
    },
  },
}

export const TabStates: Story = {
  render: () => {
    return (
      <ScrollView className="flex-1 gap-4 pb-5" showsVerticalScrollIndicator={false}>
        <View className="h-96">
          <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
            Airport Tabs
          </ThemedText>
          <AirportTabsDemo indicatorColor="primary100" />
        </View>

        <View className="h-96">
          <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
            Airline Tabs
          </ThemedText>
          <AirlineTabsDemo indicatorColor="warning" />
        </View>

        <View className="p-4 bg-background-secondary rounded-xl mx-4">
          <ThemedText color="text-100" type="body1" className="mb-3">
            Tab States:
          </ThemedText>
          <ThemedText color="text-70" type="body2">
            • Active tabs have full opacity text (text-100){'\n'}• Inactive tabs have reduced
            opacity (text-70){'\n'}• Indicator follows the active tab with smooth animation{'\n'}•
            Ripple effect on touch with themed colors{'\n'}• Height: 36px with rounded corners
            {'\n'}• Background: tertiary color
          </ThemedText>
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Different active states and tab type configurations.',
      },
    },
  },
}

export const ResponsiveLayout: Story = {
  render: () => (
    <View className="flex-1">
      <View className="h-80 mb-5">
        <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
          Standard Layout
        </ThemedText>
        <AirportTabsDemo indicatorColor="primary100" />
      </View>

      <View className="p-4 bg-background-secondary rounded-xl mx-4 mt-5">
        <ThemedText color="text-100" type="body1" className="mb-3">
          Responsive Features:
        </ThemedText>
        <ThemedText color="text-70" type="body2">
          • Total width: Device width - 32px margin{'\n'}• Each tab: Device width / 4 - 8px spacing
          {'\n'}• Fixed height: 36px for consistent layout{'\n'}• Border radius: 12px for rounded
          corners{'\n'}• Vertical margin: 16px top and bottom{'\n'}• Self-centered alignment{'\n'}•
          Adapts to different screen sizes automatically
        </ThemedText>
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive layout that adapts to different screen sizes.',
      },
    },
  },
}

export const TestIdsAndAccessibility: Story = {
  render: () => (
    <ScrollView className="flex-1 pb-5" showsVerticalScrollIndicator={false}>
      <View className="h-80 mb-8">
        <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
          Airport Tab Test IDs
        </ThemedText>
        <AirportTabsDemo indicatorColor="primary100" />

        <View className="p-4 bg-background-secondary rounded-lg mx-4 mt-4">
          <ThemedText color="success" type="body1" className="mb-2">
            Airport Test IDs:
          </ThemedText>
          <ThemedText color="text-70" type="body2">
            • general-tab{'\n'}• infrastructure-tab{'\n'}• airportFlight-tab{'\n'}• nearbyPlaces-tab
          </ThemedText>
        </View>
      </View>

      <View className="h-80">
        <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
          Airline Tab Test IDs
        </ThemedText>
        <AirlineTabsDemo indicatorColor="secondary100" />

        <View className="p-4 bg-background-secondary rounded-lg mx-4 mt-4">
          <ThemedText color="warning" type="body1" className="mb-2">
            Airline Test IDs:
          </ThemedText>
          <ThemedText color="text-70" type="body2">
            • company-tab{'\n'}• fleet-tab{'\n'}• airlineFlight-tab{'\n'}• safetyEnv-tab
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Test identifiers and accessibility features for automated testing.',
      },
    },
  },
}

export const InteractiveDemo: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]

    const [tabType, setTabType] = useState<'airport' | 'airline'>('airport')
    const [indicatorColor, setIndicatorColor] = useState<string>('primary100')

    return (
      <ScrollView className="flex-1 pb-5" showsVerticalScrollIndicator={false}>
        <View className="p-4 bg-background-secondary rounded-xl mx-4 mb-5">
          <ThemedText color="text-100" type="h4" className="mb-4">
            Interactive Controls
          </ThemedText>

          <View className="mb-4">
            <ThemedText color="text-90" type="body2" className="mb-2">
              Tab Type:
            </ThemedText>
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.7}
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor:
                    tabType === 'airport' ? colors?.success : colors?.background?.tertiary,
                }}
                onPress={() => setTabType('airport')}
              >
                <ThemedText color={tabType === 'airport' ? 'text-100' : 'text-70'} type="body2">
                  Airport
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor:
                    tabType === 'airline' ? colors?.success : colors?.background?.tertiary,
                }}
                onPress={() => setTabType('airline')}
              >
                <ThemedText color={tabType === 'airline' ? 'text-100' : 'text-70'} type="body2">
                  Airline
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <ThemedText color="text-90" type="body2" className="mb-2">
              Indicator Color:
            </ThemedText>
            <View className="flex-row gap-2 flex-wrap">
              {['primary100', 'secondary100', 'success', 'warning', 'error'].map(color => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={color}
                  className="px-3 py-1.5 rounded-md"
                  style={{
                    backgroundColor:
                      indicatorColor === color ? colors?.success : colors?.background?.tertiary,
                  }}
                  onPress={() => setIndicatorColor(color)}
                >
                  <ThemedText
                    color={indicatorColor === color ? 'text-100' : 'text-70'}
                    type="body2"
                  >
                    {color}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View className="h-96">
          {tabType === 'airport' ? (
            <AirportTabsDemo indicatorColor={indicatorColor} />
          ) : (
            <AirlineTabsDemo indicatorColor={indicatorColor} />
          )}
        </View>

        <View className="p-4 bg-background-secondary rounded-xl mx-4 mt-5">
          <ThemedText color="text-100" type="body1" className="mb-2">
            Current Configuration:
          </ThemedText>
          <ThemedText color="text-70" type="body2">
            Tab Type: {tabType}
            {'\n'}
            Indicator Color: {indicatorColor}
            {'\n'}
            Component: RenderDetailTabBar
          </ThemedText>
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component configurations and states.',
      },
    },
  },
}

export const CollapsibleFeatures: Story = {
  render: () => (
    <View className="flex-1">
      <View className="p-4 bg-background-secondary rounded-xl mx-4 mb-5">
        <ThemedText color="text-100" type="h4" className="mb-3">
          Collapsible Tab View Features
        </ThemedText>
        <ThemedText color="text-70" type="body2">
          • Built with react-native-collapsible-tab-view{'\n'}• MaterialTabBar with MaterialTabItem
          components{'\n'}• Smooth tab switching animations{'\n'}• Android ripple effect support
          {'\n'}• Custom label rendering with ThemedText{'\n'}• Responsive width calculations{'\n'}•
          Press opacity set to 1 for better UX{'\n'}• Z-index management for proper layering
        </ThemedText>
      </View>

      <View className="h-80">
        <AirportTabsDemo indicatorColor="primary100" />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Component features and integration with react-native-collapsible-tab-view library.',
      },
    },
  },
}

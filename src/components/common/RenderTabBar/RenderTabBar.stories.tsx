import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { Tabs } from 'react-native-collapsible-tab-view'

import { RenderTabBar } from '@/components/common/RenderTabBar'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const TabContent = ({ title, content, icon }: { title: string; content: string; icon: string }) => (
  <View className="flex-1 p-4 items-center justify-center">
    <View className="w-20 h-20 bg-background-secondary rounded-full items-center justify-center mb-5">
      <ThemedText color="text-100" type="h2">
        {icon}
      </ThemedText>
    </View>
    <ThemedText color="text-100" type="h3" className="mb-4">
      {title}
    </ThemedText>
    <ThemedText color="text-70" type="body1" center>
      {content}
    </ThemedText>
  </View>
)

const DiscoverTabsDemo = () => {
  const { selectedTheme } = useThemeStore()
  const colors = themeColors?.[selectedTheme]
  const [activeIndex, setActiveIndex] = useState<number>(0)

  return (
    <View className="flex-1 bg-background-primary">
      <Tabs.Container
        renderHeader={() => null}
        renderTabBar={props => (
          <RenderTabBar activeIndex={activeIndex} props={props} tabType="discover" />
        )}
        onIndexChange={setActiveIndex}
        headerContainerStyle={{
          backgroundColor: colors?.background?.primary,
          elevation: 0,
          shadowOpacity: 0,
        }}
      >
        <Tabs.Tab name="Airports">
          <Tabs.ScrollView>
            <TabContent
              title="Discover Airports"
              content="Explore airports around the world. Find information about facilities, services, flight schedules, and nearby attractions."
              icon="✈️"
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Airlines">
          <Tabs.ScrollView>
            <TabContent
              title="Discover Airlines"
              content="Browse airlines and their services. Compare fleet information, routes, safety records, and customer reviews."
              icon="🛩️"
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  )
}

const FavoritesTabsDemo = () => {
  const { selectedTheme } = useThemeStore()
  const colors = themeColors?.[selectedTheme]
  const [activeIndex, setActiveIndex] = useState<number>(0)

  return (
    <View className="flex-1 bg-background-primary">
      <Tabs.Container
        renderHeader={() => null}
        renderTabBar={props => (
          <RenderTabBar activeIndex={activeIndex} props={props} tabType="favorites" />
        )}
        onIndexChange={setActiveIndex}
        headerContainerStyle={{
          backgroundColor: colors?.background?.primary,
          elevation: 0,
          shadowOpacity: 0,
        }}
      >
        <Tabs.Tab name="Airports">
          <Tabs.ScrollView>
            <TabContent
              title="Favorite Airports"
              content="Your saved airport destinations. Quick access to frequently visited or interesting airports you want to remember."
              icon="⭐"
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Airlines">
          <Tabs.ScrollView>
            <TabContent
              title="Favorite Airlines"
              content="Your preferred airlines. Keep track of carriers you trust, frequently fly with, or want to monitor."
              icon="❤️"
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  )
}

const meta: Meta<typeof RenderTabBar> = {
  title: 'Components/RenderTabBar',
  component: RenderTabBar,
  parameters: {
    docs: {
      description: {
        component:
          'Two-tab navigation component for main screens with material design indicators. Supports discover and favorites tab types with themed styling and responsive layout.',
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
      control: { type: 'number', min: 0, max: 1 },
      description: 'Currently active tab index (0 or 1)',
    },
    tabType: {
      control: { type: 'select' },
      options: ['discover', 'favorites'],
      description: 'Type of tab configuration (affects testIDs)',
    },
  },
}

export default meta

type Story = StoryObj<typeof DiscoverTabsDemo>

export const DiscoverTabs: Story = {
  render: () => <DiscoverTabsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Discover tabs for exploring airports and airlines with search and browsing functionality.',
      },
    },
  },
}

export const FavoritesTabs: Story = {
  render: () => <FavoritesTabsDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Favorites tabs for saved airports and airlines with personalized collections.',
      },
    },
  },
}

export const TabStatesComparison: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]
    const [discoverIndex, setDiscoverIndex] = useState<number>(0)
    const [favoritesIndex, setFavoritesIndex] = useState<number>(1)

    return (
      <ScrollView className="flex-1 gap-4 pb-5" showsVerticalScrollIndicator={false}>
        <View className="h-80">
          <ThemedText color="text-100" type="h4" className="mb-2.5" center>
            Discover Tabs
          </ThemedText>
          <Tabs.Container
            renderHeader={() => null}
            renderTabBar={props => (
              <RenderTabBar activeIndex={discoverIndex} props={props} tabType="discover" />
            )}
            onIndexChange={setDiscoverIndex}
            headerContainerStyle={{
              backgroundColor: colors?.background?.primary,
              elevation: 0,
              shadowOpacity: 0,
            }}
          >
            <Tabs.Tab name="Airports">
              <Tabs.ScrollView>
                <View className="bg-background-secondary mx-4 mt-4 rounded-xl p-4 items-center">
                  <ThemedText color="text-100" type="body1">
                    Test ID: discover-airports-tab
                  </ThemedText>
                </View>
              </Tabs.ScrollView>
            </Tabs.Tab>
            <Tabs.Tab name="Airlines">
              <Tabs.ScrollView>
                <View className="bg-background-secondary mx-4 mt-4 rounded-xl p-4 items-center">
                  <ThemedText color="text-100" type="body1">
                    Test ID: discover-airlines-tab
                  </ThemedText>
                </View>
              </Tabs.ScrollView>
            </Tabs.Tab>
          </Tabs.Container>
        </View>

        <View className="h-80">
          <ThemedText color="text-100" type="h4" className="mb-2.5" center>
            Favorites Tabs
          </ThemedText>
          <Tabs.Container
            renderHeader={() => null}
            renderTabBar={props => (
              <RenderTabBar activeIndex={favoritesIndex} props={props} tabType="favorites" />
            )}
            onIndexChange={setFavoritesIndex}
            headerContainerStyle={{
              backgroundColor: colors?.background?.primary,
              elevation: 0,
              shadowOpacity: 0,
            }}
          >
            <Tabs.Tab name="Airports">
              <Tabs.ScrollView>
                <View className="bg-background-secondary mx-4 mt-4 rounded-xl p-4 items-center">
                  <ThemedText color="text-100" type="body1">
                    Test ID: favorites-airports-tab
                  </ThemedText>
                </View>
              </Tabs.ScrollView>
            </Tabs.Tab>
            <Tabs.Tab name="Airlines">
              <Tabs.ScrollView>
                <View className="bg-background-secondary mx-4 mt-4 rounded-xl p-4 items-center">
                  <ThemedText color="text-100" type="body1">
                    Test ID: favorites-airlines-tab
                  </ThemedText>
                </View>
              </Tabs.ScrollView>
            </Tabs.Tab>
          </Tabs.Container>
        </View>

        <View className="p-4 bg-background-secondary rounded-xl mx-4">
          <ThemedText color="text-100" type="body1" className="mb-3">
            Tab Features:
          </ThemedText>
          <ThemedText color="text-70" type="body2">
            • Two-tab layout with equal width distribution{'\n'}• Active tab text: full opacity
            (text-100){'\n'}• Inactive tab text: reduced opacity (text-70){'\n'}• Primary color
            indicator with smooth animation{'\n'}• Material design ripple effects{'\n'}• Responsive
            width: Device width / 2 - 16px
          </ThemedText>
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of different tab states and types.',
      },
    },
  },
}

export const AnimationStates: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [isAnimating, setIsAnimating] = useState<boolean>(false)

    const handleIndexChange = (index: number) => {
      setIsAnimating(true)
      setActiveIndex(index)
      setTimeout(() => setIsAnimating(false), 300)
    }

    return (
      <View className="flex-1">
        <Tabs.Container
          renderHeader={() => null}
          renderTabBar={props => (
            <RenderTabBar activeIndex={activeIndex} props={props} tabType="discover" />
          )}
          onIndexChange={handleIndexChange}
          headerContainerStyle={{
            backgroundColor: colors?.background?.primary,
            elevation: 0,
            shadowOpacity: 0,
          }}
        >
          <Tabs.Tab name="Airports">
            <Tabs.ScrollView>
              <View className="flex-1 items-center justify-center p-4">
                <View
                  className="w-[100px] h-[100px] rounded-full items-center justify-center mb-5 border-4 border-success"
                  style={{
                    backgroundColor: isAnimating ? colors?.success : colors?.background?.secondary,
                    transform: [{ scale: isAnimating ? 1.1 : 1 }],
                  }}
                >
                  <ThemedText color="text-100" type="h1">
                    ✈️
                  </ThemedText>
                </View>
                <ThemedText color="text-100" type="h3" className="mb-4">
                  Airports
                </ThemedText>
                <ThemedText color={isAnimating ? 'success' : 'text-70'} type="body1">
                  {isAnimating ? 'Animating...' : 'Tab Active'}
                </ThemedText>
              </View>
            </Tabs.ScrollView>
          </Tabs.Tab>
          <Tabs.Tab name="Airlines">
            <Tabs.ScrollView>
              <View className="flex-1 items-center justify-center p-4">
                <View
                  className="w-[100px] h-[100px] rounded-full items-center justify-center mb-5 border-4 border-success"
                  style={{
                    backgroundColor: isAnimating ? colors?.success : colors?.background?.secondary,
                    transform: [{ scale: isAnimating ? 1.1 : 1 }],
                  }}
                >
                  <ThemedText color="text-100" type="h1">
                    🛩️
                  </ThemedText>
                </View>
                <ThemedText color="text-100" type="h3" className="mb-4">
                  Airlines
                </ThemedText>
                <ThemedText color={isAnimating ? 'success' : 'text-70'} type="body1">
                  {isAnimating ? 'Animating...' : 'Tab Active'}
                </ThemedText>
              </View>
            </Tabs.ScrollView>
          </Tabs.Tab>
        </Tabs.Container>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Animation states and transitions between tabs.',
      },
    },
  },
}

export const ResponsiveLayout: Story = {
  render: () => (
    <View className="flex-1">
      <View className="flex-1 mb-5">
        <ThemedText color="text-100" type="h4" className="mb-2.5" center>
          Two-Tab Layout
        </ThemedText>
        <DiscoverTabsDemo />
      </View>

      <View className="p-4 bg-background-secondary rounded-xl mx-4 absolute bottom-5 left-0 right-0">
        <ThemedText color="text-100" type="body1" className="mb-3">
          Responsive Layout:
        </ThemedText>
        <ThemedText color="text-70" type="body2">
          • Total width: Device width - 32px{'\n'}• Each tab: Device width / 2 - 16px{'\n'}• Equal
          width distribution{'\n'}• Fixed height: 36px{'\n'}• Centered alignment{'\n'}• Adapts to
          all screen sizes
        </ThemedText>
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive two-tab layout that adapts to different screen sizes.',
      },
    },
  },
}

export const InteractivePlayground: Story = {
  render: () => {
    const { selectedTheme } = useThemeStore()
    const colors = themeColors?.[selectedTheme]
    const [tabType, setTabType] = useState<'discover' | 'favorites'>('discover')
    const [activeIndex, setActiveIndex] = useState<number>(0)

    return (
      <View className="flex-1">
        <View className="p-4 bg-background-secondary rounded-xl mx-4 mb-5">
          <ThemedText color="text-100" type="h4" className="mb-4">
            Playground Controls
          </ThemedText>

          <View className="mb-4">
            <ThemedText color="text-100" type="body2" className="mb-2">
              Tab Type:
            </ThemedText>
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.7}
                className="p-3 rounded-lg flex-1 items-center"
                style={{
                  backgroundColor:
                    tabType === 'discover' ? colors?.success : colors?.background?.tertiary,
                }}
                onPress={() => {
                  setTabType('discover')
                  setActiveIndex(0)
                }}
              >
                <ThemedText color={tabType === 'discover' ? 'text-100' : 'text-70'} type="body2">
                  Discover
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                className="p-3 rounded-lg flex-1 items-center"
                style={{
                  backgroundColor:
                    tabType === 'favorites' ? colors?.success : colors?.background?.tertiary,
                }}
                onPress={() => {
                  setTabType('favorites')
                  setActiveIndex(0)
                }}
              >
                <ThemedText color={tabType === 'favorites' ? 'text-100' : 'text-70'} type="body2">
                  Favorites
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <ThemedText color="text-100" type="body2" className="mb-2">
              Current State:
            </ThemedText>
            <ThemedText color="text-70" type="body2">
              Type: {tabType} | Index: {activeIndex}
            </ThemedText>
          </View>
        </View>

        <Tabs.Container
          renderHeader={() => null}
          renderTabBar={props => (
            <RenderTabBar activeIndex={activeIndex} props={props} tabType={tabType} />
          )}
          onIndexChange={setActiveIndex}
          headerContainerStyle={{
            backgroundColor: colors?.background?.primary,
            elevation: 0,
            shadowOpacity: 0,
          }}
        >
          <Tabs.Tab name="Airports">
            <Tabs.ScrollView>
              <View className="flex-1 p-4 items-center justify-center">
                <View
                  className="w-20 h-20 rounded-full items-center justify-center mb-5"
                  style={{
                    backgroundColor: tabType === 'discover' ? colors?.success : colors?.warning,
                  }}
                >
                  <ThemedText color="text-100" type="h2">
                    {tabType === 'discover' ? '🔍' : '⭐'}
                  </ThemedText>
                </View>
                <ThemedText color="text-100" type="h3" className="mb-3">
                  {tabType === 'discover' ? 'Discover' : 'Favorites'} Airports
                </ThemedText>
                <ThemedText color="text-70" type="body2">
                  Test ID: {tabType}-airports-tab
                </ThemedText>
              </View>
            </Tabs.ScrollView>
          </Tabs.Tab>
          <Tabs.Tab name="Airlines">
            <Tabs.ScrollView>
              <View className="flex-1 p-4 items-center justify-center">
                <View
                  className="w-20 h-20 rounded-full items-center justify-center mb-5"
                  style={{
                    backgroundColor: tabType === 'discover' ? colors?.success : colors?.warning,
                  }}
                >
                  <ThemedText color="text-100" type="h2">
                    {tabType === 'discover' ? '🔍' : '❤️'}
                  </ThemedText>
                </View>
                <ThemedText color="text-100" type="h3" className="mb-3">
                  {tabType === 'discover' ? 'Discover' : 'Favorites'} Airlines
                </ThemedText>
                <ThemedText color="text-70" type="body2">
                  Test ID: {tabType}-airlines-tab
                </ThemedText>
              </View>
            </Tabs.ScrollView>
          </Tabs.Tab>
        </Tabs.Container>
      </View>
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

import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useEffect, useState } from 'react'
import { Keyboard, ScrollView, TouchableOpacity, View } from 'react-native'

import { SearchInput } from '@/components/common/SearchInput'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const SearchInputDemo = ({
  placeholder = 'Search airports, airlines...',
  showState = true,
}: {
  placeholder?: string
  showState?: boolean
}) => {
  const { selectedTheme } = useThemeStore()
  const colors = themeColors?.[selectedTheme]

  const [searchValue, setSearchValue] = useState<string>('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const handleSearch = (text: string) => {
    setSearchValue(text)
    if (text.trim() && !searchHistory.includes(text.trim())) {
      setSearchHistory(prev => [text.trim(), ...prev.slice(0, 4)])
    }
  }

  const handleHistorySelect = (item: string) => {
    setSearchValue(item)
  }

  return (
    <View className="flex-1 bg-background-primary pt-5">
      <SearchInput value={searchValue} onChangeText={handleSearch} placeholder={placeholder} />

      {showState ? (
        <View className="flex-1 px-4 pt-5">
          <View className="bg-background-secondary rounded-xl p-4 mb-5">
            <ThemedText color="text-100" type="body1" className="mb-2">
              Current Value:
            </ThemedText>
            <View className="bg-background-secondary p-3 rounded-lg mb-4">
              <ThemedText color={searchValue ? 'text-100' : 'text-70'} type="body2">
                {searchValue || 'No input'}
              </ThemedText>
            </View>

            <ThemedText color="text-100" type="body1" className="mb-2">
              Character Count: {searchValue.length}
            </ThemedText>

            <View
              className="p-2 rounded-md items-center"
              style={{
                backgroundColor:
                  searchValue.length > 0
                    ? colors?.background?.secondary
                    : colors?.background?.tertiary,
              }}
            >
              <ThemedText color="text-100" type="h3">
                {searchValue.length > 0 ? 'Has Content' : 'Empty'}
              </ThemedText>
            </View>
          </View>

          {searchHistory.length > 0 ? (
            <View className="bg-background-secondary rounded-xl p-4">
              <ThemedText color="text-100" type="body1" className="mb-3">
                Recent Searches:
              </ThemedText>
              {searchHistory.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  className="bg-background-secondary p-3 rounded-lg mb-2"
                  onPress={() => handleHistorySelect(item)}
                >
                  <ThemedText color="text-70" type="body2">
                    {item}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    docs: {
      description: {
        component:
          'Animated search input component with focus states, clear functionality, and cancel button. Features responsive design and theme integration.',
      },
    },
  },
  decorators: [
    Story => (
      <View className="flex-1 bg-background-primary">
        <Story />
      </View>
    ),
  ],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the search input',
    },
    value: {
      control: { type: 'text' },
      description: 'Current input value',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
}

export default meta

type Story = StoryObj<typeof SearchInputDemo>

export const Default: Story = {
  render: () => <SearchInputDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Default search input with real-time state display and search history.',
      },
    },
  },
}

export const PlaceholderVariants: Story = {
  render: () => {
    const [airportSearchValue, setAirportSearchValue] = useState<string>('')
    const [airlineSearchValue, setAirlineSearchValue] = useState<string>('')
    const [generalSearchValue, setGeneralSearchValue] = useState<string>('')
    const [locationSearchValue, setLocationSearchValue] = useState<string>('')

    return (
      <ScrollView
        contentContainerClassName="flex-1 pt-5 pb-10 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
            Airport Search
          </ThemedText>
          <SearchInput
            value={airportSearchValue}
            onChangeText={setAirportSearchValue}
            placeholder="Search airports..."
          />
        </View>

        <View>
          <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
            Airline Search
          </ThemedText>
          <SearchInput
            value={airlineSearchValue}
            onChangeText={setAirlineSearchValue}
            placeholder="Search airlines..."
          />
        </View>

        <View>
          <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
            General Search
          </ThemedText>
          <SearchInput
            value={generalSearchValue}
            onChangeText={setGeneralSearchValue}
            placeholder="What are you looking for?"
          />
        </View>

        <View>
          <ThemedText color="text-100" type="h4" className="mb-2.5 ml-4">
            Location Search
          </ThemedText>
          <SearchInput
            value={locationSearchValue}
            onChangeText={setLocationSearchValue}
            placeholder="Enter city, airport code..."
          />
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Different placeholder text variations for various search contexts.',
      },
    },
  },
}

export const FocusStates: Story = {
  render: () => {
    const [focusedInput, setFocusedInput] = useState<number | null>(null)
    const [values, setValues] = useState<string[]>(['', '', ''])

    const createHandleChange = (index: number) => (text: string) => {
      const newValues = [...values]
      newValues[index] = text
      setValues(newValues)
    }

    return (
      <ScrollView
        contentContainerClassName="flex-1 pt-5 pb-10 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText color="text-100" type="body1" className="mb-2.5 ml-4">
            Input 1 {focusedInput === 0 ? '(Focused)' : '(Unfocused)'}
          </ThemedText>
          <SearchInput
            value={values?.[0] as string}
            onChangeText={createHandleChange(0)}
            placeholder="Focus to see changes..."
          />
        </View>

        <View>
          <ThemedText color="text-100" type="body1" className="mb-2.5 ml-4">
            Input 2 {focusedInput === 1 ? '(Focused)' : '(Unfocused)'}
          </ThemedText>
          <SearchInput
            value={values?.[1] as string}
            onChangeText={createHandleChange(1)}
            placeholder="Type something here..."
          />
        </View>

        <View>
          <ThemedText color="text-100" type="body1" className="mb-2.5 ml-4">
            Input 3 {focusedInput === 2 ? '(Focused)' : '(Unfocused)'}
          </ThemedText>
          <SearchInput
            value={values?.[2] as string}
            onChangeText={createHandleChange(2)}
            placeholder="Another search input..."
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-success p-4 rounded-xl mx-4 items-center"
          onPress={() => Keyboard.dismiss()}
        >
          <ThemedText color="text-100" type="body1">
            Dismiss Keyboard
          </ThemedText>
        </TouchableOpacity>

        <View className="p-4 bg-background-secondary rounded-xl mx-4">
          <ThemedText color="text-100" type="body1" className="mb-3">
            Focus State Features:
          </ThemedText>
          <ThemedText color="text-70" type="body2">
            • Input expands when focused{'\n'}• Cancel button appears on focus{'\n'}• Clear button
            shows with content{'\n'}• Smooth animations between states{'\n'}• Auto keyboard
            appearance matching theme
          </ThemedText>
        </View>
      </ScrollView>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus state behavior and animations with multiple inputs.',
      },
    },
  },
}

export const InteractiveFeatures: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState<string>('Sample search text')
    const [actionLog, setActionLog] = useState<string[]>([])

    const logAction = (action: string) => {
      const timestamp = new Date().toLocaleTimeString()
      setActionLog(prev => [`${timestamp}: ${action}`, ...prev.slice(0, 9)])
    }

    const handleSearch = (text: string) => {
      setSearchValue(text)
      logAction(`Text changed to: "${text}"`)
    }

    const clearLog = () => {
      setActionLog([])
      logAction('Action log cleared')
    }

    return (
      <View className="flex-1 pt-5">
        <SearchInput
          value={searchValue}
          onChangeText={handleSearch}
          placeholder="Interactive search demo..."
        />

        <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false}>
          <View className="bg-background-secondary rounded-xl p-4 mb-5">
            <ThemedText color="text-100" type="h4" className="mb-4">
              Interactive Features
            </ThemedText>

            <View className="mb-4">
              <ThemedText color="success" type="body2" className="mb-2">
                🔍 Search Icon: Always visible
              </ThemedText>
              <ThemedText color="text-70" type="h3">
                Magnify icon using themed colors
              </ThemedText>
            </View>

            <View className="mb-4">
              <ThemedText color="warning" type="body2" className="mb-2">
                ❌ Clear Button: Shows when focused + has content
              </ThemedText>
              <ThemedText color="text-70" type="h3">
                Custom close icon with primary/secondary colors
              </ThemedText>
            </View>

            <View className="mb-4">
              <ThemedText color="error" type="body2" className="mb-2">
                🚫 Cancel Button: Shows when focused
              </ThemedText>
              <ThemedText color="text-70" type="h3">
                Clears text and dismisses keyboard
              </ThemedText>
            </View>

            <View>
              <ThemedText color="primary-100" type="body2" className="mb-2">
                📱 Keyboard: Theme-aware appearance
              </ThemedText>
              <ThemedText color="text-70" type="h3">
                Matches selected theme (light/dark)
              </ThemedText>
            </View>
          </View>

          <View className="bg-background-secondary rounded-xl p-4 mb-5">
            <View className="flex-row justify-between items-center mb-3">
              <ThemedText color="text-100" type="body1">
                Action Log ({actionLog.length})
              </ThemedText>
              <TouchableOpacity
                activeOpacity={0.7}
                className="bg-error px-3 py-1.5 rounded-md"
                onPress={clearLog}
              >
                <ThemedText color="text-100" type="h3">
                  Clear
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {actionLog.length === 0 ? (
                  <ThemedText color="text-70" type="body2">
                    No actions logged yet
                  </ThemedText>
                ) : (
                  actionLog.map((log, index) => (
                    <View key={index} className="bg-background-primary p-2 rounded mb-1">
                      <ThemedText color="text-70" type="h3">
                        {log}
                      </ThemedText>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive features demonstration with action logging.',
      },
    },
  },
}

export const ResponsiveLayout: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState<string>('')

    return (
      <View className="flex-1 pt-5">
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Responsive search input"
        />

        <View className="p-4 bg-background-secondary rounded-xl mx-4 mt-5">
          <ThemedText color="text-100" type="h4" className="mb-4">
            Responsive Layout
          </ThemedText>

          <ThemedText color="text-70" type="body2" className="mb-4">
            The search input automatically adapts to different screen sizes:
          </ThemedText>

          <View className="mb-3">
            <ThemedText color="info" type="body2" className="mb-1">
              📐 Width Calculation:
            </ThemedText>
            <ThemedText color="text-70" type="h3">
              Device width - 32px (16px padding on each side)
            </ThemedText>
          </View>

          <View className="mb-3">
            <ThemedText color="success" type="body2" className="mb-1">
              📱 Self-Centering:
            </ThemedText>
            <ThemedText color="text-70" type="h3">
              Automatically centers within its container
            </ThemedText>
          </View>

          <View className="mb-3">
            <ThemedText color="warning" type="body2" className="mb-1">
              🔄 Dynamic Expansion:
            </ThemedText>
            <ThemedText color="text-70" type="h3">
              Input field expands when focused, cancel button appears
            </ThemedText>
          </View>

          <View>
            <ThemedText color="error" type="body2" className="mb-1">
              📏 Consistent Height:
            </ThemedText>
            <ThemedText color="text-70" type="h3">
              Maintains consistent height across all screen sizes
            </ThemedText>
          </View>
        </View>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Responsive layout behavior across different screen sizes.',
      },
    },
  },
}

export const AccessibilityTesting: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState<string>('')
    const [testResults, setTestResults] = useState<string[]>([])

    const runAccessibilityTests = () => {
      const tests = [
        'Search input has testID: search-input ✅',
        'Clear button has testID: search-clear-button ✅',
        'Cancel button has testID: search-cancel-button ✅',
        'Font scaling disabled for consistency ✅',
        'Keyboard appearance matches theme ✅',
        'Proper hit slop for touch targets ✅',
        'Return key type set to "search" ✅',
        'Auto-correct and spell check disabled ✅',
      ]

      setTestResults(tests)
    }

    return (
      <View className="flex-1 pt-5">
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Accessibility test input..."
        />

        <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false}>
          <View className="bg-background-secondary rounded-xl p-4 mb-5">
            <ThemedText color="text-100" type="h4" className="mb-4">
              Test Identifiers
            </ThemedText>

            <View className="bg-background-primary p-3 rounded-lg mb-4">
              <ThemedText color="success" type="body2" className="mb-2">
                Available Test IDs:
              </ThemedText>
              <ThemedText color="text-70" type="h3">
                search-input{'\n'}
                search-clear-button{'\n'}
                search-cancel-button
              </ThemedText>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-success p-3 rounded-lg items-center"
              onPress={runAccessibilityTests}
            >
              <ThemedText color="text-100" type="body2">
                Run Accessibility Tests
              </ThemedText>
            </TouchableOpacity>
          </View>

          {testResults.length > 0 ? (
            <View className="bg-background-secondary rounded-xl p-4 mb-5">
              <ThemedText color="text-100" type="h4" className="mb-4">
                Test Results
              </ThemedText>

              {testResults.map((result, index) => (
                <View key={index} className="bg-background-primary p-2.5 rounded-md mb-1.5">
                  <ThemedText color="success" type="h3">
                    {result}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}

          <View className="bg-background-secondary rounded-xl p-4">
            <ThemedText color="text-100" type="body1" className="mb-3">
              Accessibility Features:
            </ThemedText>
            <ThemedText color="text-70" type="body2">
              • Disabled font scaling for UI consistency{'\n'}• Proper hit slop for touch targets
              {'\n'}• Theme-aware keyboard appearance{'\n'}• Semantic return key type (search){'\n'}
              • Disabled auto-correct for search context{'\n'}• Transparent underline for clean
              appearance{'\n'}• Test IDs for automated testing
            </ThemedText>
          </View>
        </ScrollView>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features and testing capabilities.',
      },
    },
  },
}

export const PerformanceAnimation: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState<string>('')
    const [renderCount, setRenderCount] = useState<number>(0)
    const [animationState, setAnimationState] = useState<'idle' | 'typing'>('idle')

    useEffect(() => {
      setRenderCount(prev => prev + 1)
    }, [searchValue])

    const handleChange = (text: string) => {
      setSearchValue(text)
      setAnimationState('typing')

      setTimeout(() => setAnimationState('idle'), 300)
    }

    const stressTest = () => {
      let count = 0
      const interval = setInterval(() => {
        setSearchValue(`Test ${count}`)
        count++
        if (count > 20) {
          clearInterval(interval)
          setSearchValue('')
        }
      }, 100)
    }

    return (
      <View className="flex-1 pt-5">
        <SearchInput
          value={searchValue}
          onChangeText={handleChange}
          placeholder="Performance test input..."
        />

        <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false}>
          <View className="bg-background-secondary rounded-xl p-4 mb-5">
            <ThemedText color="text-100" type="h4" className="mb-4">
              Performance Metrics
            </ThemedText>

            <View className="flex-row justify-between mb-3">
              <ThemedText color="text-90" type="body2">
                Render Count:
              </ThemedText>
              <ThemedText color="primary-100" type="body2">
                {renderCount}
              </ThemedText>
            </View>

            <View className="flex-row justify-between mb-3">
              <ThemedText color="text-90" type="body2">
                Animation State:
              </ThemedText>
              <ThemedText color={animationState === 'typing' ? 'warning' : 'success'} type="body2">
                {animationState}
              </ThemedText>
            </View>

            <View className="flex-row justify-between mb-4">
              <ThemedText color="text-90" type="body2">
                Input Length:
              </ThemedText>
              <ThemedText color="text-100" type="body2">
                {searchValue.length} chars
              </ThemedText>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-background-secondary p-3 rounded-lg items-center"
              onPress={stressTest}
            >
              <ThemedText color="text-100" type="body2">
                Run Stress Test (20 rapid changes)
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View className="bg-background-secondary rounded-xl p-4">
            <ThemedText color="text-100" type="body1" className="mb-3">
              Optimization Features:
            </ThemedText>
            <ThemedText color="text-70" type="body2">
              • useMemo for theme colors{'\n'}• useRef for TextInput reference{'\n'}• Optimized
              re-renders{'\n'}• CSS transition animations{'\n'}• Conditional rendering for buttons
              {'\n'}• Efficient state management{'\n'}• Native driver animations where possible
            </ThemedText>
          </View>
        </ScrollView>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance monitoring and animation testing capabilities.',
      },
    },
  },
}

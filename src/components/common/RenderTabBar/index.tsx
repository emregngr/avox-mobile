import React, { useMemo } from 'react'
import { View } from 'react-native'
import { MaterialTabBar, MaterialTabItem } from 'react-native-collapsible-tab-view'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { responsive } from '@/utils/common/responsive'

type RenderTabBarProps = {
  activeIndex: number
  props: any
}

export const RenderTabBar = ({ activeIndex, props }: RenderTabBarProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  return (
    <View className="self-center">
      <MaterialTabBar
        {...props}
        indicatorStyle={{
          backgroundColor: colors?.primary100,
          borderRadius: 12,
          height: 36,
          zIndex: -1,
        }}
        style={{
          backgroundColor: colors?.background?.tertiary,
          borderRadius: 12,
          height: 36,
        }}
        TabItemComponent={itemProps => (
          <MaterialTabItem
            {...itemProps}
            android_ripple={{
              borderless: false,
              color: colors?.primary100,
              radius: 100,
            }}
            label={({ index, name }) => (
              <View
                className="h-[36px] flex-1 justify-center items-center"
                style={{ width: responsive.deviceWidth / 2 - 16 }}
              >
                <ThemedText color={index === activeIndex ? 'text-100' : 'text-70'} type="body1">
                  {name}
                </ThemedText>
              </View>
            )}
            pressOpacity={1}
          />
        )}
        width={responsive.deviceWidth - 32}
      />
    </View>
  )
}

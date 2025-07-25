import React, { useMemo } from 'react'
import type { ColorValue } from 'react-native'
import { View } from 'react-native'
import { MaterialTabBar, MaterialTabItem } from 'react-native-collapsible-tab-view'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import type { ThemeColors } from '@/themes'
import { themeColors } from '@/themes'
import { responsive } from '@/utils/common/responsive'

type RenderDetailTabBarProps = {
  activeIndex: number
  indicatorBackgroundColor?: string
  props: any
}

export const RenderDetailTabBar = ({
  activeIndex,
  indicatorBackgroundColor,
  props,
}: RenderDetailTabBarProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  return (
    <View className="self-center">
      <MaterialTabBar
        {...props}
        indicatorStyle={{
          backgroundColor: colors?.[indicatorBackgroundColor as keyof typeof colors],
          borderRadius: 12,
          height: 36,
          zIndex: -1,
        }}
        style={{
          backgroundColor: colors?.background?.tertiary,
          borderRadius: 12,
          height: 36,
          marginVertical: 16,
        }}
        TabItemComponent={itemProps => (
          <MaterialTabItem
            {...itemProps}
            android_ripple={{
              borderless: false,
              color: colors?.[indicatorBackgroundColor as keyof ThemeColors] as
                | ColorValue
                | null
                | undefined,
              radius: 100,
            }}
            label={({ index, name }) => (
              <View
                className="h-[36px] flex-1 justify-center items-center"
                style={{ width: responsive.deviceWidth / 4 - 8 }}
              >
                <ThemedText color={index === activeIndex ? 'text-100' : 'text-70'} type="body2">
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

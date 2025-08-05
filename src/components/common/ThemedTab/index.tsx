import { router } from 'expo-router'
import type { FC, JSX } from 'react'
import React, { useMemo } from 'react'
import { Platform, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { SvgProps } from 'react-native-svg'

import HomeIcon from '@/assets/icons/tab/home.svg'
import ProfileIcon from '@/assets/icons/tab/profile.svg'
import SearchIcon from '@/assets/icons/tab/search.svg'
import StarIcon from '@/assets/icons/tab/star.svg'
import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableWithoutFeedback

type IconProps = {
  Icon: FC<SvgProps>
  currentIndex: number
  index: number
}

type TabProps = {
  state: {
    index: number
  }
}

type TabButtonProps = {
  active: boolean
  badge?: null | string
  icon: JSX.Element
  label: string
  onPress: () => void
}

const Icon = ({ Icon: IconComponent, currentIndex, index }: IconProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const isActive = currentIndex === index

  return (
    <IconComponent
      color={isActive ? colors?.onPrimary100 : colors?.onPrimary70}
      height={24}
      width={24}
    />
  )
}

export const ThemedTab = ({ state }: TabProps) => {
  const { index: currentIndex = 0 } = state ?? {}

  const { bottom } = useSafeAreaInsets()

  return (
    <View
      style={{
        paddingBottom: bottom,
      }}
      className="w-full flex-row justify-around bg-background-primary"
    >
      <TabButton
        active={currentIndex === 0}
        icon={<Icon currentIndex={currentIndex} Icon={HomeIcon} index={0} />}
        label={getLocale('home')}
        onPress={() => router.navigate('/home')}
      />
      <TabButton
        active={currentIndex === 1}
        icon={<Icon currentIndex={currentIndex} Icon={SearchIcon} index={1} />}
        label={getLocale('discover')}
        onPress={() => router.navigate('/discover')}
      />
      <TabButton
        active={currentIndex === 2}
        icon={<Icon currentIndex={currentIndex} Icon={StarIcon} index={2} />}
        label={getLocale('favorites')}
        onPress={() => router.navigate('/favorites')}
      />
      <TabButton
        active={currentIndex === 3}
        icon={<Icon currentIndex={currentIndex} Icon={ProfileIcon} index={3} />}
        label={getLocale('profile')}
        onPress={() => router.navigate('/profile')}
      />
    </View>
  )
}

const TabButton = ({ active, badge, icon, label, onPress }: TabButtonProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  return (
    <Touchable
      background={TouchableNativeFeedback.Ripple(colors?.onPrimary50, false)}
      onPress={onPress}
    >
      <View className="w-[75px] py-2 justify-center items-center">
        <View className="mb-1">{icon}</View>
        <ThemedText color={active ? 'text-100' : 'text-70'} type="tabBar">
          {label}
        </ThemedText>
        {badge ? (
          <View className="absolute -top-1 right-5 w-4 h-4 justify-center items-center rounded-full overflow-hidden bg-error">
            <ThemedText color="text-100" type="body3">
              {badge}
            </ThemedText>
          </View>
        ) : null}
      </View>
    </Touchable>
  )
}

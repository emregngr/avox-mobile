import { GlassView } from 'expo-glass-effect'
import * as Haptics from 'expo-haptics'
import { type ReactNode, useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import { Platform, TouchableOpacity, View } from 'react-native'

import { ThemedButtonText } from '@/components/common/ThemedButtonText'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type HeaderProps = {
  backIcon?: boolean
  backIconOnPress?: () => void
  containerClassName?: string
  hapticFeedback?: boolean
  isFavorite?: boolean
  rightButtonLabel?: string
  rightButtonOnPress?: () => void
  rightIcon?: ReactNode
  rightIconOnPress?: () => void
  shareIcon?: ReactNode
  shareIconOnPress?: () => void
  style?: ViewStyle
  testID?: string
  title?: string | string[]
  titleClassName?: string
}

const STATIC_STYLES = {
  backIcon: {
    left: 16,
    position: 'absolute' as const,
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  shareIcon: {
    right: 64,
    position: 'absolute' as const,
    borderRadius: 50,
    padding: 8,
  },
  rightIcon: {
    right: 16,
    position: 'absolute' as const,
    borderRadius: 50,
    padding: 8,
  },
}

export const Header = ({
  backIcon = true,
  backIconOnPress,
  containerClassName,
  hapticFeedback = false,
  isFavorite = false,
  rightButtonLabel,
  rightButtonOnPress,
  rightIcon,
  rightIconOnPress,
  shareIcon,
  shareIconOnPress,
  style,
  testID,
  title,
  titleClassName,
}: HeaderProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const handleRightIconOnPress = () => {
    if (hapticFeedback) {
      if (isFavorite) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }
    }

    rightIconOnPress?.()
  }

  const getGlassViewStyle = (baseStyle: ViewStyle) => ({
    ...baseStyle,
    ...((Platform.OS !== 'ios' ||
      (Platform.OS === 'ios' && parseInt(Platform.Version as string) < 26)) && {
      backgroundColor: colors?.background?.glass,
    }),
  })

  const backIconGlassViewStyle = useMemo(() => getGlassViewStyle(STATIC_STYLES.backIcon), [colors])

  const shareIconGlassViewStyle = useMemo(
    () => getGlassViewStyle(STATIC_STYLES.shareIcon),
    [colors],
  )

  const rightIconGlassViewStyle = useMemo(
    () => getGlassViewStyle(STATIC_STYLES.rightIcon),
    [colors],
  )

  return (
    <View
      className={cn('h-11 justify-center items-center', containerClassName)}
      style={style}
      testID={testID || 'header'}
    >
      {title ? (
        <ThemedText
          className={titleClassName ?? ''}
          color="text-100"
          ellipsizeMode="tail"
          numberOfLines={2}
          type="h3"
          center
        >
          {title}
        </ThemedText>
      ) : null}

      {backIcon ? (
        <GlassView
          style={backIconGlassViewStyle}
          tintColor={colors?.background?.glass}
          glassEffectStyle="clear"
          isInteractive
        >
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={20}
            onPress={backIconOnPress}
            testID="header-back-icon"
          >
            <MaterialCommunityIcons name="chevron-left" size={36} color={colors?.onPrimary100} />
          </TouchableOpacity>
        </GlassView>
      ) : null}

      {shareIcon ? (
        <GlassView
          style={shareIconGlassViewStyle}
          tintColor={colors?.background?.glass}
          glassEffectStyle="clear"
          isInteractive
        >
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={10}
            onPress={shareIconOnPress}
            testID="header-share-icon"
          >
            {shareIcon}
          </TouchableOpacity>
        </GlassView>
      ) : null}

      {rightButtonLabel ? (
        <ThemedButtonText
          containerStyle="absolute right-4"
          label={rightButtonLabel}
          onPress={rightButtonOnPress as () => void}
          textColor="text-100"
          type="h4"
        />
      ) : rightIcon ? (
        <GlassView
          style={rightIconGlassViewStyle}
          tintColor={colors?.background?.glass}
          glassEffectStyle="clear"
          isInteractive
        >
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={10}
            onPress={handleRightIconOnPress}
            testID="header-right-icon"
          >
            {rightIcon}
          </TouchableOpacity>
        </GlassView>
      ) : null}
    </View>
  )
}

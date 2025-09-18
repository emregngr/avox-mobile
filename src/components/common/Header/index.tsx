import * as Haptics from 'expo-haptics'
import { type ReactNode, useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import { TouchableOpacity, View } from 'react-native'

import Back from '@/assets/icons/back.svg'
import { ThemedButtonText } from '@/components/common/ThemedButtonText'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'

type HeaderProps = {
  backIcon?: boolean
  backIconOnPress?: () => void
  containerClassName?: string
  hapticFeedback?: boolean,
  isFavorite?: boolean,
  rightButtonLabel?: string,
  rightButtonOnPress?: () => void,
  rightIcon?: ReactNode,
  rightIconClassName?: string,
  rightIconOnPress?: () => void,
  shareIcon?: ReactNode,
  shareIconClassName?: string,
  shareIconOnPress?: () => void,
  style?: ViewStyle,
  testID?: string,
  title?: string | string[],
  titleClassName?: string
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
  rightIconClassName,
  rightIconOnPress,
  shareIcon,
  shareIconClassName,
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
        <TouchableOpacity
          activeOpacity={0.7}
          className="absolute left-4"
          hitSlop={20}
          onPress={backIconOnPress}
          testID="header-back-icon"
        >
          <Back color={colors?.onPrimary100} height={24} width={24} />
        </TouchableOpacity>
      ) : null}

      {shareIcon ? (
        <TouchableOpacity
          activeOpacity={0.7}
          className={cn('absolute right-16', `${shareIconClassName}`)}
          hitSlop={10}
          onPress={shareIconOnPress}
          testID="header-share-icon"
        >
          {shareIcon}
        </TouchableOpacity>
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
        <TouchableOpacity
          activeOpacity={0.7}
          className={cn('absolute right-4', `${rightIconClassName}`)}
          hitSlop={10}
          onPress={handleRightIconOnPress}
          testID="header-right-icon"
        >
          {rightIcon}
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

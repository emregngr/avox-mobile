import { type ReactNode, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import Back from '@/assets/icons/back.svg'
import { ThemedButtonText } from '@/components/common/ThemedButtonText'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'

type HeaderProps = {
  containerClassName?: string
  leftIcon?: boolean
  leftIconOnPress?: () => void
  rightButtonLabel?: string
  rightButtonOnPress?: () => void
  rightIcon?: ReactNode
  rightIconClassName?: string
  rightIconOnPress?: () => void
  textClassName?: string
  title?: string | string[]
}

export const Header = ({
  containerClassName,
  leftIcon = true,
  leftIconOnPress,
  rightButtonLabel,
  rightButtonOnPress,
  rightIcon,
  rightIconClassName,
  rightIconOnPress,
  textClassName,
  title,
}: HeaderProps) => {
  const { selectedTheme } = useThemeStore()
  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  return (
    <View className={cn('h-11 justify-center items-center', containerClassName)}>
      {title ? (
        <ThemedText
          className={cn(textClassName)}
          color="text-100"
          ellipsizeMode="tail"
          numberOfLines={2}
          type="h3"
          center
        >
          {title}
        </ThemedText>
      ) : null}

      {leftIcon ? (
        <TouchableOpacity
          activeOpacity={0.7}
          className="absolute left-4"
          hitSlop={20}
          onPress={leftIconOnPress}
        >
          <Back color={colors?.onPrimary100} height={24} width={24} />
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
          hitSlop={20}
          onPress={rightIconOnPress}
        >
          {rightIcon}
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

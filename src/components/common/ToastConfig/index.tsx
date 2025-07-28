import { useMemo } from 'react'
import type { ToastProps } from 'react-native-toast-message'
import { ErrorToast, SuccessToast } from 'react-native-toast-message'

import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

interface ToastConfigProps extends ToastProps {
  style?: any
  text1Props?: any
  text1Style?: any
  text2NumberOfLines?: number
  text2Props?: any
  text2Style?: any
}

export const useToastConfig = () => {
  const { selectedTheme } = useThemeStore()
  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const toastConfig = useMemo(() => {
    const baseToastProps = {
      text1Props: { allowFontScaling: false, maxFontSizeMultiplier: 1 },
      text2NumberOfLines: 2,
      text2Props: { allowFontScaling: false, maxFontSizeMultiplier: 1 },
    }

    const baseStyle = {
      backgroundColor: colors?.background?.tertiary,
      height: 70,
      marginTop: 20,
    }

    const baseTextStyle = {
      text1Style: {
        color: colors?.text100,
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        lineHeight: 18,
      },
      text2Style: {
        color: colors?.text100,
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 16,
      },
    }

    return {
      error: (props: ToastConfigProps) => (
        <ErrorToast
          {...props}
          {...baseToastProps}
          {...baseTextStyle}
          style={{
            ...baseStyle,
            borderLeftColor: colors?.error,
          }}
        />
      ),
      success: (props: ToastConfigProps) => (
        <SuccessToast
          {...props}
          {...baseToastProps}
          {...baseTextStyle}
          style={{
            ...baseStyle,
            borderLeftColor: colors?.success,
          }}
        />
      ),
    }
  }, [colors])

  return toastConfig
}

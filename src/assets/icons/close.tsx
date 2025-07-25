import React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'

interface CloseProps {
  height: number,
  primaryColor: string,
  secondaryColor: string,
  width: number
}

const Close = ({ height, primaryColor, secondaryColor, width }: CloseProps) => (
  <Svg
    fill="none" height={height} viewBox="0 0 24 24"
    width={width}
  >
    <Rect
      fill={primaryColor} height="24" rx="12"
      width="24"
    />
    <Path
      d="M7.41741 15.4757C7.12948 15.7636 7.12361 16.2748 7.42329 16.5745C7.72884 16.8742 8.24006 16.8683 8.52211 16.5863L12.0007 13.1076L15.4735 16.5804C15.7673 16.8742 16.2726 16.8742 16.5723 16.5745C16.872 16.2689 16.872 15.7695 16.5782 15.4757L13.1054 12.0029L16.5782 8.52432C16.872 8.23052 16.8779 7.72518 16.5723 7.4255C16.2726 7.12582 15.7673 7.12582 15.4735 7.41962L12.0007 10.8924L8.52211 7.41962C8.24006 7.1317 7.72297 7.11995 7.42329 7.4255C7.12361 7.72518 7.12948 8.24227 7.41741 8.52432L10.8902 12.0029L7.41741 15.4757Z"
      fill={secondaryColor}
    />
  </Svg>
)

export default Close

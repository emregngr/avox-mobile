import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'

const SvgMock = (props: SvgProps) => <View {...props} testID="mocked-svg-icon" />

export default SvgMock


import { View, ViewProps } from 'react-native'

type MockImageProps = ViewProps & {
  testID?: string
}

export const Image = (props: MockImageProps ) => (
  <View testID={props.testID || 'mocked-image'} {...props} />
)

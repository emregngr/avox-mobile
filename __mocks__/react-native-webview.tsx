import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { View, ViewProps } from 'react-native'

type MockWebViewHandle = {
  goBack: jest.Mock
  goForward: jest.Mock
  reload: jest.Mock
  stopLoading: jest.Mock
  postMessage: jest.Mock
  injectJavaScript: jest.Mock
}

type MockWebViewProps = ViewProps & {
  testID?: string
}

const MockWebView = forwardRef<MockWebViewHandle, MockWebViewProps>(
  (props, ref: ForwardedRef<MockWebViewHandle>) => {
    useImperativeHandle(
      ref,
      (): MockWebViewHandle => ({
        goBack: jest.fn(),
        goForward: jest.fn(),
        reload: jest.fn(),
        stopLoading: jest.fn(),
        postMessage: jest.fn(),
        injectJavaScript: jest.fn(),
      }),
    )

    return <View testID={props.testID || 'mocked-webview'} {...props} />
  },
)

export default MockWebView

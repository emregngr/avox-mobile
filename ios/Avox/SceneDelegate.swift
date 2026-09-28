import UIKit
import React

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else { return }

    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
          let factory = appDelegate.reactNativeFactory else {
      return
    }

    let window = UIWindow(windowScene: windowScene)
    appDelegate.window = window
    self.window = window

    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: nil
    )
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else { return }
    _ = (UIApplication.shared.delegate as? AppDelegate)?
      .application(UIApplication.shared, open: url, options: [:])
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    let dummyHandler: ([UIUserActivityRestoring]?) -> Void = { _ in }
    _ = (UIApplication.shared.delegate as? AppDelegate)?
      .application(UIApplication.shared, continue: userActivity, restorationHandler: dummyHandler)
  }
}

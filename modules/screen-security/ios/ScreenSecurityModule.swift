import ExpoModulesCore
import UIKit

public class ScreenSecurityModule: Module {
  var authenticator: BiometricAuthenticating = BiometricAuthManager.shared

  public func definition() -> ModuleDefinition {
    Name("ScreenSecurity")

    Events("onScreenshotTaken")

    OnStartObserving {
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(self.handleScreenshot),
        name: UIApplication.userDidTakeScreenshotNotification,
        object: nil
      )
    }

    OnStopObserving {
      NotificationCenter.default.removeObserver(
        self,
        name: UIApplication.userDidTakeScreenshotNotification,
        object: nil
      )
    }

    AsyncFunction("getDeviceId") { () -> String in
      return DeviceIdentifierManager.shared.getDeviceID()
    }

    AsyncFunction("isBiometricAuthenticated") { (promise: Promise) in
      self.authenticator.authenticate { result in
        switch result {
        case .success:
          promise.resolve(true)
        case .failure(let error):
          promise.reject(error.code, error.message)
        }
      }
    }
  }

  @objc private func handleScreenshot() {
    sendEvent("onScreenshotTaken", [:])
  }
}

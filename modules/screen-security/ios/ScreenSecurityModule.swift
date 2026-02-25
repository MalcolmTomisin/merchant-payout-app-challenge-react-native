import ExpoModulesCore

public class ScreenSecurityModule: Module {
  var authenticator: BiometricAuthenticating = BiometricAuthManager.shared

  public func definition() -> ModuleDefinition {
    Name("ScreenSecurity")

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
}

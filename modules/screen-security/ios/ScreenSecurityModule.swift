import ExpoModulesCore
import LocalAuthentication

public class ScreenSecurityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenSecurity")

    AsyncFunction("getDeviceId") { () -> String in
      return DeviceIdentifierManager.shared.getDeviceID()
    }

    AsyncFunction("isBiometricAuthenticated") { (promise: Promise) in
      let context = LAContext()
      var error: NSError?

      guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
        if let laError = error, laError.code == LAError.biometryNotEnrolled.rawValue {
          promise.reject("BIOMETRIC_NOT_ENROLLED", "Biometric authentication is not set up. Please enable it in Settings.")
        } else {
          promise.reject("BIOMETRIC_UNAVAILABLE", "Biometric authentication is not available on this device.")
        }
        return
      }

      context.evaluatePolicy(
        .deviceOwnerAuthenticationWithBiometrics,
        localizedReason: "Authenticate to complete the payout"
      ) { success, evaluationError in
        if success {
          promise.resolve(true)
        } else if let evalError = evaluationError as NSError? {
          if evalError.code == LAError.userCancel.rawValue || evalError.code == LAError.appCancel.rawValue {
            promise.reject("BIOMETRIC_CANCELLED", "Biometric authentication was cancelled.")
          } else if evalError.code == LAError.userFallback.rawValue {
            promise.reject("BIOMETRIC_FALLBACK", "Biometric authentication was cancelled.")
          } else {
            promise.reject("BIOMETRIC_FAILED", "Biometric authentication failed. Please try again.")
          }
        } else {
          promise.reject("BIOMETRIC_FAILED", "Biometric authentication failed. Please try again.")
        }
      }
    }
  }
}

import Foundation
import LocalAuthentication

public enum BiometricError: Error {
  case notEnrolled
  case unavailable
  case cancelled
  case fallback
  case failed

  var code: String {
    switch self {
    case .notEnrolled: return "BIOMETRIC_NOT_ENROLLED"
    case .unavailable: return "BIOMETRIC_UNAVAILABLE"
    case .cancelled: return "BIOMETRIC_CANCELLED"
    case .fallback: return "BIOMETRIC_FALLBACK"
    case .failed: return "BIOMETRIC_FAILED"
    }
  }

  var message: String {
    switch self {
    case .notEnrolled:
      return "Biometric authentication is not set up. Please enable it in Settings."
    case .unavailable:
      return "Biometric authentication is not available on this device."
    case .cancelled:
      return "Biometric authentication was cancelled."
    case .fallback:
      return "Biometric authentication was cancelled."
    case .failed:
      return "Biometric authentication failed. Please try again."
    }
  }
}

public protocol BiometricAuthenticating {
  func authenticate(completion: @escaping (Result<Bool, BiometricError>) -> Void)
}

public class BiometricAuthManager: BiometricAuthenticating {
  public static let shared = BiometricAuthManager()
  private init() {}

  public func authenticate(completion: @escaping (Result<Bool, BiometricError>) -> Void) {
    let context = LAContext()
    var error: NSError?

    guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
      if let laError = error, laError.code == LAError.biometryNotEnrolled.rawValue {
        completion(.failure(.notEnrolled))
      } else {
        completion(.failure(.unavailable))
      }
      return
    }

    context.evaluatePolicy(
      .deviceOwnerAuthenticationWithBiometrics,
      localizedReason: "Authenticate to complete the payout"
    ) { success, evaluationError in
      if success {
        completion(.success(true))
      } else if let evalError = evaluationError as NSError? {
        if evalError.code == LAError.userCancel.rawValue || evalError.code == LAError.appCancel.rawValue {
          completion(.failure(.cancelled))
        } else if evalError.code == LAError.userFallback.rawValue {
          completion(.failure(.fallback))
        } else {
          completion(.failure(.failed))
        }
      } else {
        completion(.failure(.failed))
      }
    }
  }
}

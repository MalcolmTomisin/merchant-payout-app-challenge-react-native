package expo.modules.screensecurity

import android.content.Context
import android.provider.Settings
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.UUID

class ScreenSecurityModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ScreenSecurity")

    AsyncFunction("getDeviceId") {
      val context = appContext.reactContext ?: throw CodedException("CONTEXT_ERROR", "Application context is not available", null)
      val prefs = context.getSharedPreferences("screen_security_prefs", Context.MODE_PRIVATE)
      var deviceId = prefs.getString("device_id", null)
      if (deviceId == null) {
        deviceId = UUID.randomUUID().toString()
        prefs.edit().putString("device_id", deviceId).apply()
      }
      return@AsyncFunction deviceId
    }

    AsyncFunction("isBiometricAuthenticated") { promise: Promise ->
      val context = appContext.reactContext ?: run {
        promise.reject(CodedException("CONTEXT_ERROR", "Application context is not available", null))
        return@AsyncFunction
      }

      val biometricManager = BiometricManager.from(context)
      when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)) {
        BiometricManager.BIOMETRIC_SUCCESS -> {
          // Biometrics available, proceed with prompt
        }
        BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
          promise.reject(CodedException("BIOMETRIC_NOT_ENROLLED", "Biometric authentication is not set up. Please enable it in Settings.", null))
          return@AsyncFunction
        }
        else -> {
          promise.reject(CodedException("BIOMETRIC_UNAVAILABLE", "Biometric authentication is not available on this device.", null))
          return@AsyncFunction
        }
      }

      val activity = appContext.currentActivity as? FragmentActivity
      if (activity == null) {
        promise.reject(CodedException("ACTIVITY_ERROR", "Could not find a FragmentActivity to show biometric prompt.", null))
        return@AsyncFunction
      }

      activity.runOnUiThread {
        val executor = ContextCompat.getMainExecutor(context)

        val callback = object : BiometricPrompt.AuthenticationCallback() {
          override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
            super.onAuthenticationSucceeded(result)
            promise.resolve(true)
          }

          override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
            super.onAuthenticationError(errorCode, errString)
            if (errorCode == BiometricPrompt.ERROR_USER_CANCELED || errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON || errorCode == BiometricPrompt.ERROR_CANCELED) {
              promise.reject(CodedException("BIOMETRIC_CANCELLED", "Biometric authentication was cancelled.", null))
            } else {
              promise.reject(CodedException("BIOMETRIC_FAILED", "Biometric authentication failed. Please try again.", null))
            }
          }

          override fun onAuthenticationFailed() {
            super.onAuthenticationFailed()
            // Called on individual attempt failure (e.g. fingerprint not recognized)
            // Don't reject here — the system will keep allowing retries until error or success
          }
        }

        val biometricPrompt = BiometricPrompt(activity, executor, callback)

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
          .setTitle("Biometric Authentication")
          .setSubtitle("Authenticate to complete the payout")
          .setNegativeButtonText("Cancel")
          .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
          .build()

        biometricPrompt.authenticate(promptInfo)
      }
    }
  }
}

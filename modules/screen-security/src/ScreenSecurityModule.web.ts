import { registerWebModule, NativeModule } from "expo";

type ScreenSecurityModuleEvents = {};

class ScreenSecurityModule extends NativeModule<ScreenSecurityModuleEvents> {
  async isBiometricAuthenticated(): Promise<boolean> {
    return true;
  }
}

export default registerWebModule(ScreenSecurityModule, "ScreenSecurityModule");

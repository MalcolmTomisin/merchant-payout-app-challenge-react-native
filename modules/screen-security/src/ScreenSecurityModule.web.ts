import { registerWebModule, NativeModule } from "expo";

type ScreenSecurityModuleEvents = {};

class ScreenSecurityModule extends NativeModule<ScreenSecurityModuleEvents> {}

export default registerWebModule(ScreenSecurityModule, "ScreenSecurityModule");

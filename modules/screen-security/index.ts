import ScreenSecurityModule from './src/ScreenSecurityModule';

// Reexport the native module. On web, it will be resolved to ScreenSecurityModule.web.ts
// and on native platforms to ScreenSecurityModule.ts
export { default } from './src/ScreenSecurityModule';
export * from  './src/ScreenSecurity.types';

export function addScreenshotListener(callback: () => void) {
  return ScreenSecurityModule.addListener('onScreenshotTaken', callback);
}

export async function getDeviceIdAsync(): Promise<string> {
  const ScreenSecurityModule = await import('./src/ScreenSecurityModule');
  return ScreenSecurityModule.default.getDeviceId();
}

export async function isBiometricAuthenticatedAsync(): Promise<boolean> {
  const ScreenSecurityModule = await import('./src/ScreenSecurityModule');
  return ScreenSecurityModule.default.isBiometricAuthenticated();
}
// Reexport the native module. On web, it will be resolved to ScreenSecurityModule.web.ts
// and on native platforms to ScreenSecurityModule.ts
export { default } from './src/ScreenSecurityModule';
export * from  './src/ScreenSecurity.types';

export async function getDeviceIdAsync(): Promise<string> {
  const ScreenSecurityModule = await import('./src/ScreenSecurityModule');
  return ScreenSecurityModule.default.getDeviceId();
}
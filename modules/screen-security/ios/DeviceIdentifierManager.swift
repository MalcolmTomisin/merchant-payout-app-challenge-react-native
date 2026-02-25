import Foundation
import Security

public class DeviceIdentifierManager {
    
    public static let shared = DeviceIdentifierManager()
    
    private let keychainAccount = "com.yourdomain.yourapp.deviceID"
    
    private init() {}
    
    public func getDeviceID() -> String {
        if let existingID = loadFromKeychain() {
            return existingID
        } else {
            let newID = UUID().uuidString
            saveToKeychain(newID)
            return newID
        }
    }
    
    
    private func saveToKeychain(_ value: String) {
        guard let data = value.data(using: .utf8) else { return }
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: keychainAccount,
            kSecValueData as String: data,
            // Makes the item accessible after the first unlock, even if the device is locked subsequently
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock
        ]
        
        SecItemDelete(query as CFDictionary)
        
        SecItemAdd(query as CFDictionary, nil)
    }
    
    private func loadFromKeychain() -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: keychainAccount,
            kSecReturnData as String: kCFBooleanTrue!,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var dataTypeRef: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
        
        if status == errSecSuccess, let data = dataTypeRef as? Data {
            return String(data: data, encoding: .utf8)
        }
        
        return nil
    }
}
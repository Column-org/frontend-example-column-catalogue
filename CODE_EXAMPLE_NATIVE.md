# 📱 React Native Code Example Walkthrough

This guide explains how to integrate the **Column Catalogue SDK** into your React Native application.

---

## **Step 1: Installation**

First, install the SDK and its required native peer dependencies.

```bash
npm install column-catalogue
npm install @react-native-async-storage/async-storage react-native-passkey react-native-get-random-values
```

> [!IMPORTANT]
> Since this SDK uses native biometrics and storage, you must perform a native build (iOS/Android) to test it. It will not work in a standard web browser.

---

## **Step 2: Global Configuration (`src/config/column.ts`)**

Before using the SDK, you must ensure that the required crypto polyfills are loaded and configured. It's also best practice to create a centralized config for your RPC URL and a global client instance for non-React calls.

```tsx
// src/config/column.ts
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import { getAptosClient } from 'column-catalogue/native';

// @ts-ignore
global.Buffer = Buffer;

// 1. Centralized Configuration
export const COLUMN_CONFIG = {
  network: 'testnet' as const,
  rpcUrl: 'https://testnet.movementnetwork.xyz/v1',
};

// 2. Global client instance for core SDK calls (non-React)
export const aptosClient = getAptosClient(COLUMN_CONFIG.network, COLUMN_CONFIG.rpcUrl);
```

> [!NOTE]
> Make sure to import this file at the very top of your `index.js` or `App.tsx`.

---

## **Step 3: Initialize Providers**

In React Native, you use the `/native` entry point. This automatically configures the SDK to use mobile-specific storage and passkey implementations.

```tsx
// App.tsx
import './src/config/column'; // Import your config first!
import React from 'react';
import { CatalogueProvider } from 'column-catalogue/native';

export default function App() {
  return (
    <CatalogueProvider network="testnet">
      <MainScreen />
    </CatalogueProvider>
  );
}
```

---

## **Step 4: Accessing the Wallet (`useWallet` Hook)**

The hook works exactly like the Web version but uses native UI components for the modal.

```tsx
import { useWallet } from 'column-catalogue/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function MainScreen() {
  const { isConnected, address, username, openModal, disconnect } = useWallet();

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <Text style={styles.buttonText}>Connect Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {username}</Text>
      <Text style={styles.address}>{address}</Text>
      <TouchableOpacity style={styles.button} onPress={disconnect}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  address: { fontSize: 12, color: '#666', marginBottom: 20 },
  button: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16 }
});
```

---

## **Step 5: Signing Transactions**

Signing uses the device's native biometric prompt (FaceID, TouchID, or Android Biometrics).

```tsx
const handleSend = async () => {
    const { signAndSend } = useWallet();
    
    try {
        const result = await signAndSend({
            function: '0x1::aptos_account::transfer',
            functionArguments: [recipientAddress, '1000000'], // 1 MOVE
            typeArguments: []
        });
        console.log("Transaction Hash:", result.hash);
    } catch (error) {
        console.error("Signing failed:", error);
    }
};
```

---

## **How it works on Mobile**

1.  **Storage**: Instead of IndexedDB, it uses `@react-native-async-storage/async-storage` to store the encrypted wallet data.
2.  **Biometrics**: It uses the `react-native-passkey` library to interact with the device's secure enclave (Keychain on iOS, Keystore on Android).
3.  **UI**: The `CatalogueModal` is built with native `Modal` and `View` components, providing a consistent feel for mobile users.

---

## **Troubleshooting**

*   **Crypto Polyfill**: If you encounter `crypto.getRandomValues` errors, ensure you import `react-native-get-random-values` at the very top of your `index.js` or `App.tsx`.
*   **Android RP ID**: Ensure your Android App is properly configured with Digital Asset Links to support passkeys.

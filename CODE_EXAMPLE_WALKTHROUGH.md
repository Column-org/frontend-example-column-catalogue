# 👨‍💻 Code Example Walkthrough

This guide explains in simple steps how to integrate the **Column Catalogue SDK** into your React application.

---

## **File Structure**

It is recommended to organize your project files like this for scalability:

```text
/src
├── config/
│   └── column.ts        # Global SDK Configuration
├── components/          
│   └── Wallet.tsx       # Your Wallet UI
├── main.tsx             # Provider Setup
└── App.tsx
```

---

## **Step 1: Installation**

First, install the SDK in your project. It supports React 18+ and Next.js.

```bash
npm install column-catalogue
```

---

## **Step 2: Global Configuration (`src/config/column.ts`)**

Create a centralized config file to manage your RPC URL and global client instance. This is useful for making calls strictly from TypeScript files (outside React components).

```typescript
import { getAptosClient } from 'column-catalogue';

export const COLUMN_CONFIG = {
    network: 'testnet' as const,
    rpcUrl: 'https://testnet.movementnetwork.xyz/v1',
    username: 'Developer'
};

// Global client instance for core SDK calls
export const aptosClient = getAptosClient(COLUMN_CONFIG.network, COLUMN_CONFIG.rpcUrl);
```

---

## **Step 3: Wrap with Provider**

You must wrap your entire application with `CatalogueProvider`. This initializes the secure wallet engine **and automatically injects the Modal component**.

The `CatalogueProvider` ensures the modal is available globally without you needing to render it manually.

```tsx
// src/main.tsx
import { CatalogueProvider } from 'column-catalogue';
import { COLUMN_CONFIG } from './config/column';

function Root() {
  return (
    <CatalogueProvider 
      network={COLUMN_CONFIG.network}
      rpcUrl={COLUMN_CONFIG.rpcUrl}
    >
      <App />
    </CatalogueProvider>
  );
}
```

---

## **Step 4: Accessing the Wallet (`useWallet` Hook)**

The `useWallet` hook is your control center. It gives you everything you need to interact with the wallet.

```tsx
import { useWallet } from 'column-catalogue';

const { 
  isConnected,   // Boolean: true if user is logged in
  address,       // String: The 0x... address of the user
  balance,       // Object: { formatted: "10.5", raw: 1050000000 }
  openModal,     // Function: Opens the login modal (Passkey/Import)
  disconnect,    // Function: Logs the user out
  signAndSend    // Function: Trigger a transaction signature
} = useWallet();
```

---

## **Step 5: Triggering the Modal (User Login)**

Since the Provider handles rendering the modal, you just need to **open it** when the user clicks a button. This is typically done in your **Hero** section or **Header**.

**Example: `src/components/Hero.tsx`**

```tsx
import { useWallet } from 'column-catalogue';

export function Hero() {
    const { openModal, isConnecting } = useWallet();

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Seamless On-Chain Wallets</h1>
            
            <button
                onClick={() => openModal()}
                disabled={isConnecting}
                style={{
                    padding: '1rem 2rem',
                    fontSize: '1.2rem',
                    cursor: 'pointer'
                }}
            >
                {isConnecting ? 'Opening...' : 'Get Started'}
            </button>
        </div>
    )
}
```

---

## **Step 6: Full Component Example (Sending Tokens)**

Once connected, you can use the same hook to perform actions like sending tokens.

```tsx
import { useWallet } from 'column-catalogue';
import { useState } from 'react';

export function SimpleWallet() {
  const { isConnected, openModal, address, balance, signAndSend } = useWallet();
  const [recipient, setRecipient] = useState("");

  if (!isConnected) {
    // 🟢 Reuse the trigger logic here
    return <button onClick={openModal}>Connect with Passkey</button>;
  }

  const sendToken = async () => {
    try {
      await signAndSend({
        function: '0x1::aptos_account::transfer',
        functionArguments: [recipient, "1000000"], // 0.01 MOVE
        typeArguments: []
      });
      alert("Sent!");
    } catch(err) {
      alert("Failed!");
    }
  };

  return (
    <div>
      <h1>Welcome, {address}</h1>
      <p>Balance: {balance?.formatted} MOVE</p>
      
      <input 
        placeholder="Recipient Address" 
        onChange={(e) => setRecipient(e.target.value)} 
      />
      <button onClick={sendToken}>Send 0.01 MOVE</button>
    </div>
  );
}
```

---
---

# **📚 Reference: Hook Dictionary**

Below is a complete reference of every tool provided by the `useWallet` hook, separated from the integration steps above.

### **1. `connect()` vs `openModal()`**
*   **`openModal()` IS RECOMMENDED**: It opens the official UI which lets users choose between "Create New", "Login", or "Import".
*   **`connect()`**: A lower-level trigger for the default flow. Use `openModal` for the best UX.
*   **Usage:** Attach this to your "Connect Wallet" button.

### **2. `signAndSend(payload)`**
*   **What it does:** The most critical function. It requests the user to sign a transaction using their face/fingerprint.
*   **Input:** An object containing the Move function to call and its arguments.
*   **Returns:** A Promise that resolves to the Transaction Result (`hash`, `success`).
*   **Security:** This never exposes the private key. The signing happens inside the secure enclave.

**Example:**
```tsx
import { useWallet } from 'column-catalogue';

export function Sender() {
    const { signAndSend } = useWallet();

    const handleSend = async () => {
        const result = await signAndSend({
            function: '0x1::aptos_account::transfer',
            functionArguments: ['0x123...abc', '100000'], 
            typeArguments: []
        });
        console.log("Success:", result.hash);
    };
    
    return <button onClick={handleSend}>Send</button>;
}
```

### **3. `checkBalance()`**
*   **What it does:** Manually refreshes the user's balance from the blockchain.
*   **Usage:** Call this after a successful transaction to update the UI immediately.

**Example:**
```tsx
import { useWallet } from 'column-catalogue';

export function Refresher() {
    const { checkBalance } = useWallet();

    const handleRefresh = async () => {
        await checkBalance();
        console.log("Balance updated!");
    };
    
    return <button onClick={handleRefresh}>Refresh Balance</button>;
}
```

### **4. `exportKey()`**
*   **What it does:** A developer tool to reveal the raw private key.
*   **Security:** Requires re-authentication (biometrics) before revealing.
*   **Warning:** Only use this for debugging or advanced migration flows.

**Example: `src/components/SecurityTools.tsx`**

```tsx
import { useWallet } from 'column-catalogue';

export function SecurityTools() {
    const { exportKey, isConnected } = useWallet();

    const handleExport = async () => {
        if (!isConnected) return;
        
        // 1. Confirm Intent
        if (confirm("WARNING: Export private key?")) {
            try {
                // 2. Trigger Biometric Auth to Reveal
                const key = await exportKey();
                alert(`Your Private Key:\n\n${key}`);
            } catch (err) {
                console.error("Export cancelled");
            }
        }
    }

    return (
        <button onClick={handleExport}>
            Export Private Key
        </button>
    );
}
```

### **5. `importWallet(privateKey)`**
*   **What it does:** Imports an existing private key and binds it to a NEW passkey on the current device.
*   **Use Case:** Migrating a wallet from one domain (e.g., localhost:3000) to another (e.g., mysite.com).

**Example:**
```tsx
import { useWallet } from 'column-catalogue';

export function Importer() {
    const { importWallet } = useWallet();

    const handleImport = async () => {
        const key = prompt("Paste Private Key:");
        if(key) {
            await importWallet(key);
            alert("Wallet Imported & Secured with Passkey!");
        }
    };
    
    return <button onClick={handleImport}>Import Wallet</button>;
}
```
When you create a wallet with this SDK, two separate things are saved in two different places:

1. The "Key to the Vault" (FIDO2 Credential)
Where: Inside the device's Secure Enclave / TPM (Hardware Chip).
What: A private key that NEVER leaves the chip.
Function: This is what WebAuthn uses. It can only "sign" challenges if you pass a biometric check. It is useless without the hardware.
2. The "Vault Content" (Encrypted Blockchain Key)
Where: Inside the browser's IndexedDB (Software Storage).
What: Your actual Aptos Private Key (the one that controls your money), encrypted with AES-256.
Function: The SDK retrieves this encrypted blob. It then asks the Secure Enclave (item #1) to generate a decryption key. If the biometric check passes, it decrypts this blob in memory for a split second to sign the transaction, then wipes it.
The Magic Combo ✨
If a hacker steals your laptop file (IndexedDB), they get an encrypted blob they cannot open. If a hacker cuts out your TPM chip, they get a key that doesn't know about the blob. They need BOTH your physical device AND your face/finger to steal the funds. 🛡️


The Safety Net
This is why Exporting your Private Key (Step 4) sits behind a warning. You MUST back up your private key manually (write it down, save it elsewhere) if you plan to wipe your device or reset your biometrics. Without that manual backup, the funds are cryptographically gone forever. 🛡️
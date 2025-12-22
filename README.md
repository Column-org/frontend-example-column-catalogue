# 🏦 Column Catalogue | React Client

A premium, industrial React implementation demonstrating the power of the **Column Catalogue SDK** on the Movement Network. This template serves as a reference for building secure, passkey-native decentralized applications (dApps).

## 🚀 Key Features

-   **Passkey Native**: Full biometric login (FaceID/TouchID) using WebAuthn.
-   **On-Chain Bio**: A full-stack example of interacting with a custom Move smart contract to register user profiles.
-   **Transaction Engine**: Real-time MOVE transfers with industrial toast notifications.
-   **Explorer Integration**: Direct links to the Movement Explorer for every transaction.
-   **Zero-Seed Phrase**: Users never handle raw mnemonics; keys are encrypted and stored via IndexedDB and secured by the device hardware.

## 📂 File Arrangement & Architecture

The project follows a modular React component structure designed for scalability:

```text
/src
├── components/          
│   ├── alert/           # Industrial Toast Notification System
│   │   └── AlertProvider.tsx 
│   ├── bio/             # Full Smart Contract Module
│   │   └── BioAction.tsx
│   ├── Header.tsx       # Branding and global ConnectButton
│   ├── ConnectButton.tsx# Context-aware connection trigger
│   ├── Dashboard.tsx    # Main layout for connected state
│   ├── TransferAction.tsx # MOVE transfer form logic
│   └── LedgerAction.tsx   # Generic on-chain call example
├── config/              # Environment configurations
├── services/            # ABI and Contract Definitions
├── main.tsx             # Entry point + SDK Provider setup
├── App.tsx              # View orchestration
└── index.css            # Industrial Design System (Minimalist)
```

## 🧩 **Components Reference**

### **1. AlertProvider (`src/components/alert/AlertProvider.tsx`)**
A Context-based notification system that replaces native alerts with industrial-style toasts.
*   **Features**: Auto-dismiss, success/error states, Explorer Hash Links.
*   **Usage**: Wraps the entire app in `main.tsx`.

```tsx
const { showAlert } = useAlert();
showAlert('Transaction Submitted!', 'success', '0x123...hash');
```

### **2. BioAction (`src/components/bio/BioAction.tsx`)**
A complete module for interacting with the `onchain_bio` smart contract.
*   **Reads State**: Fetches the user's current bio from the blockchain.
*   **Writes State**: Signs a transaction to register/update the bio.
*   **Logic**: Demonstrates complex smart contract interaction using `signAndSend`.

### **3. TransferAction (`src/components/TransferAction.tsx`)**
A polished UI for sending native MOVE tokens.
*   **Features**: Input validation, Octa conversion, real-time balance updates.

### **4. WalletConnect (`src/components/WalletConnect.tsx`)**
Displays wallet identity with usability enhancements.
*   **Features**: Truncated address, **Click-to-Copy** functionality, Logout button.

## 🛠️ SDK Integration Guide

### 1. Wrap your App
Initialize the `CatalogueProvider` at the root of your application.

```tsx
import { CatalogueProvider } from 'column-catalogue';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <CatalogueProvider network="testnet">
    <AlertProvider>
      <App />
    </AlertProvider>
  </CatalogueProvider>
);
```

### 2. Access the Wallet Hook
Use the `useWallet` hook in any component to access the user's state and methods.

```tsx
import { useWallet } from 'column-catalogue';

const { address, balance, signAndSend, isConnected } = useWallet();
const { showAlert } = useAlert();
```

## 🏗️ Getting Started

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Port Migration Note
If you created a wallet in the **SDK Test Lab** (port 8000) and want to use it here:
1.  Export the Private Key from the Test Lab.
2.  Click **Connect** in this app.
3.  Choose **"Import using Private Key"** at the bottom of the modal.
4.  Paste your key to link it to this port!

## 🛡️ Security Architecture (Zero-Knowledge Model)

Column Catalogue uses an industrial-grade security model where private keys are never stored in plain text and are cryptographically bound to the physical device.

### 1. Hardware-Bound Entropy
When a wallet is created, the SDK generates a **WebAuthn Passkey**. The unique `credentialId` is stored in the device's **Secure Enclave/TPM**. The wallet cannot be unlocked without a successful biometric challenge (FaceID/TouchID) on the actual hardware.

### 2. PBKDF2 Key Derivation
The SDK derives a unique encryption key using **PBKDF2 (Password-Based Key Derivation Function 2)**:
- **100,000 Iterations**: High computational cost makes brute-forcing impossible.
- **Unique Salt**: Every wallet has its own 32-byte random salt.
- **AES-256 Key**: Resulting in a high-entropy symmetric key.

### 3. AES-256-GCM Encryption
Private keys are encrypted using **AES-256-GCM**. Every save uses a fresh random **IV**.

### 4. Same-Origin Storage
The encrypted payload is stored in **IndexedDB**, protected by the browser's **Same-Origin Policy**.

---
Built by **Joseph Sunday (Nile_Dex)**
[NPM Package](https://www.npmjs.com/package/column-catalogue) | [Documentation](./DOCUMENTATION.md)

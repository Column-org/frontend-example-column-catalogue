# 🔐 Internal Google Auth Integration (SDK Level)

This guide details how to bake **Google Sign-In** directly into the `column-catalogue` SDK, so developers don't have to manually implement it in their React apps.

**Goal:** The `CatalogueModal` (inside the SDK) should automatically show a "Sign in with Google" button.

---

## **Step 1: Install Dependencies in SDK**

Navigate to the SDK root (`c:\Users\josep\Desktop\cataloguge`) and install the Google library.

```bash
npm install @react-oauth/google jwt-decode
```

---

## **Step 2: Update `CatalogueProvider.tsx`**

We need to wrap the internal context with `GoogleOAuthProvider` so the modal can access it.

**File:** `src/react/CatalogueProvider.tsx`

```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

// Add clientId to props
interface CatalogueProviderProps {
    // ... existing props
    googleClientId?: string; // New Optional Prop
}

export const CatalogueProvider: React.FC<CatalogueProviderProps> = ({
    children,
    googleClientId,
    // ...
}) => {
    // ... existing logic

    const content = (
        <CatalogueContext.Provider value={value}>
            {children}
            <CatalogueModal
                 // ... pass props
            />
        </CatalogueContext.Provider>
    );

    // Conditionally wrap if Google Client ID is provided
    if (googleClientId) {
        return (
            <GoogleOAuthProvider clientId={googleClientId}>
                {content}
            </GoogleOAuthProvider>
        );
    }

    return content;
};
```

---

## **Step 3: Update `CatalogueModal.tsx`**

Now, add the Google Login button directly inside the Modal UI.

**File:** `src/react/components/CatalogueModal.tsx`

```tsx
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export const CatalogueModal = ({ onConnect, ... }) => {
    
    const handleGoogleSuccess = async (credentialResponse: any) => {
        const decoded: any = jwtDecode(credentialResponse.credential);
        console.log("Google User:", decoded.email);
        
        // TRIGGER KEYLESS FLOW:
        // Instead of creating a local Passkey, we use the ID Token to generating a Keyless Account.
        // This bypasses the biometric prompt entirely.
        await onConnect({ type: 'google', idToken: credentialResponse.credential }); 
    };

    return (
        <div style={styles.modal}>
            {/* ... Header ... */}
            
            <div style={styles.content}>
                
                {/* 1. Google Button (Top Priority) */}
                <div style={{ marginBottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log('Login Failed')}
                        theme="filled_black"
                        shape="pill"
                        text="continue_with"
                    />
                </div>

                <div style={{ margin: '10px 0', color: '#ccc', fontSize: '12px' }}>— OR —</div>

                {/* 2. Existing Anonymous Button */}
                <button onClick={onConnect} style={styles.primaryButton}>
                    Continue with Passkey (Anonymous)
                </button>

            </div>
        </div>
    );
};
```

---

## **Step 4: Developer Usage (The End User)**

When a developer uses your SDK, they just pass their Client ID to the Provider. They don't need to write any Google Auth code!

```tsx
// Developer's App (src/main.tsx)
<CatalogueProvider 
    network="testnet" 
    googleClientId="123456-abcde.apps.googleusercontent.com" // <--- simpler!
>
    <App />
</CatalogueProvider>
```

---

## **Step 5: Conceptual Architecture (Dual-Login System)**

It is critical to understand that enabling Google Auth creates a **Dual-Login System** with two distinct security models. The user chooses their path at the modal level:

### **Path A: Google Sign-In (Keyless)**
*   **User Experience**: "Sign in with Google" -> Wallet opens.
*   **Technology**: **Aptos Keyless (ZK-Login)**.
*   **Security**: The Google Account *is* the key. No Passkeys or Biometrics are involved.
*   **Persistence**: **Automatic Cross-Device Sync**. If the user logs in with the same Google Pass on a phone, laptop, or tablet, they access the **SAME** wallet address.
*   **Trade-off**: Relies on Google's security (2FA) and ZK Provers.

### **Path B: Passkey (Device-Bound)**
*   **User Experience**: "Anonymous Passkey" -> FaceID/Fingerprint -> Wallet opens.
*   **Technology**: **WebAuthn** + Hardware Secure Enclave.
*   **Security**: The Physical Device + Biometrics *is* the key. Google is not involved.
*   **Persistence**: **Device-Bound**. A wallet created on Device A exists *only* on Device A.
*   **Trade-off**: Maximum privacy and self-custody, but requires manual key export to sync devices.

### **Summary for Developers**
By passing `googleClientId`, you empower users to choose:
1.  **Convenience**: Google (Keyless) for easy, consistent access across devices.
2.  **Privacy**: Anonymous Passkey for users who prefer hardware-bound, non-traceable security.

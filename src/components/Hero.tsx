import { useWallet } from 'column-catalogue'

export function Hero() {
    const { openModal, isConnecting } = useWallet()

    return (
        <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Seamless On-Chain<br />Wallets
            </h1>
            <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto 2.5rem auto' }}>
                Experience the Movement Network without seed phrases. Securely managed by your device biometrics.
            </p>

            <button
                onClick={() => openModal()}
                disabled={isConnecting}
                style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', fontWeight: '700', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)' }}
            >
                {isConnecting ? 'Opening Passkey...' : 'Get Started'}
            </button>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', color: '#999', fontSize: '0.8rem' }}>
                <div>✦ Passkey Secure</div>
                <div>✦ Gas Efficient</div>
                <div>✦ Movement Native</div>
            </div>
        </div>
    )
}

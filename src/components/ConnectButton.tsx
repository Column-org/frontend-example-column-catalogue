import { useWallet } from 'column-catalogue'

export function ConnectButton() {
    const { openModal, isConnected, isConnecting, address } = useWallet()

    if (isConnected) {
        return (
            <div style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                background: '#f5f5f5',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                color: '#666'
            }}>
                {address?.slice(0, 4)}...{address?.slice(-4)}
            </div>
        )
    }

    return (
        <button
            onClick={() => openModal()}
            disabled={isConnecting}
            style={{
                padding: '0.5rem 1.2rem',
                fontSize: '0.85rem',
                borderRadius: '20px',
                background: '#000',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
            }}
        >
            {isConnecting ? '...' : 'Connect'}
        </button>
    )
}

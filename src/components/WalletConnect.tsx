import { useWallet } from 'column-catalogue'
import { useAlert } from './alert/AlertProvider'

export function WalletConnect() {
    const {
        address,
        disconnect,
        balance
    } = useWallet()
    const { showAlert } = useAlert()

    const copyAddress = () => {
        if (!address) return
        navigator.clipboard.writeText(address)
        showAlert('Address copied to clipboard', 'info')
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fcfcfc',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #efefef'
        }}>
            <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Connected Address
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="address-box" style={{ border: 'none', background: 'none', padding: 0, margin: 0, color: '#000', fontSize: '0.9rem' }}>
                        {address?.slice(0, 6)}...{address?.slice(-6)}
                    </div>
                    <button
                        onClick={copyAddress}
                        style={{
                            all: 'unset',
                            cursor: 'pointer',
                            color: '#bbb',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#bbb'}
                        title="Copy Address"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                    {balance?.formatted || '0.00'} <span style={{ fontSize: '0.8rem', fontWeight: '400' }}>MOVE</span>
                </div>
                <button
                    onClick={() => disconnect()}
                    style={{
                        background: 'none',
                        color: '#ff4d4d',
                        border: 'none',
                        padding: 0,
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '4px'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

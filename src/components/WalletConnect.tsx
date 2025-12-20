import { useWallet } from 'column-catalogue'

export function WalletConnect() {
    const {
        address,
        disconnect,
        balance
    } = useWallet()

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
                <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: '700', textTransform: 'uppercase' }}>
                    Connected Address
                </div>
                <div className="address-box" style={{ border: 'none', background: 'none', padding: 0, marginTop: '2px', color: '#000' }}>
                    {address?.slice(0, 6)}...{address?.slice(-4)}
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

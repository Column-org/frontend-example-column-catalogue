import { ConnectButton } from './ConnectButton'

export function Header() {
    return (
        <header style={{
            marginBottom: '4rem',
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderBottom: '1px solid #f0f0f0',
            boxSizing: 'border-box',
            background: 'transparent'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                    width: '10px',
                    height: '10px',
                    background: 'currentColor',
                    borderRadius: '2px'
                }}></div>
                <h1 style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: '900',
                    letterSpacing: '0.2rem',
                    color: 'inherit'
                }}>
                    COLUMN CATALOGUE
                </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    color: '#888',
                    letterSpacing: '0.15rem',
                    textTransform: 'uppercase'
                }}>
                    Movement
                </div>
                <ConnectButton />
            </div>
        </header>
    )
}

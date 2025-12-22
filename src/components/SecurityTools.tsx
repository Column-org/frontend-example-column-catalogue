import { useWallet } from 'column-catalogue'

export function SecurityTools() {
    const { exportKey, isConnected, address } = useWallet()

    const handleExport = async () => {
        if (!address) return

        if (confirm("WARNING: Only export your private key if you understand the risks. Never share it with anyone. Continue?")) {
            try {
                const key = await exportKey()
                await navigator.clipboard.writeText(key)
                alert("Private Key Copied to Clipboard! (Keep it safe)")
            } catch (err) {
                console.error("Export failed:", err)
            }
        }
    }

    return (
        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <button
                onClick={handleExport}
                disabled={!isConnected}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#999',
                    fontSize: '0.8rem',
                    textDecoration: 'underline',
                    cursor: isConnected ? 'pointer' : 'default'
                }}
            >
                Export Private Key (Developer Tool)
            </button>
        </div>
    )
}

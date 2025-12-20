import { useState } from 'react'
import { useWallet } from 'column-catalogue'

export function TransferAction() {
    const { balance, signAndSend, checkBalance } = useWallet()
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTransfer = async () => {
        if (!recipient || !amount) {
            alert('Please enter recipient and amount')
            return
        }

        setLoading(true)
        try {
            // Convert MOVE to Octas (1 MOVE = 100,000,000 Octas)
            const octas = (parseFloat(amount) * 100_000_000).toString()

            const res = await signAndSend({
                function: '0x1::aptos_account::transfer',
                functionArguments: [recipient, octas],
                typeArguments: []
            })

            console.log("Transfer Success:", res.hash)
            alert(`Transfer Successful! TX Hash: ${res.hash}`)

            // Clear inputs
            setRecipient('')
            setAmount('')

            // Refresh balance
            setTimeout(checkBalance, 2000)
        } catch (err: any) {
            console.error("Transfer failed:", err)
            alert("Transfer failed: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            background: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'left'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>TRANSFER MOVE</span>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>Bal: {balance?.formatted || '0'} MOVE</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>RECIPIENT ADDRESS</label>
                    <input
                        type="text"
                        placeholder="0x..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        style={{
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '1px solid #eee',
                            fontSize: '0.85rem'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>AMOUNT (MOVE)</label>
                    <input
                        type="number"
                        placeholder="0.1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '1px solid #eee',
                            fontSize: '0.85rem'
                        }}
                    />
                </div>

                <button
                    onClick={handleTransfer}
                    disabled={loading || !recipient || !amount}
                    style={{
                        padding: '1rem',
                        background: '#000',
                        color: '#fff',
                        borderRadius: '12px',
                        fontWeight: '700',
                        border: 'none',
                        marginTop: '0.5rem',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Processing...' : 'Send MOVE'}
                </button>
            </div>
        </div>
    )
}

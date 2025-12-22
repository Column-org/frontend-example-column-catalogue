import { useState, useEffect, useCallback } from 'react'
import { useWallet } from 'column-catalogue'
import { useAlert } from '../alert/AlertProvider'
import { ABI } from '../../services/onchainbio'
import { aptosClient } from '../../config/column'

export function BioAction() {
    const { address, signAndSend, isConnected } = useWallet()
    const { showAlert } = useAlert()
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentBio, setCurrentBio] = useState<{ name: string, bio: string } | null>(null)
    const [fetching, setFetching] = useState(false)

    const fetchBio = useCallback(async () => {
        if (!address) return
        setFetching(true)
        try {
            const resource = await aptosClient.getAccountResource({
                accountAddress: address,
                resourceType: `${ABI.address}::${ABI.name}::Bio`
            })
            if (resource) {
                setCurrentBio(resource as any)
            }
        } catch (err) {
            // 404 is expected if bio doesn't exist yet
            console.log("No bio found yet for this account")
            setCurrentBio(null)
        } finally {
            setFetching(false)
        }
    }, [address])

    useEffect(() => {
        if (isConnected && address) {
            fetchBio()
        }
    }, [isConnected, address, fetchBio])

    const handleRegister = async () => {
        if (!name || !bio) {
            showAlert('Please enter your name and bio', 'info')
            return
        }

        setLoading(true)
        try {
            const res = await signAndSend({
                function: `${ABI.address}::${ABI.name}::register`,
                functionArguments: [name, bio],
                typeArguments: []
            })

            console.log("Bio Registered Success:", res.hash)
            showAlert(`Bio Registered Successfully!`, 'success', res.hash)

            // Clear inputs and refresh view
            setName('')
            setBio('')

            // Refresh bio after delay for indexer
            setTimeout(fetchBio, 2000)
        } catch (err: any) {
            console.error("Registration failed:", err)
            showAlert(err.message || "Registration failed", 'error')
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
            textAlign: 'left',
            marginTop: '1.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>ON-CHAIN BIO</span>
                {fetching && <span style={{ fontSize: '0.7rem', color: '#6366f1' }}>Syncing...</span>}
            </div>

            {currentBio && (
                <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderLeft: '4px solid #6366f1'
                }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e293b' }}>{currentBio.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>"{currentBio.bio}"</div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>FULL NAME</label>
                    <input
                        type="text"
                        placeholder="Satishi Nakamuto"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '1px solid #eee',
                            fontSize: '0.85rem'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>BIO DESCRIPTION</label>
                    <textarea
                        placeholder="Building the future of Passkey wallets..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        style={{
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '1px solid #eee',
                            fontSize: '0.85rem',
                            minHeight: '80px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button
                    onClick={handleRegister}
                    disabled={loading || !name || !bio}
                    style={{
                        padding: '1rem',
                        background: '#6366f1',
                        color: '#fff',
                        borderRadius: '12px',
                        fontWeight: '700',
                        border: 'none',
                        marginTop: '0.5rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'opacity 0.2s'
                    }}
                >
                    {loading ? 'Processing...' : (currentBio ? 'Update On-Chain Bio' : 'Register Bio')}
                </button>
            </div>
        </div>
    )
}

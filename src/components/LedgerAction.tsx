import { useWallet } from 'column-catalogue'
import { useAlert } from './alert/AlertProvider'

export function LedgerAction() {
    const { signAndSend, isConnected } = useWallet()
    const { showAlert } = useAlert()

    const handleAction = async () => {
        try {
            // Example: 0 MOVE transfer to self to demonstrate on-chain activity
            const res = await signAndSend({
                function: '0x1::aptos_account::transfer',
                functionArguments: ['0x1', '0'], // Placeholder call
                typeArguments: []
            })
            console.log("On-Chain Success:", res.hash)
            showAlert(`Success! Transaction submitted.`, 'success', res.hash)
        } catch (err: any) {
            console.error("Action failed:", err)
            showAlert(err.message || "Action failed", 'error')
        }
    }

    return (
        <button
            onClick={handleAction}
            disabled={!isConnected}
            style={{ width: '100%', marginTop: '0.5rem' }}
        >
            Submit On-Chain Action
        </button>
    )
}

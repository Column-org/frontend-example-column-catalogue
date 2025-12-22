import { WalletConnect } from './WalletConnect'
import { TransferAction } from './TransferAction'
import { BioAction } from './bio/BioAction'
import { LedgerAction } from './LedgerAction'
import { SecurityTools } from './SecurityTools'

export function Dashboard() {
    return (
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            {/* Wallet Identity Section */}
            <section>
                <div style={{ color: '#999', fontSize: '0.8rem', marginBottom: '0.5rem', textAlign: 'left' }}>
                    WALLET IDENTITY
                </div>
                <WalletConnect />
            </section>

            {/* Bio Section */}
            <section>
                <BioAction />
            </section>

            {/* Transfer Section */}
            <section>
                <TransferAction />
            </section>

            {/* Action Section */}
            <section>
                <div style={{ color: '#999', fontSize: '0.8rem', marginBottom: '0.5rem', textAlign: 'left' }}>
                    ON-CHAIN ACTIONS
                </div>
                <LedgerAction />
            </section>

            {/* Security Section */}
            <section>
                <SecurityTools />
            </section>
        </main>
    )
}

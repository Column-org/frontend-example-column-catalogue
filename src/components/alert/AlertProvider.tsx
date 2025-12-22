import React, { createContext, useContext, useState, useCallback } from 'react';

export type AlertType = 'success' | 'error' | 'info';

interface AlertMessage {
    id: string;
    message: string;
    type: AlertType;
    hash?: string;
}

interface AlertContextType {
    showAlert: (message: string, type: AlertType, hash?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error('useAlert must be used within AlertProvider');
    return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertMessage[]>([]);

    const showAlert = useCallback((message: string, type: AlertType, hash?: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setAlerts(prev => [...prev, { id, message, type, hash }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setAlerts(prev => prev.filter(a => a.id !== id));
        }, 5000);
    }, []);

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '360px',
                width: '100%'
            }}>
                {alerts.map(alert => (
                    <div key={alert.id} style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        border: `1px solid ${alert.type === 'error' ? '#fee2e2' : alert.type === 'success' ? '#dcfce7' : '#f3f4f6'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        animation: 'slideIn 0.3s ease-out forwards',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: alert.type === 'error' ? '#991b1b' : alert.type === 'success' ? '#166534' : '#1f2937',
                                lineHeight: '1.4'
                            }}>
                                {alert.message}
                            </div>
                            <button
                                onClick={() => removeAlert(alert.id)}
                                style={{
                                    all: 'unset',
                                    cursor: 'pointer',
                                    color: '#bbb',
                                    fontSize: '1.2rem',
                                    lineHeight: 1,
                                    padding: '0 4px'
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        {alert.hash && (
                            <a
                                href={`https://explorer.movementnetwork.xyz/txn/${alert.hash}?network=testnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#6366f1',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                View on Explorer ↗
                            </a>
                        )}

                        <div style={{
                            height: '3px',
                            background: alert.type === 'error' ? '#ef4444' : alert.type === 'success' ? '#22c55e' : '#6366f1',
                            width: '100%',
                            borderRadius: '1px',
                            opacity: 0.2,
                            marginTop: '4px'
                        }} />
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </AlertContext.Provider>
    );
};

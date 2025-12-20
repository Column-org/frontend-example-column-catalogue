import { getAptosClient } from 'column-catalogue';

export const COLUMN_CONFIG = {
    network: 'testnet' as const,
    rpcUrl: 'https://testnet.movementnetwork.xyz/v1',
    username: 'Developer'
};

// Global client instance for core SDK calls
export const aptosClient = getAptosClient(COLUMN_CONFIG.network, COLUMN_CONFIG.rpcUrl);

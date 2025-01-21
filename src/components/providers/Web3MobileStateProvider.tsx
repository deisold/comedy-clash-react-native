"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isWriteProvider, getNetwork, getSigner } from '../../utils/web3';
import { ethers, Provider, Signer } from 'ethers';
import { NEXT_PUBLIC_USE_MOCKDATA, NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID } from '@env';
import '@walletconnect/react-native-compat'
import { createAppKit, defaultConfig, useAppKitProvider } from '@reown/appkit-ethers-react-native'
import _ from 'lodash';

// 2. Create config
const metadata = {
    name: 'AppKit RN',
    description: 'AppKit RN Example',
    url: 'https://reown.com/appkit',
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
    redirect: {
        native: 'YOUR_APP_SCHEME://'
    }
}

const config = defaultConfig({ metadata })

// 3. Define your chains
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
}


const chains = [mainnet]
const projectId = NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// 4. Create modal
createAppKit({
    projectId,
    chains,
    config,
    enableAnalytics: false // Optional - defaults to your Cloud configuration
})

interface Web3MobileStateType {
    isMockData: boolean;
    provider: Provider | null;
    signer: Signer | null;
    walletAddress: string | null;
    networkId: number | null;
    isConnected: boolean;
    canWrite: boolean;
    isLoading: boolean;
    error: string | null;
}

export const Web3MobileStateContext = createContext<Web3MobileStateType | undefined>(undefined);

export function Web3MobileStateProvider({ children }: { children: ReactNode }) {
    const isMockData: boolean = JSON.parse(NEXT_PUBLIC_USE_MOCKDATA);

    const [state, setState] = useState<Web3MobileStateType>({
        isMockData,
        provider: null,
        signer: null,
        walletAddress: null,
        networkId: null,
        isConnected: false,
        canWrite: false,
        isLoading: true,
        error: null
    });

    const updateBlockchainState = async (provider: ethers.Provider | null) => {
        console.log(`Web3MobileStateProvider: updateBlockchainState: provider=${provider}`);

        try {
            const network = await getNetwork(provider);
            const canWrite = isWriteProvider(provider);
            const signer = canWrite ? await getSigner(provider) : null;
            const walletAddress = signer ? await signer.getAddress() : null;
            console.log(`Web3MobileStateProvider: updateBlockchainState: canWrite=${canWrite}, signer=${signer}, walletAddress=${walletAddress}`);

            setState({
                isMockData,
                provider,
                signer,
                walletAddress: walletAddress,
                networkId: network?.chainId ? Number(network.chainId) : null,
                isConnected: !!walletAddress,
                canWrite,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error('Failed to update blockchain state:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: (error as Error).message
            }));
        }
    };

    const { walletProvider } = useAppKitProvider();
    useEffect(() => {
        console.log(`Web3MobileStateProvider: walletProvider: ${walletProvider}, isMockData: ${isMockData}`);
        if (isMockData) {
            console.log(`Web3MobileStateProvider: using MockData: provider=null`);
            updateBlockchainState(null);    
        } else {
            const provider = walletProvider ? new ethers.BrowserProvider(walletProvider) : null;
            console.log(`Web3MobileStateProvider: using BrowserProvider: ${provider}`);
            updateBlockchainState(provider);
        }
    }, [walletProvider]);

    Web3MobileStateContext.displayName = 'BlockchainStateContext';

    return (
        <Web3MobileStateContext.Provider
            value={{
                ...state,
            }}
        >
            {children}
        </Web3MobileStateContext.Provider>
    );
}

export function useBlockchainState() {
    const context = useContext(Web3MobileStateContext);
    if (context === undefined) {
        throw new Error('Web3MobileStateProvider: useBlockchainState must be used within a BlockchainStateProvider');
    }
    return context;
}

import { ethers, Network, Signer } from "ethers";

import { EthereumProvider } from "@walletconnect/ethereum-provider";
/**
 * Initializes a Web3 z using either MetaMask or Infura fallback
 * @returns {Promise<ethers.Provider>} The initialized provider
 */
export async function initWeb3Provider(): Promise<ethers.Provider> {
    let provider: ethers.Provider | null = null;

    console.log(`initWeb3Provider: INFURA_ENDPOINT=${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`);

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ethereum = (window as any).ethereum;

        if (typeof window !== 'undefined' && ethereum) {
            // Use BrowserProvider (MetaMask)
            provider = new ethers.BrowserProvider(ethereum);
            console.log(`initWeb3Provider: using BrowserProvider(injected wallet)`);

            // Request account access
            await (ethereum.request({ method: 'eth_requestAccounts' }));
        } else {

            try {
                const sepoliaTestnet = 11155111;
                const wcProvider = await EthereumProvider.init({
                    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
                    chains: [1, sepoliaTestnet], // mainnet and sepoliaTestnet
                    showQrModal: true
                });
                console.log("Enabling provider...");
                await wcProvider.enable();
                console.log("Provider enabled successfully");

                provider = new ethers.BrowserProvider(wcProvider);
            } catch {
                console.log(`initWeb3Provider: error using WalletConnect`);
            }

            // Fallback to read-only JsonRpcProvider
            console.log("initWeb3Provider: using JsonRpcProvider(infura)");
            if (!provider) {
                provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_ENDPOINT as string);
            }
        }

        console.log(`initWeb3Provider: Provider initialized successfully: provider=${provider}`);
        return provider;
    } catch {
        console.error('initWeb3Provider: Failed to initialize provider');
        throw new Error('Failed to initialize provider');
    }
}

/**
 * Checks if the provider is a write-enabled provider (MetaMask)
 * @param {ethers.Provider} provider The provider to check
 * @returns {boolean}
 */
export function isWriteProvider(provider: ethers.Provider): boolean {
    return provider instanceof ethers.BrowserProvider;
}

/**
 * Gets the current signer if available
 * @param {ethers.Provider} provider The provider to get the signer from
 * @returns {Promise<ethers.Signer|null>}
 */
export async function getSigner(provider: ethers.Provider): Promise<Signer | null> {
    if (!isWriteProvider(provider)) return null;
    try {
        return await (provider as ethers.BrowserProvider).getSigner();
    } catch (error) {
        console.error('getSigner: Failed to get signer', error);
        return null;
    }
}

/**
 * Gets the current network details
 * @param {ethers.Provider} provider The provider to get the network from
 * @returns {Promise<Network|null>}
 */
export async function getNetwork(provider: ethers.Provider): Promise<Network | null> {
    if (!provider) return null;
    try {
        return await provider.getNetwork();
    } catch (error) {
        console.error('getNetwork: Failed to get network', error);
        return null;
    }
}

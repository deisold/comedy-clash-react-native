import { ethers, Network, Signer } from "ethers";

/**
 * Checks if the provider is a write-enabled provider (MetaMask)
 * @param {ethers.Provider} provider The provider to check
 * @returns {boolean}
 */
export function isWriteProvider(provider: ethers.Provider | null): boolean {
    return provider instanceof ethers.BrowserProvider;
}

/**
 * Gets the current signer if available
 * @param {ethers.Provider} provider The provider to get the signer from
 * @returns {Promise<ethers.Signer|null>}
 */
export async function getSigner(provider: ethers.Provider | null): Promise<Signer | null> {
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
export async function getNetwork(provider: ethers.Provider | null): Promise<Network | null> {
    if (!provider) return null;
    try {
        return await provider.getNetwork();
    } catch (error) {
        console.error('getNetwork: Failed to get network', error);
        return null;
    }
}

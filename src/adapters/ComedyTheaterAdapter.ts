import { Provider, JsonRpcProvider, BrowserProvider, Signer } from "ethers";
import { ComedyTheater, ComedyTheater__factory } from "../utils/types";
import { ComedyTheaterAdapterType } from "./ComedyTheaterAdapterType";
import { isWriteProvider } from "../utils/web3";

export const ComedyTheaterAdapter = (web3Provider: Provider, signer: Signer | null, address: string): ComedyTheaterAdapterType => {
    let contractReadOnly: ComedyTheater | null = null;

    async function getContractReadOnly() {
        console.log(`getContractReadOnly: web3Provider isWriteProvider=${isWriteProvider(web3Provider)}`);
        contractReadOnly = contractReadOnly || ComedyTheater__factory.connect(address, web3Provider);
        return contractReadOnly;
    }

    async function getContractForWrite() {
        console.log(`getContractForWrite: web3Provider signers=${signer}`);
        if (!signer) throw new Error("Connection read-only!");

        return ComedyTheater__factory.connect(address, signer);
    }

    return {
        getShowAmount: async () => (await getContractReadOnly()).getShowAmount(),
        getShowAdress: async (index: number) => (await getContractReadOnly()).shows(index),
        addShow: async (description: string, durationInDays: number) => {
            return (await getContractForWrite()).addShow(description, durationInDays);
        },
        isManager: async () => {
            try {
                if (web3Provider instanceof JsonRpcProvider) {
                    return false;
                }
                const signer = await (web3Provider as BrowserProvider).getSigner();
                const currentAddress = await signer.getAddress();
                const managerAddress = await (await getContractReadOnly()).manager();
                return currentAddress.toLowerCase() === managerAddress.toLowerCase();
            } catch (error) {
                console.error('Error checking manager status:', error);
                return false;
            }
        }
    }
}
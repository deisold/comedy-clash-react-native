// frontend/src/adapters/ComedyTheaterAdapterType.ts
import {ContractTransactionResponse} from "ethers";

interface ComedyTheaterAdapterType {
    getShowAmount: () => Promise<bigint>;
    getShowAdress: (index: number) => Promise<string>;
    addShow: (description: string, durationInDays: number) => Promise<ContractTransactionResponse>;
    isManager: () => Promise<boolean>;
}

export type { ComedyTheaterAdapterType };
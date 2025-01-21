import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBlockchainState } from './Web3MobileStateProvider';
import { ComedyTheaterAdapter } from '../../adapters/ComedyTheaterAdapter';
import { MockComedyTheaterAdapter } from '../../adapters/MockComedyTheaterAdapter';
import { ComedyTheaterRepo, ComedyTheaterRepoType } from '../../repositories/ComedyTheaterRepo'
import { ComedyClashAdapter } from '../../adapters/ComedyClashAdapter';
import { MockComedyClashAdapter } from '../../adapters/MockComedyClashAdapter';
import { ComedyClashRepo, ComedyClashRepoType } from '../../repositories/ComedyClashRepo';
import { NEXT_PUBLIC_USE_MOCKDATA, NEXT_PUBLIC_COMEDY_THEATER_ADDRESS } from '@env';
import _ from 'lodash';

interface AppContextType {
    isLoading: boolean;
    comedyTheaterRepo: ComedyTheaterRepoType | null;
    comedyClashRepo: ComedyClashRepoType | null;
    isManager: boolean;
    error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [state, setState] = useState<{
        isLoading: boolean;
        error: unknown;
        comedyTheaterRepo: ComedyTheaterRepoType | null;
        comedyClashRepo: ComedyClashRepoType | null;
        isManager: boolean;
    }>({
        isLoading: true,
        error: null,
        comedyTheaterRepo: null,
        comedyClashRepo: null,
        isManager: false
    });

    const { isLoading: blockchainInitLoading, provider, signer, error: blockchainError } = useBlockchainState();
    console.log(`AppProvider: blockchainInitLoading=${blockchainInitLoading}`);


    console.log('Use Mock Data:', NEXT_PUBLIC_USE_MOCKDATA);
    const useMockData: boolean = JSON.parse(NEXT_PUBLIC_USE_MOCKDATA);
    const comedyTheaterAddress: string = NEXT_PUBLIC_COMEDY_THEATER_ADDRESS;

    useEffect(() => {
        const init = async () => {
            console.log(`AppProvider: init: blockchainInitLoading=${blockchainInitLoading}`);

            const isReady: boolean = !blockchainInitLoading && (useMockData || !_.isNil(provider));
            console.log(`AppProvider: init: isReady=${isReady}`);

            if (!isReady) {
                console.log(`AppProvider: init: (re)setting state`);
                setState({
                    isLoading: false,
                    error: null,
                    comedyTheaterRepo: null,
                    comedyClashRepo: null,
                    isManager: false
                });
                return; // Wait until the blockchain state is ready
            }

            if (blockchainError) {
                setState(prev => ({
                    ...prev,
                    error: blockchainError
                }));
                return;
            }

            try {
                console.log(`AppProvider: init: provider=${provider}`);

                if (!comedyTheaterAddress) {
                    throw new Error('Comedy Theater contract address not configured');
                }

                const theaterRepo = ComedyTheaterRepo(
                    useMockData
                        ? MockComedyTheaterAdapter()
                        : ComedyTheaterAdapter(provider!!, signer, comedyTheaterAddress)
                );

                const clashRepo = ComedyClashRepo(
                    provider!!,
                    signer,
                    useMockData ? MockComedyClashAdapter : ComedyClashAdapter
                );

                const isManager = await theaterRepo.isManager();
                console.log("isManager", isManager);

                setState({
                    isLoading: false,
                    error: null,
                    comedyTheaterRepo: theaterRepo,
                    comedyClashRepo: clashRepo,
                    isManager
                });
            } catch (error: any) {
                console.error('Failed to initialize repositories:', error);
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message || 'Failed to initialize application'
                }));
            }
        };

        init();
    }, [blockchainInitLoading, provider]);


    return (
        <AppContext.Provider value={{
            isLoading: state.isLoading,
            comedyTheaterRepo: state.comedyTheaterRepo,
            comedyClashRepo: state.comedyClashRepo,
            isManager: state.isManager,
            error: state.error?.toString() || null
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

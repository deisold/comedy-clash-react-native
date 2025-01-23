import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

import ConnectToBlockchainView from '../views/ConnectView';
import { useAppContext } from '../components/providers/AppProviders';
import { globalStyles } from '../views/Styles';

export default function HomeScreen() {

    const { isReady, comedyTheaterRepo, isManager } = useAppContext();
    const [showAmount, setShowAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            try {
                const amount: number = await comedyTheaterRepo!!.getShowAmount();
                console.log(`amount=${amount}`);
                setShowAmount(amount);
            } catch (err) {
                console.error(err);
            }
        };

        if (comedyTheaterRepo) {
            init();
        }
    }, [isReady, comedyTheaterRepo]);


    const handleAddShow = () => {
        console.log('handleAddShow');
    }

    const ready = isReady;

    return (
        <View style={globalStyles.containerPadding}>
            <Text style={[globalStyles.mainTitle, { textAlign: 'center' }]}>
                Welcome to the Comedy Clash
            </Text>

            {!ready ?
                <View style={styles.centeredContent}>
                    <ConnectToBlockchainView />
                </View>
                :
                isLoading ? <View style={styles.centeredContent}>
                    <Text>Loading...</Text>
                </View> :
                    <View style={styles.showContainer}>
                        <Text style={globalStyles.sectionTitle}>
                            The number of shows: {showAmount}
                        </Text>
                        <View style={{ alignSelf: 'center', display: isManager ? 'flex' : 'none' }}>
                            <Button title="Add new Show"
                                onPress={() => { handleAddShow() }}
                            />
                            
                        </View>
                    </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    mainTitle: {
        fontSize: 42,
        fontWeight: '600',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 10,
        paddingTop: 20,
    },

    centeredContent: {
        position: 'absolute', // Ensures it fills the entire screen
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center', // Centers vertically
        alignItems: 'center', // Centers horizontally
    },

    showContainer: {
        flex: 1, // Takes up the full remaining space of the screen
        justifyContent: 'space-between', // Centers vertically
        alignItems: 'flex-start', // Centers horizontally
    },

});
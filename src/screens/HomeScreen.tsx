import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, FlatList } from 'react-native';

import ConnectToBlockchainView from '../components/views/ConnectView';
import { useAppContext } from '../components/providers/AppProviders';
import { globalStyles } from '../components/views/Styles';
import { ShowListItemHeader, ShowListItemRow } from '../components/views/ShowListItem';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const HomeScreen = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'> }) => {
    const { isReady, comedyTheaterRepo, isManager } = useAppContext();
    const [showAmount, setShowAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [reloadKey, setReloadKey] = useState(0); // State to trigger re-render
    const [refreshing, setRefreshing] = useState(false); // Refreshing state

    useEffect(() => {
        //empty title
        navigation.setOptions({ title: '' });
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const amount: number = await comedyTheaterRepo!!.getShowAmount();
            console.log(`amount=${amount}, isManager=${isManager}`);
            setShowAmount(amount);
        } catch (err) {
            console.error(err);
        } finally {

            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (comedyTheaterRepo) {
            fetchData();
        }
    }, [isReady, comedyTheaterRepo]);

    const onRefresh = async () => {
        console.log(`HomeScreen: onRefresh=${reloadKey}`);

        setRefreshing(true);
        await fetchData(); // Reuse the fetch logic
        setRefreshing(false);
        setReloadKey(prevKey => prevKey + 1);
    };

    const handleAddShow = () => {
        navigation.navigate('CreateShow');
    }

    const handleShowDetails = (showAddress: string) => {
        console.log(`HomeScreen: handleShowDetails: showAddress=${showAddress}`);
        navigation.navigate('ShowDetails', { showAddress });
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
                    <View style={globalStyles.container}>
                        <Text style={globalStyles.sectionTitle}>
                            The number of shows: {showAmount}
                        </Text>
                        <ShowListItemHeader />
                        <FlatList
                            data={[...Array(showAmount).keys()].map(item => ({ id: item.toString(), value: item }))}
                            extraData={reloadKey} // Ensure this triggers re-render
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <ShowListItemRow index={item.value} onShowDetails={handleShowDetails} />}
                            refreshing={refreshing} // Pull-to-refresh state
                            onRefresh={onRefresh} // Call the refresh function on pull
                        />
                        <View style={[styles.bottomContainer, { display: isManager ? 'flex' : 'none' }]}>
                            <Button title="Add new Show"
                                onPress={() => { handleAddShow() }}
                            />
                        </View>

                        {/* <View style={styles.bottomContainer}>
                            <View style={{ alignSelf: 'center', display: isManager ? 'flex' : 'none' }}>
                                <Button title="Add new Show"
                                    onPress={() => { handleAddShow() }}
                                />
                            </View>
                        </View> */}
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
    bottomContainer: {
        alignSelf: 'center',
        marginTop: 12,
    }
});
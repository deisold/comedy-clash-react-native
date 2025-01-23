import React from 'react';
import { Text, View } from 'react-native';

import ConnectView from '../views/ConnectView';
import { useAppContext } from '../components/providers/AppProviders';

export default function HomeScreen() {

    const { isReady } = useAppContext();

    return (
        !isReady ? <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
            <ConnectView />
        </View> : <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
            <Text>Loading...</Text>
        </View>
    );
}

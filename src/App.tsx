/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
  Pressable,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { ethers, Network, Signer } from "ethers";

import '@walletconnect/react-native-compat'

import { AppKit, useAppKit } from '@reown/appkit-ethers-react-native'
import { useBlockchainState, Web3MobileStateProvider } from './components/providers/Web3MobileStateProvider';
import { AppProvider } from './components/providers/AppProviders';

const ConnectView = () => {
  const { open } = useAppKit()
  const { isConnected, isMockData } = useBlockchainState();
  const title = isMockData ? "Using Mock Data" : (isConnected ? "Connected" : "Connect");
  return (
    <>
      <Button
        onPress={() => open()}
        title={title}
        disabled={isMockData}
      />
    </>
  )
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  return (
    <>
      <Web3MobileStateProvider>
        <AppProvider>
          <SafeAreaView style={backgroundStyle}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />
            <View style={styles.sectionContainer}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: isDarkMode ? Colors.white : Colors.black,
                  },
                ]}>
                Hello World
              </Text>
              <ConnectView />
            </View>
          </SafeAreaView>
        </AppProvider>
      </Web3MobileStateProvider>
      <AppKit />
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

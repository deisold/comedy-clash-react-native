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

import { createAppKit, defaultConfig, AppKit, useAppKit, useAppKitProvider, useAppKitState } from '@reown/appkit-ethers-react-native'

// 1. Get projectId from https://cloud.reown.com
const projectId = '2a2aef42009eaf133a67788c2937b69c'

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

// 4. Create modal
createAppKit({
  projectId,
  chains,
  config,
  enableAnalytics: false // Optional - defaults to your Cloud configuration
})

function ConnectView() {
  const { open } = useAppKit()

  return (
    <>
      <Button onPress={() => open()} title="Open Connect Modal" />
    </>
  )
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const state = useAppKitState();
  const [bsProvider, setBsProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    // Optionally, handle side-effects or log state changes
    console.log('AppKit state:', state);
  }, [state]);

  const {walletProvider} = useAppKitProvider();
  useEffect(() => {
    console.log('walletProvider:', walletProvider);
    if (walletProvider) {
      const provider = new ethers.BrowserProvider(walletProvider);
      setBsProvider(provider);  
      console.log(`bsProvider: ${provider}`);
      
    }
  }, [walletProvider]);

  return (
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
        <ConnectView></ConnectView>
      </View>
      <AppKit />
    </SafeAreaView>

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

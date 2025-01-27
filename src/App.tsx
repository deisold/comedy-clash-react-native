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
  Appearance,
  ViewStyle,
  StyleProp,
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

import { AppKit } from '@reown/appkit-ethers-react-native'
import { Web3MobileStateProvider } from './components/providers/Web3MobileStateProvider';
import { AppProvider } from './components/providers/AppProviders';
import { enableScreens } from 'react-native-screens';
import RootNavigator from './navigation/RootNavigator';
import { ConnectionProvider } from './components/providers/ConnectionProvider';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
//
enableScreens();

function App(): React.JSX.Element {

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        line1NumberOfLines={2}
        text1Style={{
          fontSize: 18,
          fontWeight: '600'
        }}
        text2Style={{
          fontSize: 16,
          fontWeight: '400'
        }}
        text1='Success'
        
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: 'red' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        line1NumberOfLines={2}
        text1Style={{
          fontSize: 18,
          fontWeight: '600'
        }}
        text2Style={{
          fontSize: 16,
          fontWeight: '400'
        }}
        text1='Error'
      />
    ),
  };

  return (
    <>
      <Web3MobileStateProvider>
        <AppProvider>
          <RootNavigator />
        </AppProvider>
      </Web3MobileStateProvider>
      <AppKit />
      <Toast config={toastConfig} />
    </>
  );
}
// function App(): React.JSX.Element {
//   return (
//     <>
//       <Web3MobileStateProvider>
//         <AppProvider>
//           <SafeAreaView style={backgroundStyle}>
//             <StatusBar
//               barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//               backgroundColor={backgroundStyle.backgroundColor}
//             />
//             <RootNavigator />
//           </SafeAreaView>
//         </AppProvider>
//       </Web3MobileStateProvider>
//       <AppKit />
//     </>
//   );
// }

export default App;

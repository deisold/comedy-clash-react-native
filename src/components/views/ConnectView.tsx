import { Button, View, Text, StyleSheet } from "react-native";

import { useBlockchainState } from "../providers/Web3MobileStateProvider";
import { useAppKit } from "@reown/appkit-ethers-react-native";
import { globalStyles } from "./Styles";

export default function ConnectToBlockchainView() {
    const { open } = useAppKit()
    const { isConnected, isMockData } = useBlockchainState();
    const title = isMockData ? "Using Mock Data" : (isConnected ? "Connected" : "Connect");
    return (
        <View style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Text style={globalStyles.sectionTitle}>Connect to the blockchain</Text>
            <Button
                onPress={() => {
                    open()
                }}
                title={title}
                disabled={isMockData}
            />
        </View>
    )
}
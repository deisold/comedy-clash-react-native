import { RouteProp } from "@react-navigation/native";
import { useShowDetailsViewModel } from "./ShowDetailsViewModel";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { globalStyles } from "../../components/views/Styles";
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, Button, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { showToastSuccess, showToastError } from "../../utils/utils";
import { CreateShowViewModelEvent } from "../createShow/CreateShowViewModel";
import { ViewModelEvents } from "../../utils/CommonEvents";
import { SubmissionListItem } from "../../components/views/SubmissionListItem/SubmissionListItem";
import { useBlockchainState } from "../../components/providers/Web3MobileStateProvider";

export const ShowDetails = ({ route }: { route: RouteProp<RootStackParamList, 'ShowDetails'> }) => {
    const { showAddress } = route.params;
    const { canWrite, walletAddress } = useBlockchainState();

    const { loading, details, actions, error, eventEmitter } = useShowDetailsViewModel(showAddress);

    useEffect(() => {
        const handleSuccess = (event: ViewModelEvents) => {
            console.log(`handleSuccess: ${event.message}`);
            showToastSuccess(event.message);
        };

        const handleError = (event: CreateShowViewModelEvent) => {
            console.log(`handleError: ${event.message}`);
            showToastError(event.message);
        };

        // Attach the listeners
        eventEmitter.on('success', handleSuccess);
        eventEmitter.on('error', handleError);

        return () => {
            eventEmitter.removeAllListeners();
        };
    }, []); // Run only once on mount

    return (
        <View style={globalStyles.containerPadding}>
            <Text style={[globalStyles.mainTitle, { textAlign: 'center' }]}>
                Show Details
            </Text>
            {loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginBottom: 12 }}>Loading details...</Text>
                <ActivityIndicator animating={true} size="large" color={Colors.dark} />
            </View>}
            {error && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginBottom: 12 }}>Error loading details!</Text>
                <Button
                    title="Retry"
                    onPress={() => { actions.onRefresh() }}
                />
            </View>}
            {!loading && !error && <View>
                <View style={globalStyles.sheetContent}>
                    <Text style={globalStyles.sheetText}>{details.description}</Text>
                    <Text style={globalStyles.sheetText}>We got {details.submissionCount} submissions so far</Text>
                </View>
                <FlatList style={{ marginTop: 20 }}
                    data={details.submissions}
                    renderItem={({ item }) =>
                        <View style={{ marginTop: 8 }}>
                            <SubmissionListItem submission={item}
                                precision={details.precision}
                                isClosed={details.isClosed} />
                        </View>}
                />
            </View>}
        </View>
    );
}

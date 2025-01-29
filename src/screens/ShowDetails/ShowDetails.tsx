import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useShowDetailsViewModel } from "./ShowDetailsViewModel";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { globalStyles } from "../../components/views/Styles";
import React from "react";
import { View, Text, ActivityIndicator, Button, FlatList } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { SubmissionListItem } from "../../components/views/SubmissionListItem/SubmissionListItem";
import { useEventEmitter } from "@/components/views/common/useToastEventEmitter";

export const ShowDetails = ({ route, navigation }: { route: RouteProp<RootStackParamList, 'ShowDetails'>, navigation: NativeStackNavigationProp<RootStackParamList, 'ShowDetails'> }) => {
    const { showAddress } = route.params;
    const { loading, details, actions, error, eventEmitter } = useShowDetailsViewModel(showAddress);

    useEventEmitter(eventEmitter);

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
                            <SubmissionListItem submissionWithIndex={item}
                                precision={details.precision}
                                isClosed={details.isClosed}
                                navigateToCreateRating={() => {
                                    navigation.navigate('CreateRatingView',
                                        { showAddress: showAddress, submissionIndex: item.submissionIndex.toString() }
                                    );
                                }} />
                        </View>}
                />
            </View>}
        </View>
    );
}

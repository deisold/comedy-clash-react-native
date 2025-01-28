import { RouteProp } from "@react-navigation/native";
import { useShowDetailsViewModel } from "./ShowDetailsViewModel";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { globalStyles } from "../../components/views/Styles";
import React from "react";
import { View, Text, ActivityIndicator, Button, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";


const CardView = ({ title, description }: { title: string, description: string }) => {
    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: 'lightgray' }]}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardDescription: {
        fontSize: 16,
        lineHeight: 24,
    },
});

export const ShowDetails = ({ route }: { route: RouteProp<RootStackParamList, 'ShowDetails'> }) => {
    const { showAddress } = route.params;
    const { loading, details, actions, error } = useShowDetailsViewModel(showAddress);

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
                            <CardView title={item.name} description={item.topic} />
                        </View>}
                />
            </View>}
        </View>
    );
}

import React from "react";
import { View, Text, Button, StyleSheet, Keyboard } from "react-native";
import { useSubmissionListItemViewModel } from "./SubmissionListItemViewModel";
import { Submission } from "../../../data/submission";
import { useBlockchainState } from "@/components/providers/Web3MobileStateProvider";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SubmissionWithIndexType } from "@/screens/ShowDetails/ShowDetailsViewModel";

export const SubmissionListItem = ({ submissionWithIndex, precision, isClosed, navigateToCreateRating }: { submissionWithIndex: SubmissionWithIndexType, precision: bigint, isClosed: boolean, navigateToCreateRating: () => void }) => {
    const { state } = useSubmissionListItemViewModel(submissionWithIndex, precision, isClosed);
    const { canWrite } = useBlockchainState();

    return (
        <View style={[styles.card, { backgroundColor: 'lightgray' }]}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Artist: {state.name}</Text>
                <Text style={styles.cardDescription}>Topic: {state.topic}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>Preview: {state.preview}</Text>
                <View style={styles.voteContainer}>
                    <Ionicons name="heart-outline" size={24} style={{ marginRight: 2 }} />
                    <Text style={styles.cardDescription}>{state.averageValue} ({state.averageCount} votes)</Text>
                </View>

                {!state.isClosed && (
                    <View style={{ position: 'relative' }}>
                        <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
                            <Button title="Vote"
                                disabled={state.loading || !canWrite || !state.isVotable}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    navigateToCreateRating();
                                }} />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

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
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
});
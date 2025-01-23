import { useAppContext } from '../components/providers/AppProviders';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export function ShowListItemHeader() {
    return (
        <View style={styles.row}>
            <View style={[styles.column, { flex: 1 }]}>
                <Text>#</Text>
            </View>
            <View style={[styles.column, { flex: 3 }]}>
                <Text>Show</Text>
            </View>
            <View style={[styles.column, { flex: 2 }]}>
                <Text>Submissions</Text>
            </View>
            <View style={[styles.column, { flex: 3 }]} />
        </View>
    );
}

interface ShowDetailsState {
    address: string | null;
    description: string | null;
    isClosed: boolean;
    submissionCount: number;
}

export function ShowListItemRow({ index }: { index: number }) {
    const { comedyTheaterRepo, comedyClashRepo } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDetails, setShowDetails] = useState<ShowDetailsState>({
        address: null,
        description: null,
        isClosed: true,
        submissionCount: 0,
    });
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = async () => {
        console.log(`handleClose: address:${showDetails.address}`);
        setIsClosing(true);
        try {
            if (!comedyClashRepo || !showDetails.address) {
                return;
            }
            await comedyClashRepo.closeSubmission(showDetails.address);
            setShowDetails(prevDetails => ({
                ...prevDetails,
                isClosed: true
            }));
        } catch (error: any) {
            console.error('Error closing show:', error);
            // toast.error(error.message || 'Failed to close show');
        } finally {
            setIsClosing(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        const init = async () => {
            try {
                setLoading(true);
                setErrorMessage('');

                const showAddress = await comedyTheaterRepo!!.getShowAdress(index);

                if (controller.signal.aborted || !comedyClashRepo) return;

                const description = await comedyClashRepo.getDescription(showAddress);
                const isClosed = await comedyClashRepo.isClosed(showAddress);
                const submissionCount = await comedyClashRepo.getSubmissionCount(showAddress);

                if (controller.signal.aborted) return;

                setShowDetails({
                    address: showAddress,
                    description: description,
                    isClosed: isClosed,
                    submissionCount: submissionCount,
                });
            } catch (error: any) {
                if (controller.signal.aborted) return;

                console.error('Error loading show details:', error);
                setErrorMessage(error.message || 'Failed to load show details');
                // toast.error(error.message || 'Failed to load show details');
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        init();

        return () => controller.abort();
    }, [comedyTheaterRepo, comedyClashRepo, index]);

    return (
        loading ? <View style={styles.row}><Text>Loading...</Text></View> :
            <View style={styles.row}>
                <View style={[styles.column, { flex: 1 }]}>
                    <Text>{index}</Text>
                </View>
                <View style={[styles.column, { flex: 3 }]}>
                    <Text>{showDetails.description}</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                    <Text>{showDetails.submissionCount}</Text>
                </View>
                <View style={[styles.columnButtons, { flex: 3 }]}>
                    <View style={{ flexDirection: 'row', }}>
                        <Button
                            title="Show"
                            onPress={() => { }}
                            disabled={showDetails.address == null}
                        />
                        {!showDetails.isClosed && (
                            <>
                                <View style={[styles.stackContainer, { backgroundColor: Colors.red, borderRadius: 5 }]}>
                                    <Button
                                        title="Close"
                                        color="darkred"
                                        onPress={handleClose}
                                        disabled={showDetails.address == null || isClosing}
                                    />
                                    {isClosing && <View style={styles.overlay}>
                                        <ActivityIndicator animating={isClosing} size="small" color={Colors.dark} />
                                    </View>}

                                </View>

                            </>
                        )}
                    </View>
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row', // Arrange children in a row
        width: '100%', // Ensures the row takes the full width of the screen
        alignItems: 'center', // Align items vertically in the center
        padding: 10,
    },
    column: {
        justifyContent: 'center', // Center content vertically
        alignItems: 'flex-start', // Center content horizontally

    },

    columnButtons: {
        alignItems: 'flex-start', // Center content horizontally
    },
    stackContainer: {
        position: 'relative', // Enables child absolute positioning
        paddingStart: 10,
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 10,
        right: 0,
        bottom: 0,
        padding: 0, // Ensure no padding is added
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

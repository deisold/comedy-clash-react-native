import { Colors } from "react-native/Libraries/NewAppScreen";
import { globalStyles } from "../../components/views/Styles";
import { useEffect } from "react";
import { View, Text, SafeAreaView, Keyboard, StyleSheet, Button, ActivityIndicator } from "react-native";
import { LabeledInput } from "../../components/views/LabeledInput";
import { useCreateShowViewModel } from './CreateShowViewModel';
import { showToastError } from "../../utils/utils";
import { showToastSuccess } from "../../utils/utils";
import { CreateShowViewModelEvent } from "./CreateShowViewModel";
export default function CreateShow() {
    const { state, actions, toastEmitter } = useCreateShowViewModel();

    useEffect(() => {
        const handleSuccess = (event: CreateShowViewModelEvent) => {
            console.log(`handleSuccess: ${event.message}`);
            showToastSuccess(event.message);
        };

        const handleError = (event: CreateShowViewModelEvent) => {
            console.log(`handleError: ${event.message}`);
            showToastError(event.message);
        };

        // Attach the listeners
        toastEmitter.on('success', handleSuccess);
        toastEmitter.on('error', handleError);

        return () => {
            toastEmitter.removeAllListeners();
        };
    }, []); // Run only once on mount

    useEffect(() => {
        if (!state.isManager) {
            showToastError('You are not authorized to create a show!');
        }
    }, [state.isManager]);

    return (
        <SafeAreaView style={globalStyles.containerPadding}>
            <View style={globalStyles.sectionContainer}>
                <Text style={[globalStyles.mainTitle, { textAlign: 'center' }]}>
                    Create a show
                </Text>
                <View style={{}}>
                    <LabeledInput label="Description"
                        placeholder="Add a description"
                        value={state.description}
                        onChange={actions.onChangeDescription}
                        error={state.errors.description} />

                    <LabeledInput label="Submission window"
                        placeholder="How many days?"
                        value={state.days}
                        onChange={actions.onChangeDays}
                        error={state.errors.days}
                        inputMode="numeric" />
                </View>
                <View style={[styles.bottomContainer, { display: state.isManager ? 'flex' : 'none' }]}>
                    <Button title="Save"
                        disabled={!state.isManager || state.submitted}
                        onPress={
                            () => {
                                Keyboard.dismiss();
                                actions.onSubmit();
                            }
                        }
                    />
                    {state.loading && <View style={globalStyles.overlay}>
                        <ActivityIndicator animating={state.loading} size="small" color={Colors.dark} />
                    </View>}

                </View>
                <Text style={{ color: Colors.green, fontSize: 14, marginTop: 12 }}>{state.successMessage}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    bottomContainer: {
        position: 'relative',
        marginTop: 12,
        borderRadius: 5
    }
});
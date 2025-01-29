import { Colors } from "react-native/Libraries/NewAppScreen";
import { globalStyles } from "../../components/views/Styles";
import { View, Text, SafeAreaView, Keyboard, StyleSheet, Button, ActivityIndicator } from "react-native";
import { LabeledInput } from "../../components/views/LabeledInput";
import { useCreateRatingViewModel } from './CreateRatingViewModel';
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useEventEmitter } from "@/components/views/common/useToastEventEmitter";

export const CreateRatingView = ({ route }: { route: RouteProp<RootStackParamList, 'CreateRatingView'> }) => {
    const { showAddress, submissionIndex } = route.params;
    const { state, actions, eventEmitter } = useCreateRatingViewModel(showAddress, submissionIndex);

    useEventEmitter(eventEmitter);

    return (
        <SafeAreaView style={globalStyles.containerPadding}>
            <View style={globalStyles.sectionContainer}>
                <Text style={[globalStyles.mainTitle, { textAlign: 'center' }]}>
                    Leave your rating
                </Text>
                <View style={{}}>
                    <LabeledInput label="Name"
                        placeholder="Whats your name?"
                        value={state.name}
                        onChange={actions.onChangeName}
                        error={state.errors.name} />
                    <LabeledInput label="Comment"
                        placeholder="Leave a comment"
                        value={state.comment}
                        onChange={actions.onChangeComment}
                        error={state.errors.comment} />

                    <LabeledInput label="Your "
                        placeholder="Value beween 1 and 5"
                        value={state.value}
                        onChange={actions.onChangeValue}
                        error={state.errors.value}
                        inputMode="numeric" />
                </View>
                <View style={[styles.bottomContainer, { display: state.canWrite ? 'flex' : 'none' }]}>
                    <Button title="Save"
                        disabled={!state.canWrite || state.submitted}
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
    );
}

const styles = StyleSheet.create({
    bottomContainer: {
        position: 'relative',
        marginTop: 12,
        borderRadius: 5
    }
});
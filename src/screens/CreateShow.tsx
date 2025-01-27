import { Colors } from "react-native/Libraries/NewAppScreen";
import { useAppContext } from "../components/providers/AppProviders";
import { globalStyles } from "../views/Styles";
import { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Keyboard, StyleSheet, Button, ActivityIndicator } from "react-native";
import { LabeledInput } from "../views/LabeledInput";
import Toast from 'react-native-toast-message';

interface ErrorMessages {
    description: string;
    days: string;
}

export default function CreateShow() {
    const { comedyTheaterRepo, isManager: appIsManager } = useAppContext();

    const [description, setDescription] = useState<string>('');
    const [days, setDays] = useState<string>('');
    const [isManager, setIsManager] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errors, setErrors] = useState<ErrorMessages>({ description: '', days: '' });
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        const isManager = appIsManager;
        setIsManager(isManager);

        if (!isManager) {
            Toast.show({ type: 'error', position: 'bottom', text2: 'You are not authorized to create a show!' });
        }
    }, [isManager]);

    const onChangeDescription = (value: string) => {
        setDescription(value)
        if (errors.description) {
            setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
            setSubmitted(false);
        }
    }

    const onChangeDays = (value: string) => {
        setDays(value)
        if (errors.days) {
            setErrors((prevErrors) => ({ ...prevErrors, days: '' }));
            setSubmitted(false);
        }
    }

    const validate = () => {
        const newErrors: ErrorMessages = { description: '', days: '' };
        if (!description.trim()) {
            newErrors.description = 'Please enter a description';
        }
        const daysNum = Number(days);
        if (!days) {
            newErrors.days = 'Please enter the submission window in days';
        } else if (isNaN(daysNum) || !Number.isInteger(daysNum)) {
            newErrors.days = 'Please enter a valid whole number';
        } else if (daysNum < 1) {
            newErrors.days = 'At least 1 day is required';
        } else if (daysNum > 30) {
            newErrors.days = 'Maximum 30 days allowed';
        }
        setErrors(newErrors);

        return Object.values(newErrors).every(value => value === '');
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        Keyboard.dismiss();

        if (validate()) {
            Keyboard.dismiss();
            const controller = new AbortController();

            try {
                setLoading(true);

                const txResponse = await comedyTheaterRepo!!.addShow(description, Number(days));
                var message = 'Transcation successfully created - waiting for confirmation!';
                setSuccessMessage(message);
                Toast.show({ type: 'success', position: 'bottom', text2: message });
                console.log(`addShow: ${message}`);

                await txResponse.wait();

                message = 'Transaction confirmed!';
                setSuccessMessage(message);
                Toast.show({ type: 'success', position: 'bottom', text2: message });
                console.log(`addShow: ${message}`);
            } catch (error: any) {
                if (controller.signal.aborted) return;
                Toast.show({ type: 'error', position: 'bottom', text2: 'Error creating show!' });
                console.error('Error creating show:', error);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }

            return () => controller.abort();
        }
    };

    return (
        <SafeAreaView style={globalStyles.containerPadding}>
            <View style={globalStyles.sectionContainer}>
                <Text style={[globalStyles.mainTitle, { textAlign: 'center' }]}>
                    Create a show
                </Text>
                <View style={{}}>
                    <LabeledInput label="Description"
                        placeholder="Add a description"
                        value={description}
                        onChange={onChangeDescription}
                        error={errors.description} />

                    <LabeledInput label="Submission window"
                        placeholder="How many days?"
                        value={days}
                        onChange={onChangeDays}
                        error={errors.days}
                        inputMode="numeric" />
                </View>
                <View style={[styles.bottomContainer, { display: isManager ? 'flex' : 'none' }]}>
                    <Button title="Save"
                        disabled={!isManager || submitted}
                        onPress={handleSubmit}
                    />
                    {loading && <View style={globalStyles.overlay}>
                        <ActivityIndicator animating={loading} size="small" color={Colors.dark} />
                    </View>}

                </View>
                <Text style={{ color: Colors.green, fontSize: 14, marginTop: 12 }}>{successMessage}</Text>
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
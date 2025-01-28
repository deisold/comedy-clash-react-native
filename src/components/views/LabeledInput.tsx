import { View, Text, TextInput, StyleSheet } from "react-native";

export const LabeledInput: React.FC<{
    label: string;
    placeholder: string;
    value: string;
    onChange: (text: string) => void;
    verticalMargin?: number;
    error?: string;
    inputMode?: 'numeric' | 'decimal' | 'none' | 'text' | 'search' | 'email' | 'tel' | 'url';
}> = ({ label, placeholder, value, onChange, verticalMargin, error, inputMode }) => {
    return (
        <View style={[LabeledInputStyles.inputContainer, { marginVertical: verticalMargin ? verticalMargin : defaultVerticalMargin }]}>
            <Text style={LabeledInputStyles.inputLabel}>{label}</Text>
            <TextInput
                style={[LabeledInputStyles.input, { borderColor: error ? 'red' : 'gray' }]}
                placeholder={placeholder}
                placeholderTextColor="gray"
                value={value}
                inputMode={inputMode}
                onChangeText={onChange}
            />
            {error ? <Text style={LabeledInputStyles.inputError}>{error}</Text> : null}
        </View>
    )
}

const defaultVerticalMargin = 8;

export const LabeledInputStyles = StyleSheet.create({
    inputContainer: {
    },
    input: {
        height: 40,
        marginVertical: 4,
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    verticalMargin: {
        marginVertical: 8,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    inputError: {
        color: "red",
    },
})
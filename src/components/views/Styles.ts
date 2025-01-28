import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export const globalStyles = StyleSheet.create({
    sectionContainer: {
        flex: 1, // Ensures SafeAreaView takes up the whole screen
    },
    mainTitle: {
        fontSize: 42,
        fontWeight: '600',
        alignItems: 'flex-start',
        padding: 10,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 10,
        paddingTop: 20,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    highlight: {
        fontWeight: '700',
    },
    bottomSheetContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the sheet container
        borderRadius: 10, // Rounded corners for the sheet
    },
    sheetContent: {
        backgroundColor: '#ffffff', // White background for the content
        padding: 20, // Padding inside the content
        alignItems: 'flex-start', // Center the content horizontally
        justifyContent: 'center', // Center the content vertically
    },
    sheetText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333', // Dark color for the text
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    containerPadding: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 24,
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

export const backgroundStyle: StyleProp<ViewStyle> = {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
};
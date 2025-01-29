import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import CreateShow from '../screens/createShow/CreateShow';
import { ShowDetails } from '../screens/ShowDetails/ShowDetails';
import { CreateRatingView } from '../screens/createRating/CreateRatingView';

export type RootStackParamList = {
    HomeScreen: undefined;
    CreateShow: undefined;
    ShowDetails: { showAddress: string };
    CreateRatingView: { showAddress: string, submissionIndex: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="CreateShow" component={CreateShow} />
                <Stack.Screen
                    name="ShowDetails"
                    component={ShowDetails}
                    initialParams={{ showAddress: '' }}
                />
                <Stack.Screen
                    name="CreateRatingView"
                    component={CreateRatingView}
                    initialParams={{ showAddress: '', submissionIndex: '' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

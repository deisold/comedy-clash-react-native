import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateShow from '../screens/createShow/CreateShow';
import { ShowDetails } from '../screens/ShowDetails/ShowDetails';

export type RootStackParamList = {
    Home: undefined;
    CreateShow: undefined;
    ShowDetails: { showAddress: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="CreateShow" component={CreateShow} />
                <Stack.Screen 
                    name="ShowDetails" 
                    component={ShowDetails} 
                    initialParams={{ showAddress: '' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

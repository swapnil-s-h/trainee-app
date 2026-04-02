import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunicationsScreen from './screens/CommunicationsScreen';

const Stack = createNativeStackNavigator();

export default function CommStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Communications" component={CommunicationsScreen} />
    </Stack.Navigator>
  );
}

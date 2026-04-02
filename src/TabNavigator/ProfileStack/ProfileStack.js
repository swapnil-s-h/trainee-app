import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const HEADER_THEME = {
  headerStyle: { backgroundColor: '#0A0F1C' },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '700', fontSize: 18 },
  headerShadowVisible: false,
};

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_THEME}>
      <Stack.Screen name="Trainee Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

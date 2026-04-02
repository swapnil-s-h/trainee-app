import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import MobileAndFaceScreen from './src/screens/MobileAndFaceScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';
import BottomTabs from './src/TabNavigator/BottomTabs';

const RootStack = createNativeStackNavigator();

const HEADER_THEME = {
  headerStyle: { backgroundColor: '#0A0F1C' },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '600', fontSize: 18 },
  headerShadowVisible: false,
};

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {/* ── Auth flow (no bottom tabs) ── */}
        <RootStack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ ...HEADER_THEME, title: 'Login' }}
        />

        {/* Registration: 3-step flow */}
        <RootStack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ ...HEADER_THEME, title: 'Registration' }}
        />
        <RootStack.Screen
          name="MobileAndFace"
          component={MobileAndFaceScreen}
          options={{ ...HEADER_THEME, title: 'Registration' }}
        />
        <RootStack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
          options={{ ...HEADER_THEME, title: 'Registration' }}
        />

        {/* ── Main app (BottomTabs) ── */}
        <RootStack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

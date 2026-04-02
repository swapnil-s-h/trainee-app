import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CoursesScreen from '../CoursesStack/screens/CoursesScreen';
import CourseDetailsScreen from '../CoursesStack/screens/CourseDetailsScreen';

const Stack = createNativeStackNavigator();

const HEADER_THEME = {
  headerStyle: { backgroundColor: '#0A0F1C' },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '700', fontSize: 18 },
  headerShadowVisible: false,
};

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_THEME}>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen name="My Courses" component={CoursesScreen} />
      <Stack.Screen
        name="Course Details"
        component={CourseDetailsScreen}
        options={{ title: 'Learning Path' }}
      />
    </Stack.Navigator>
  );
}

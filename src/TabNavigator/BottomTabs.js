import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack/HomeStack';
import CoursesStack from './CoursesStack/CoursesStack';
import CommStack from './CommStack/CommStack';
import ProfileStack from './ProfileStack/ProfileStack';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="CoursesTab" component={CoursesStack} />
      <Tab.Screen name="CommTab" component={CommStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CoursesScreen from './screens/CoursesScreen';
import CourseDetailsScreen from './screens/CourseDetailsScreen';
import LessonPlayerScreen from './screens/LessonPlayerScreen';
import QuizScreen from './screens/QuizScreen';
import QuizResultsScreen from './screens/QuizResultsScreen';
import SessionEvaluationScreen from './screens/SessionEvaluationScreen';

const Stack = createNativeStackNavigator();

const HEADER_THEME = {
  headerStyle: {
    backgroundColor: '#0A0F1C',
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '700', fontSize: 18 },
  headerShadowVisible: false,
};

export default function CoursesStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_THEME}>
      <Stack.Screen name="My Courses" component={CoursesScreen} />
      <Stack.Screen
        name="Course Details"
        component={CourseDetailsScreen}
        options={{ title: 'Learning Path' }}
      />
      <Stack.Screen
        name="LessonPlayer"
        component={LessonPlayerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuizResults"
        component={QuizResultsScreen}
        options={{ title: 'Quiz Results' }}
      />
      <Stack.Screen
        name="SessionEvaluation"
        component={SessionEvaluationScreen}
        options={{ title: 'Session Evaluation' }}
      />
    </Stack.Navigator>
  );
}

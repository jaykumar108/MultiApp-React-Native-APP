import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MultiAppScreen from './MultiAppScreen';
import AIChatScreen from './AIChatScreen';
import CalculatorScreen from './CalculatorScreen';
import TodoScreen from './TodoScreen';
import ExpenseTrackerScreen from './ExpenseTrackerScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './setting/SettingsScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MultiApp" component={MultiAppScreen} />
      <Stack.Screen name="ExpenseTracker" component={ExpenseTrackerScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'AI') iconName = 'chatbubble-ellipses-outline';
          else if (route.name === 'Calculator') iconName = 'calculator-outline';
          else if (route.name === 'Todo') iconName = 'list-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Todo" component={TodoScreen} />
      <Tab.Screen name="AI" component={AIChatScreen} />
      <Tab.Screen name="Calculator" component={CalculatorScreen} />

      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainTabs; 
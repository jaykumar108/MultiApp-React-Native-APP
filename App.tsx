/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStartedScreen from './src/screens/GetStartedScreen';
import MultiAppScreen from './src/screens/MultiAppScreen';
import TodoScreen from './src/screens/TodoScreen';
import ExpenseTrackerScreen from './src/screens/ExpenseTrackerScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import MainTabs from './src/screens/MainTabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Placeholder Main screen
const MainScreen = () => (
  <></>
);

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Stack.Navigator initialRouteName="GetStarted">
          <Stack.Screen name="GetStarted" component={GetStartedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

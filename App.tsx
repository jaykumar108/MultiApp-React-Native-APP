/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStartedScreen from './src/screens/GetStartedScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import MultiAppScreen from './src/screens/MultiAppScreen';
import TodoScreen from './src/screens/TodoScreen';
import ExpenseTrackerScreen from './src/screens/ExpenseTrackerScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import MainTabs from './src/screens/MainTabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import ToastManager from './src/components/ui/ToastManager';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isDarkMode = useColorScheme() === 'dark';

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
      <NavigationContainer>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
        </Stack.Navigator>
      </NavigationContainer>
  );
};

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastManager>
          <AppContent />
        </ToastManager>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;

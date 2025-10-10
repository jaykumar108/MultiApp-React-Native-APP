/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator, Platform } from 'react-native';
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
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import ToastManager from './src/components/ui/ToastManager';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <SafeAreaView 
        style={[
          styles.loadingContainer,
          isDarkMode && styles.darkLoadingContainer
        ]} 
        edges={['top', 'bottom']}
      >
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[
        styles.container,
        isDarkMode && styles.darkContainer
      ]} 
      edges={['top']}
    >
      <StatusBar 
        backgroundColor={Platform.OS === 'android' 
          ? (isDarkMode ? '#fff' : 'transparent')
          : (isDarkMode ? '#fff' : '#fff')
        } 
        barStyle={isDarkMode ? 'dark-content' : 'dark-content'} 
        translucent={Platform.OS === 'android' && !isDarkMode}
      />
      <NavigationContainer>
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
    </SafeAreaView>
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
    backgroundColor: 'transparent',
  },
  darkContainer: {
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkLoadingContainer: {
    backgroundColor: '#fff',
  },
});

export default App;

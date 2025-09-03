import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import LoginPage from './screens/LoginPage';
import SignInPage from './screens/SignInPage';
import Dashboard from './screens/Dashboard';
import TransactionsPage from './screens/TransactionPage';
import AnalyticsPage from './screens/AnalyticsPage';
import MemberPage from './screens/MemberPage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'RussoOne': require('./assets/fonts/RussoOne-Regular.ttf'),
      'AROneSans': require('./assets/fonts/AROneSans-Regular.ttf'),
      'Calibribold': require('./assets/fonts/calibri-bold.ttf'),
      'AROneSansSemiBold': require('./assets/fonts/AROneSans-SemiBold.ttf'),
    }).then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="SignIn" component={SignInPage} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Transactions" component={TransactionsPage} />
        <Stack.Screen name="Analytics" component={AnalyticsPage} />
        <Stack.Screen name="Members" component={MemberPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


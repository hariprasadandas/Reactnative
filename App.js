import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from './components/SignUp';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Teams from './components/Teams';
import Tournaments from './components/Tournaments';
import TabNavigator from './components/TabNavigator';
import Community from './components/Community';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Signup" 
          component={SignUp} 
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword} 
          options={{ title: 'Forgot Password' }}
        />
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }}  // TabNavigator has its own titles
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Home' }}
        />
        <Stack.Screen 
          name="Teams" 
          component={Teams} 
          options={{ title: 'Teams' }}
        />
        <Stack.Screen 
          name="Tournaments" 
          component={Tournaments} 
          options={{ title: 'Tournaments' }}
        />
        <Stack.Screen name="Community" 
        component={Community}
        options={{ title: 'Community' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
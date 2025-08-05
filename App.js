import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from './components/SignUp';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import TabNavigator from './components/TabNavigator';
import Admin from './components/admin/Admin';
import AllTeams from './components/admin/AllTeams';
import ManageTeams from './components/admin/ManageTeams';
import Matches from './components/admin/Matches';
import FirebaseTest from './components/admin/FirebaseTest';

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
          name="Admin" 
          component={Admin} 
          options={{ title: 'Admin Panel' }}
        />
        <Stack.Screen 
          name="AllTeams" 
          component={AllTeams} 
          options={{ title: 'All Teams' }}
        />
        <Stack.Screen 
          name="ManageTeams" 
          component={ManageTeams} 
          options={{ title: 'Manage Teams' }}
        />
        <Stack.Screen 
          name="Matches" 
          component={Matches} 
          options={{ title: 'Matches' }}
        />
        <Stack.Screen 
          name="FirebaseTest" 
          component={FirebaseTest} 
          options={{ title: 'Firebase Test' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
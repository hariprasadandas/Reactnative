import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from './components/SignUp';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Teams from './components/Teams';
<<<<<<< HEAD
import Tournaments from './components/Tournaments';
import TabNavigator from './components/TabNavigator';
import Community from './components/Community';

=======
import Admin from './components/admin/Admin';
import AllTeams from './components/admin/AllTeams';
import ManageTeams from './components/admin/ManageTeams';
import Matches from './components/admin/Matches';
>>>>>>> 0f98542b9cb68baf95912f6f4e382543d2c9a49b

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
<<<<<<< HEAD
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

=======
        <Stack.Screen name="Signup" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Tournaments" component={Tournaments} />
        <Stack.Screen name="Teams" component={Teams} />
        <Stack.Screen name="Admin" component={Admin}/>
        <Stack.Screen name="AllTeams" component={AllTeams}/>
        <Stack.Screen name="ManageTeams" component={ManageTeams}/>
        <Stack.Screen name="Matches" component={Matches} />
>>>>>>> 0f98542b9cb68baf95912f6f4e382543d2c9a49b
      </Stack.Navigator>
    </NavigationContainer>
  );
}
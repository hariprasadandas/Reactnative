import React from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Tournaments from './components/Tournaments';
import Teams from './components/Teams';
import Admin from './components/admin/Admin';
import AllTeams from './components/admin/AllTeams';
import ManageTeams from './components/admin/ManageTeams';
import Matches from './components/admin/Matches';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

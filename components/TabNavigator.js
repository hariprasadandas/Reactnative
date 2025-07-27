import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Teams from './Teams';
import Tournaments from './Tournaments';
import Profile from './ProfileCreation';
import Community from './Community'; // Import the Community screen
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Teams') iconName = 'people-outline';
          else if (route.name === 'Tournaments') iconName = 'trophy-outline';
          else if (route.name === 'Community') iconName = 'people-circle-outline'; // Community icon
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E63946',
        tabBarInactiveTintColor: 'gray',
        headerTitleAlign: 'center', // Header title centered
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Teams" component={Teams} />
      <Tab.Screen name="Tournaments" component={Tournaments} />
      <Tab.Screen name="Community" component={Community} /> 
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

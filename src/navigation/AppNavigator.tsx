import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DiseasesScreen from '../screens/DiseasesScreen';
import ClinicsScreen from '../screens/ClinicsScreen';
import SymptomsScreen from '../screens/SymptomsScreen';
import ClinicDetailScreen from '../screens/ClinicDetailScreen';
import DiseasesDetailScreen from '../screens/DiseasesDetailScreen';
import HastaliginizScreen from '../screens/HastaliginizScreen';

// Navigation types
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Diseases" 
          component={DiseasesScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DiseasesDetail" 
          component={DiseasesDetailScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Clinics" 
          component={ClinicsScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ClinicDetail" 
          component={ClinicDetailScreen} 
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Symptoms" 
          component={SymptomsScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Hastaliginiz" 
          component={HastaliginizScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthScreen from '../screens/AuthScreen';
import Vehicles from '../screens/Vehicles';
import Vehicle from '../screens/Vehicle';


const AuthStack = createStackNavigator({
  Auth: AuthScreen,
});
const VStack = createStackNavigator({
  Vehicles: Vehicles,
  Car: Vehicle,
});

export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Auth: AuthStack,
  Veh:VStack, 
  //Main: MainTabNavigator,
});


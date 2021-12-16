import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../screens/Home';
import { CarDetails } from '../screens/CarDetails';
import { Scheduling } from '../screens/Scheduling';
import { SchedulingDetails } from '../screens/SchedulingDetails';
import { Confirmation } from '../screens/Confirmation';
import { MyCars } from "../screens/MyCars";
import { Splash } from "../screens/Splash";
import { CarDTO } from "../dtos/CarDTO";

const { Navigator, Screen } = createNativeStackNavigator();

export type RootStackParamsList = {
  Splash: undefined,
  Home: undefined,
  CarDetails: {car: CarDTO},
  Scheduling: {car: CarDTO},
  SchedulingDetails: {
    car: CarDTO,
    dates: string[];
  },
  Confirmation: {
    title: string;
    message: string;
    nextScreenRoute: 'Splash' | 'SignIn' | 'SignUpFirstStep' | 'SignUpSecondStep' | 'Home' | 'CarDetails' | 'Scheduling' | 'SchedulingDetails' | 'Confirmation' | 'MyCars';
  },
  MyCars: undefined
}

export function AppStackRoutes(){
  return(
    <Navigator
      screenOptions={{
        headerShown:false
      }}
      initialRouteName="Home"
    >
      <Screen name="Splash" component={Splash}/>
      <Screen 
        name="Home" 
        component={Home}
        options={{
          gestureEnabled: false
        }}
      />
      <Screen name="CarDetails" component={CarDetails}/>
      <Screen name="Scheduling" component={Scheduling}/>
      <Screen name="SchedulingDetails" component={SchedulingDetails}/>
      <Screen name="Confirmation" component={Confirmation}/>
      <Screen name="MyCars" component={MyCars}/>
    </Navigator>
  )
}

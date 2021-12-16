import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../screens/Home';
import { Splash } from "../screens/Splash";
import { SignIn } from "../screens/SignIn";
import { SignUpFirstStep } from "../screens/SignUp/SignUpFirstStep";
import { SignUpSecondStep } from "../screens/SignUp/SignUpSecondStep";

const { Navigator, Screen } = createNativeStackNavigator();

export type RootAuthParamsList = {
  Splash: undefined,
  SignIn: undefined,
  SignUpFirstStep: undefined,
  SignUpSecondStep: {
    user: {
      name: string;
      email: string;
      driverLicense: string;
    }
  },
  Confirmation: {
    title: string;
    message: string;
    nextScreenRoute: 'Splash' | 'SignIn' | 'SignUpFirstStep' | 'SignUpSecondStep' | 'Home' | 'CarDetails' | 'Scheduling' | 'SchedulingDetails' | 'Confirmation' | 'MyCars';
  }
}

export function AuthRoutes(){
  return(
    <Navigator
      screenOptions={{
        headerShown:false
      }}
      initialRouteName="Splash"
    >
      <Screen name="Splash" component={Splash}/>
      <Screen name="SignIn" component={SignIn}/>
      <Screen name="SignUpFirstStep" component={SignUpFirstStep}/> 
      <Screen name="SignUpSecondStep" component={SignUpSecondStep}/>
      <Screen name="Confirmation" component={Home} />
    </Navigator>
  )
}

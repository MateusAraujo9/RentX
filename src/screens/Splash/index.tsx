import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootAuthParamsList } from '../../routes/auth.routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import BrandSvg from '../../assets/brand.svg';
import LogoSvg from '../../assets/logo.svg';

import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';

import {
  Container
} from './styles';

type SplashScreenProp = NativeStackNavigationProp<RootAuthParamsList, "Splash">

export function Splash(){
  const navigation = useNavigation<SplashScreenProp>();
  const splashAnimation = useSharedValue(0);

  const brandStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value, [0, 50], [1, 0]),
      transform: [
        {
          translateX: interpolate(splashAnimation.value, 
            [0, 50],
            [0, -50],
            Extrapolate.CLAMP
          )
        }
      ]
    }
  });

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value, [0, 25, 50], [0, 0.3, 1]),
      transform: [
        {
          translateX: interpolate(splashAnimation.value, 
            [0, 50], 
            [-50, 0],
            Extrapolate.CLAMP
          )
        }
      ]
    }
  });

  function startApp() {
    navigation.navigate('SignIn');
  }

  useEffect(()=> {
    splashAnimation.value = withTiming(50, {duration: 2000}, () =>{
      'worklet' 
      runOnJS(startApp)();      
    });
  }, []);

  return (
    <Container>
      <Animated.View style={[brandStyle, {position: 'absolute'}]}>
        <BrandSvg width={77} height={47}/>
      </Animated.View>

      <Animated.View style={[logoStyle, {position: 'absolute'}]}>
        <LogoSvg width={180} height={20}/>
      </Animated.View>
    </Container>
  );
}
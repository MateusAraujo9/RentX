import React from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamsList } from '../../routes/app.stack.routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LogoSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg';

import {
  Container,
  Content,
  Title,
  Message,
  Footer
} from './styles';
import { ConfirmButton } from '../../components/ConfirmButton';

type ConfirmationScreenProp = NativeStackNavigationProp<RootStackParamsList, "Confirmation">

interface Params {
  title: string;
  message: string;
  nextScreenRoute: 'Splash' | 'SignIn' | 'SignUpFirstStep' | 'SignUpSecondStep' | 'Home' | 'CarDetails' | 'Scheduling' | 'SchedulingDetails' | 'Confirmation' | 'MyCars';
}

export function Confirmation(){
  const navigation = useNavigation<ConfirmationScreenProp>();
  const route = useRoute();
  const {title, message, nextScreenRoute} = route.params as Params;
  const { width } = useWindowDimensions();

  function handleComplete() {
    navigation.navigate(nextScreenRoute);
  }

  return (
    <Container>
      <StatusBar 
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LogoSvg width={width}/>

      <Content>
        <DoneSvg width={80} height={80}/>
        <Title>{title}</Title>

        <Message>
          {message}
        </Message>
      </Content>

      <Footer>
        <ConfirmButton title="OK" onPress={handleComplete}/>
      </Footer>
    </Container>
  );
}
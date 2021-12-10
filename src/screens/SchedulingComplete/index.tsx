import React from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RootStackParamsList } from '../../routes/stack.routes';
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

type SchedulingCompleteScreenProp = NativeStackNavigationProp<RootStackParamsList, "SchedulingComplete">

export function SchedulingComplete(){
  const navigation = useNavigation<SchedulingCompleteScreenProp>();
  const { width } = useWindowDimensions();

  function handleComplete() {
    navigation.navigate('Home');
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
        <Title>Carro Alugado!</Title>

        <Message>
          Agora você só precisa ir {'\n'}
          até a concessionária da RENTX {'\n'}
          pegar o seu automóvel.
        </Message>
      </Content>

      <Footer>
        <ConfirmButton title="OK" onPress={handleComplete}/>
      </Footer>
    </Container>
  );
}
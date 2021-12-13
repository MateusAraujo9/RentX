import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamsList } from '../../../routes/stack.routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Confirmation } from '../../Confirmation';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { PasswordInput } from '../../../components/PasswordInput';
import { Button } from '../../../components/Button';

import {
  Container,
  Header,
  Steps,
  Title,
  Subtitle,
  Form,
  FormTitle
} from './styles';

type SignUpScreenProp = NativeStackNavigationProp<RootStackParamsList, "SignUpSecondStep">

interface Params {
  user: {
    name: string;
    email: string;
    driverLicense: string;
  }
}

export function SignUpSecondStep(){
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const navigation = useNavigation<SignUpScreenProp>();
  const route = useRoute();
  const theme = useTheme();
  const { user } = route.params as Params;

  function handleBack() {
    navigation.goBack();
  }

  function handleRegister() {
    if (!password || !passwordConfirm) {
      return Alert.alert('Informe a senha e a confirmação.');
    }

    if (password != passwordConfirm) {
      return Alert.alert('As senhas não são iguais.');
    }

    navigation.navigate('Confirmation', {
      title: 'Conta criada',
      message: 'Agora é só fazer login\ne aproveitar',
      nextScreenRoute: 'SignIn'
    });
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack}/>
            <Steps>
              <Bullet />
              <Bullet active />
            </Steps>
          </Header>
          <Title>Crie sua {'\n'}conta</Title>
          <Subtitle>Faço seu cadastro de{'\n'}forma rápida e fácil</Subtitle>

          <Form>
            <FormTitle>2. Senha</FormTitle>
            <PasswordInput 
              iconName='lock'
              placeholder='Senha'
              onChangeText={setPassword}
              value={password}
            />
            <PasswordInput 
              iconName='lock'
              placeholder='Repetir Senha'
              onChangeText={setPasswordConfirm}
              value={passwordConfirm}
            />
          </Form>
          <Button 
            title='Próximo'
            color={theme.colors.success}
            onPress={handleRegister}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
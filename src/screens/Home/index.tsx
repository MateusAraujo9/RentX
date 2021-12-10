import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsList } from '../../routes/stack.routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Car } from '../../components/Car';
import Logo from '../../assets/logo.svg';
import api from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components';

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList,
  MyCarsButton
} from './styles';
import { Load } from '../../components/Load';

type HomeScreenProp = NativeStackNavigationProp<RootStackParamsList, "Home">

export function Home(){
  const theme = useTheme();
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<HomeScreenProp>();
  
  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', {car});
  }

  function handleOpenMyCars() {
    navigation.navigate('MyCars');
  }
  
  useEffect(()=>{
    async function fetchCars() {
      try {
        const response = await api.get('/cars');
        setCars(response.data);
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    }

    fetchCars();

  }, []);

  return (
    <Container>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>
      <Header>
        <HeaderContent>
          <Logo 
            width={RFValue(108)}
            height={RFValue(12)}
          />

          <TotalCars>
            Total de 12 carros
          </TotalCars>
        </HeaderContent>
      </Header>
      {loading ? <Load /> : 
        <CarList 
          data={cars}
          renderItem={({item}) => <Car data={item} onPress={()=>handleCarDetails(item)}/>}
          keyExtractor={item => String(item.id)}
        />
      }

      <MyCarsButton onPress={handleOpenMyCars}>
        <Ionicons name="ios-car-sport" size={32} color={theme.colors.shape}/>
      </MyCarsButton>
    </Container>
  );
}
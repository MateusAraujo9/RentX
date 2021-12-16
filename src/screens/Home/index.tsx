import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsList } from '../../routes/app.stack.routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RFValue } from 'react-native-responsive-fontsize';
import { Car } from '../../components/Car';
import Logo from '../../assets/logo.svg';
import api from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList
} from './styles';
import { LoadAnimation } from '../../components/LoadAnimation';

type HomeScreenProp = NativeStackNavigationProp<RootStackParamsList, "Home">

export function Home(){
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<HomeScreenProp>();
  
  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', {car});
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

          {
            !loading &&
            <TotalCars>
              Total de {cars.length} carros
            </TotalCars>
          }
          
        </HeaderContent>
      </Header>
      {loading ? <LoadAnimation /> : 
        <CarList 
          data={cars}
          renderItem={({item}) => <Car data={item} onPress={()=>handleCarDetails(item)}/>}
          keyExtractor={item => String(item.id)}
        />
      }

    </Container>
  );
}
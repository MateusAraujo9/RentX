import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { format } from 'date-fns';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamsList } from '../../routes/app.stack.routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Feather } from '@expo/vector-icons';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPricelTotal,
} from './styles';
import { Button } from '../../components/Button';
import { RFValue } from 'react-native-responsive-fontsize';
import { CarDTO } from '../../dtos/CarDTO';
import { getPlataformDate } from '../../utils/getPlataformDate';
import api from '../../services/api';
import { Alert } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

type SchedulingDetailsScreenProp = NativeStackNavigationProp<RootStackParamsList, "SchedulingDetails">

interface Params {
  car: CarDTO,
  dates: string[]
}

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

export function SchedulingDetails(){
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
  const navigation = useNavigation<SchedulingDetailsScreenProp>();
  const route = useRoute();
  const { car, dates } = route.params as Params;
  const theme = useTheme();
  const netInfo = useNetInfo();
  const rentTotal = Number(dates.length * car.price);

  async function handleConfirmSchedulingDetails() {
    setLoading(true);
    

    await api.post('/rentals', {
      user_id: 1,
      car_id: car.id,
      start_date: new Date(dates[0]),
      end_date: new Date(dates[dates.length -1]),
      total: rentTotal
    })
    .then(() => {
      navigation.navigate('Confirmation', {
        title: 'Carro Alugado!',
        message: 'Agora você só precisa ir \naté a concessionária da RENTX \npegar o seu automóvel.',
        nextScreenRoute: 'Home'
      })
    })
    .catch((error) => {
      console.log(error);
      Alert.alert('Não foi possível confirmar o agendamento.')
      setLoading(false);
    });
  }

  function handleBack() {
    navigation.goBack();
  }

  useEffect(()=>{
    setRentalPeriod({
      startFormatted: format(getPlataformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      endFormatted: format(getPlataformDate(new Date(dates[dates.length -1])), 'dd/MM/yyyy'),
    })
  },[]);

  useEffect(() => {
    async function fetchCarUpdated() {
      const response = await api.get(`/cars/${car.id}`);
      setCarUpdated(response.data);
    }

    if (netInfo.isConnected === true) {
      fetchCarUpdated();
    }
  }, [netInfo.isConnected]);

  return (
    <Container>
      <Header>
        <BackButton color="#FF0000" onPress={handleBack}/>
      </Header>
      <CarImages>
        <ImageSlider imagesUrl={
          !!carUpdated.photos ? 
          carUpdated.photos : [{id: car.thumbnail, photo: car.thumbnail}]
        }/>
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>

        {
          carUpdated.accessories && 
          <Accessories>
            {
              carUpdated.accessories.map(accessory => (
                <Accessory 
                  key={accessory.type}
                  name={accessory.name} 
                  icon={getAccessoryIcon(accessory.type)}
                />
              ))
              
            }
            
          </Accessories>
        }

        <RentalPeriod>
          <CalendarIcon>
            <Feather 
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.startFormatted}</DateValue>
          </DateInfo>

          <Feather 
            name="chevron-right"
            size={RFValue(24)}
            color={theme.colors.shape}
          />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.endFormatted}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
            <RentalPricelTotal>R$ {rentTotal}</RentalPricelTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button 
          title="Alugar agora" 
          onPress={handleConfirmSchedulingDetails} 
          color={theme.colors.success}
          enabled={!loading}
          loading={loading}
        />
      </Footer>
    </Container>
  );
}
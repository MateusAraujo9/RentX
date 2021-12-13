import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { format } from 'date-fns';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamsList } from '../../routes/stack.routes';
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
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
  const navigation = useNavigation<SchedulingDetailsScreenProp>();
  const route = useRoute();
  const { car, dates } = route.params as Params;
  const theme = useTheme();
  const rentTotal = Number(dates.length * car.rent.price);

  async function handleConfirmSchedulingDetails() {
    setLoading(true);
    const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);
    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,
      ...dates,
    ];

    await api.post('/schedules_byuser', {
      user_id: 1,
      car,
      startDate: format(getPlataformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      endDate: format(getPlataformDate(new Date(dates[dates.length -1])), 'dd/MM/yyyy'),
    });

    api.put(`/schedules_bycars/${car.id}`, {
      id: car.id,
      unavailable_dates
    })
    .then(() => {
      navigation.navigate('Confirmation', {
        title: 'Carro Alugado!',
        message: 'Agora você só precisa ir \naté a concessionária da RENTX \npegar o seu automóvel.',
        nextScreenRoute: 'Home'
      })
    })
    .catch(() => {
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

  return (
    <Container>
      <Header>
        <BackButton color="#FF0000" onPress={handleBack}/>
      </Header>
      <CarImages>
        <ImageSlider imagesUrl={car.photos}/>
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.rent.period}</Period>
            <Price>R$ {car.rent.price}</Price>
          </Rent>
        </Details>

        <Accessories>
        {
          car.accessories.map(accessory => (
            <Accessory 
              key={accessory.type}
              name={accessory.name} 
              icon={getAccessoryIcon(accessory.type)}
            />
          ))
          
        }
        </Accessories>

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
            <RentalPriceQuota>{`R$ ${car.rent.price} x${dates.length} diárias`}</RentalPriceQuota>
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
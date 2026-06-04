import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavoritosScreen from '../screens/FavoritosScreen';
import DetalhesScreen from '../screens/DetalhesScreen';
import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator();

export default function FavoritosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen
        name="FavoritosLista"
        component={FavoritosScreen}
        options={{ title: 'Meus Favoritos' }}
      />
      <Stack.Screen
        name="DetalhesFav"
        component={DetalhesScreen}
        options={{ title: 'Detalhes da Unidade' }}
      />
    </Stack.Navigator>
  );
}

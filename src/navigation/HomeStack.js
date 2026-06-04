import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListagemScreen from '../screens/ListagemScreen';
import DetalhesScreen from '../screens/DetalhesScreen';
import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
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
        name="Listagem"
        component={ListagemScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detalhes"
        component={DetalhesScreen}
        options={{ title: 'Detalhes da Unidade' }}
      />
    </Stack.Navigator>
  );
}

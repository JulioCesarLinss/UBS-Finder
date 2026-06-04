import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import FavoritosStack from './FavoritosStack';
import SobreScreen from '../screens/SobreScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          paddingBottom: 4,
          paddingTop: 4,
          height: 62,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Início: focused ? 'home' : 'home-outline',
            Favoritos: focused ? 'star' : 'star-outline',
            Sobre: focused ? 'information-circle' : 'information-circle-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeStack} />
      <Tab.Screen name="Favoritos" component={FavoritosStack} />
      <Tab.Screen
        name="Sobre"
        component={SobreScreen}
        options={{
          headerShown: true,
          headerTitle: 'Sobre o App',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        }}
      />
    </Tab.Navigator>
  );
}

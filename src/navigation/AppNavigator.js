/**
 * MÓDULO: NAVEGAÇÃO E ROTAS
 * Utiliza o AuthContext para alternar automaticamente entre as telas de Login e as telas do Catálogo.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import ListScreen from '../screens/ListScreen';
import FormScreen from '../screens/FormScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#130D21' },
        headerTintColor: '#00F0FF',
        headerTitleStyle: { fontWeight: 'bold', letterSpacing: 1 },
      }}
    >
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="List"
            component={ListScreen}
            options={{ title: 'CINE LIST' }}
          />
          <Stack.Screen
            name="Form"
            component={FormScreen}
            options={{ title: 'NOVA AVALIAÇÃO' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
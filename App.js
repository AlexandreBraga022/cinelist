/**
 * MÓDULO RAIZ (ENTRY POINT)
 * Registra o provedor de autenticação e o contêiner de navegação do aplicativo.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
/**
 * MÓDULO: TELA DE AUTENTICAÇÃO (LOGIN)
 * Interface para que o usuário informe seu nome antes de acessar o aplicativo.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [usernameInput, setUsernameInput] = useState('');
  const { login } = useAuth();
  const { width } = useWindowDimensions();

  const handleLogin = () => {
    if (!usernameInput.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu nome ou apelido para continuar.');
      return;
    }
    login(usernameInput);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.content, { width: width * 0.85 }]}>
        <Text style={styles.logoText}>CINE LIST</Text>
        <Text style={styles.subtitleText}>Identifique-se para acessar o catálogo</Text>

        <Text style={styles.label}>SEU NOME OU APELIDO</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Alex, Maria, João..."
          placeholderTextColor="#A0A0A0"
          value={usernameInput}
          onChangeText={setUsernameInput}
          autoCapitalize="words"
          accessibilityLabel="Digite seu nome ou apelido"
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          accessibilityRole="button"
          accessibilityLabel="Entrar no aplicativo"
        >
          <Text style={styles.loginButtonText}>ENTRAR NO APP</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0814',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'stretch',
  },
  logoText: {
    color: '#00F0FF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitleText: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  label: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A1429',
    borderWidth: 1,
    borderColor: '#342653',
    borderRadius: 10,
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    minHeight: 48,
  },
  loginButton: {
    backgroundColor: '#FF0055',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 52,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.glowBox}>
          <Text style={styles.icon}>🎬</Text>
        </View>
        <Text style={styles.title}>CINE<Text style={styles.titleHighlight}>LIST</Text></Text>
        <Text style={styles.subtitle}>
          Seu diário futurista de filmes e séries assistidos.
        </Text>
      </View>

      <View style={styles.footer}>
        <CustomButton
          title="VER MEU CATÁLOGO"
          onPress={() => navigation.navigate('List')}
        />
        <CustomButton
          title="CADASTRAR NOVO FILME"
          variant="secondary"
          onPress={() => navigation.navigate('Form')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0914',
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#19112B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF007F',
    shadowColor: '#FF007F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    marginBottom: 24,
  },
  icon: {
    fontSize: 54,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  titleHighlight: {
    color: '#00F0FF',
  },
  subtitle: {
    fontSize: 15,
    color: '#9C8DB7',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  footer: {
    marginBottom: 20,
  },
});
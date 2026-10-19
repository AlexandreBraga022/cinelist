/**
 * MÓDULO: FORMULÁRIO COM TRATAMENTO DE TECLADO PERFEITO (HEADER OFFSET)
 * Utiliza useHeaderHeight para calcular o desconto exato do cabeçalho
 * e automaticallyAdjustKeyboardInsets para empurrar os inputs para cima do teclado.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { createMovie, updateMovie, getMovies } from '../services/cinelistApi';
import { useAuth } from '../context/AuthContext';

export default function FormScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const headerHeight = useHeaderHeight(); // Captura a altura exata do cabeçalho

  const movieToEdit = route.params?.movie;
  const isEditing = !!movieToEdit;

  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [nota, setNota] = useState('');
  const [dataAssistido, setDataAssistido] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movieToEdit) {
      setTitulo(movieToEdit.titulo || '');
      setGenero(movieToEdit.genero || '');
      setPlataforma(movieToEdit.plataforma || '');
      setNota(movieToEdit.nota || '');
      setDataAssistido(movieToEdit.dataAssistido || '');
      setDescricao(movieToEdit.descricao || '');
    } else {
      setTitulo('');
      setGenero('');
      setPlataforma('');
      setNota('');
      setDataAssistido('');
      setDescricao('');
    }
  }, [movieToEdit]);

  const normalizeText = (text) =>
    String(text || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const handleSubmit = async () => {
    if (loading) return;

    const cleanTitulo = normalizeText(titulo);
    const cleanData = normalizeText(dataAssistido);
    const cleanUser = normalizeText(user?.name || 'Anônimo');

    if (!cleanTitulo || !normalizeText(genero) || !cleanData) {
      Alert.alert('Atenção', 'Por favor, preencha o título, gênero e data.');
      return;
    }

    setLoading(true);

    try {
      const existingMovies = await getMovies();

      const isDuplicate = existingMovies.some((item) => {
        if (isEditing && String(item.id) === String(movieToEdit.id)) {
          return false;
        }

        const itemTitle = normalizeText(item.titulo);
        const itemUser = normalizeText(item.usuario || 'Anônimo');
        const itemData = normalizeText(item.dataAssistido);

        return (
          itemTitle === cleanTitulo &&
          itemUser === cleanUser &&
          itemData === cleanData
        );
      });

      if (isDuplicate) {
        Alert.alert(
          'Avaliação Já Registrada',
          `O usuário "${user?.name}" já cadastrou uma avaliação para o filme "${titulo.trim()}" na data ${dataAssistido.trim()}.`
        );
        setLoading(false);
        return;
      }

      const movieData = {
        titulo: titulo.trim(),
        genero: genero.trim(),
        plataforma: plataforma.trim(),
        nota: nota.trim(),
        dataAssistido: dataAssistido.trim(),
        descricao: descricao.trim(),
        usuario: user?.name || 'Anônimo',
      };

      if (isEditing) {
        await updateMovie(movieToEdit.id, movieData);
        Alert.alert('Sucesso', 'Avaliação atualizada com sucesso!');
      } else {
        await createMovie(movieData);
        Alert.alert('Sucesso', 'Avaliação cadastrada com sucesso!');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      Alert.alert('Erro', 'Não foi possível salvar no servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderFormContent = () => (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { paddingHorizontal: width * 0.05 }]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={true} // Ajusta o padding dinamicamente no iOS e Android
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.label}>TÍTULO DO FILME *</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex: Blade"
        placeholderTextColor="#A0A0A0"
      />

      <Text style={styles.label}>GÊNERO *</Text>
      <TextInput
        style={styles.input}
        value={genero}
        onChangeText={setGenero}
        placeholder="Ex: Ação, Sci-Fi"
        placeholderTextColor="#A0A0A0"
      />

      <Text style={styles.label}>PLATAFORMA / LOCAL *</Text>
      <TextInput
        style={styles.input}
        value={plataforma}
        onChangeText={setPlataforma}
        placeholder="Ex: Netflix, Cinema"
        placeholderTextColor="#A0A0A0"
      />

      <Text style={styles.label}>SUA NOTA (1 A 5) *</Text>
      <TextInput
        style={styles.input}
        value={nota}
        onChangeText={setNota}
        keyboardType="numeric"
        placeholder="Ex: 5"
        placeholderTextColor="#A0A0A0"
        maxLength={1}
      />

      <Text style={styles.label}>DATA ASSISTIDO (AAAA-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        value={dataAssistido}
        onChangeText={setDataAssistido}
        placeholder="2026-10-19"
        placeholderTextColor="#A0A0A0"
      />

      <Text style={styles.label}>SUA RESENHA / COMENTÁRIO</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="O que você achou deste filme?"
        placeholderTextColor="#A0A0A0"
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isEditing ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR AVALIAÇÃO'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight} // Compensa a altura exata do cabeçalho
      enabled={Platform.OS !== 'web'}
    >
      {Platform.OS === 'web' ? (
        renderFormContent()
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {renderFormContent()}
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0814' },
  scrollContainer: { paddingVertical: 20, flexGrow: 1 },
  label: { color: '#00F0FF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#1A1429', borderWidth: 1, borderColor: '#342653', borderRadius: 10, color: '#FFFFFF', fontSize: 15, paddingHorizontal: 14, paddingVertical: 12, minHeight: 48 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#FF0055', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24, marginBottom: 30, minHeight: 52 },
  submitButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
});
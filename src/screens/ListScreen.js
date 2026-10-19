/**
 * MÓDULO: CATÁLOGO COM SUPORTE A EXCLUSÃO CROSS-PLATFORM (PC E MOBILE)
 * Trata o Alert de confirmação no PC Web via window.confirm para garantir que o clique funcione.
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMovies, deleteMovie } from '../services/cinelistApi';
import { useAuth } from '../context/AuthContext';

export default function ListScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { user, logout } = useAuth();

  const [rawMovies, setRawMovies] = useState([]);
  const [groupedMovies, setGroupedMovies] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  // Normalização para comparar nomes sem problemas de acento/caixa alta
  const normalizeText = (text) =>
    String(text || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Agrupa resenhas de filmes com o mesmo título
  const processAndGroupMovies = (movieList, search = '') => {
    const cleanSearch = normalizeText(search);

    const filtered = movieList.filter((m) =>
      normalizeText(m.titulo).includes(cleanSearch)
    );

    const groups = {};

    filtered.forEach((item) => {
      const key = normalizeText(item.titulo) || 'sem-titulo';

      if (!groups[key]) {
        groups[key] = {
          keyTitle: key,
          displayTitle: item.titulo,
          genero: item.genero,
          reviews: [],
        };
      }

      groups[key].reviews.push(item);
    });

    setGroupedMovies(Object.values(groups));
  };

  const fetchMoviesList = async () => {
    setLoading(true);
    try {
      const data = await getMovies();
      setRawMovies(data);
      processAndGroupMovies(data, searchText);
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('Não foi possível carregar a lista de filmes.');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar a lista de filmes.');
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMoviesList();
    }, [])
  );

  const handleSearch = (text) => {
    setSearchText(text);
    processAndGroupMovies(rawMovies, text);
  };

  // LÓGICA DE EXCLUSÃO DE AVALIAÇÃO (COMPATÍVEL COM PC WEB E MOBILE)
  const handleDeleteReview = (id, titulo) => {
    const confirmMessage = `Deseja remover sua avaliação de "${titulo}"?`;

    const executeDeletion = async () => {
      try {
        await deleteMovie(id);
        fetchMoviesList();
      } catch (error) {
        if (Platform.OS === 'web') {
          window.alert('Não foi possível excluir a avaliação.');
        } else {
          Alert.alert('Erro', 'Não foi possível excluir a avaliação.');
        }
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(confirmMessage);
      if (confirmed) {
        executeDeletion();
      }
    } else {
      Alert.alert('Excluir Avaliação', confirmMessage, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: executeDeletion,
        },
      ]);
    }
  };

  // LÓGICA DE ELIMINAR USUÁRIO (COMPATÍVEL COM PC WEB E MOBILE)
  const handleDeleteUser = () => {
    const confirmMessage = `Tem certeza que deseja apagar a conta de "${user?.name}"? Todas as suas avaliações serão removidas do catálogo.`;

    const executeUserDeletion = async () => {
      setLoading(true);
      try {
        const allMovies = await getMovies();
        const currentUserNormalized = normalizeText(user?.name);

        // Identifica todos os registros pertencentes ao usuário logado
        const userReviews = allMovies.filter(
          (item) => normalizeText(item.usuario) === currentUserNormalized
        );

        // Apaga cada registro do usuário no MockAPI
        await Promise.all(userReviews.map((item) => deleteMovie(item.id)));

        if (Platform.OS === 'web') {
          window.alert(`O usuário "${user?.name}" e suas avaliações foram removidos.`);
        } else {
          Alert.alert('Conta Eliminada', `O usuário "${user?.name}" e suas avaliações foram removidos.`);
        }

        logout();
      } catch (error) {
        console.error('Erro ao eliminar usuário:', error);
        if (Platform.OS === 'web') {
          window.alert('Não foi possível eliminar os dados do usuário.');
        } else {
          Alert.alert('Erro', 'Não foi possível eliminar os dados do usuário.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(confirmMessage);
      if (confirmed) {
        executeUserDeletion();
      }
    } else {
      Alert.alert('Eliminar Usuário', confirmMessage, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Tudo',
          style: 'destructive',
          onPress: executeUserDeletion,
        },
      ]);
    }
  };

  // Calcula a média das notas do grupo
  const calculateAverageRating = (reviews) => {
    const validRatings = reviews.map((r) => parseInt(r.nota, 10)).filter((n) => !isNaN(n));
    if (validRatings.length === 0) return 0;
    const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
    return (sum / validRatings.length).toFixed(1);
  };

  const renderGroupCard = ({ item }) => {
    const avgScore = calculateAverageRating(item.reviews);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.displayTitle}</Text>
          <View style={styles.avgBadge}>
            <Text style={styles.avgBadgeText}>Média ★ {avgScore}</Text>
          </View>
        </View>

        {!!item.genero && (
          <View style={styles.tagGenero}>
            <Text style={styles.tagGeneroText}>{item.genero}</Text>
          </View>
        )}

        <Text style={styles.sectionSubtitle}>
          {item.reviews.length} {item.reviews.length === 1 ? 'avaliação registrada' : 'avaliações registradas'}:
        </Text>

        {item.reviews.map((rev) => {
          const isOwner = normalizeText(rev.usuario) === normalizeText(user?.name);

          return (
            <View key={rev.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.authorText}>
                  👤 {rev.usuario || 'Anônimo'} {isOwner ? '(Você)' : ''}
                </Text>
                <Text style={styles.reviewStars}>{'★'.repeat(parseInt(rev.nota, 10) || 0)}</Text>
              </View>

              <Text style={styles.reviewMeta}>
                Plataforma: {rev.plataforma || 'N/A'} | Data: {rev.dataAssistido || 'N/A'}
              </Text>

              {!!rev.descricao && (
                <Text style={styles.reviewComment}>"{rev.descricao}"</Text>
              )}

              {isOwner && (
                <View style={styles.reviewActions}>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.editBtn]}
                    onPress={() => navigation.navigate('Form', { movie: rev })}
                  >
                    <Text style={styles.editBtnText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.smallBtn, styles.deleteBtn]}
                    onPress={() => handleDeleteReview(rev.id, rev.titulo)}
                  >
                    <Text style={styles.deleteBtnText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Barra do Usuário */}
      <View style={[styles.userBar, { marginHorizontal: width * 0.04 }]}>
        <Text style={styles.userBarText}>
          Olá, <Text style={styles.userName}>{user?.name}</Text>
        </Text>
        <View style={styles.userActions}>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeleteUser} style={styles.deleteUserBtn}>
            <Text style={styles.deleteUserBtnText}>Eliminar Usuário</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Campo de Pesquisa */}
      <View style={[styles.searchContainer, { marginHorizontal: width * 0.04 }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar filme no catálogo..."
          placeholderTextColor="#A0A0A0"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Lista Agrupada */}
      {loading ? (
        <ActivityIndicator size="large" color="#00F0FF" style={styles.loader} />
      ) : (
        <FlatList
          data={groupedMovies}
          keyExtractor={(item) => item.keyTitle}
          renderItem={renderGroupCard}
          contentContainerStyle={[styles.listContainer, { paddingHorizontal: width * 0.04 }]}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum filme encontrado no catálogo.</Text>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.addButton, { marginHorizontal: width * 0.04 }]}
        onPress={() => navigation.navigate('Form')}
      >
        <Text style={styles.addButtonText}>+ AVALIAR NOVO FILME</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0814',
    paddingTop: 8,
    paddingBottom: 16,
  },
  userBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#171026',
    padding: 12,
    borderRadius: 10,
  },
  userBarText: { color: '#A0A0A0', fontSize: 13 },
  userName: { color: '#00F0FF', fontWeight: 'bold' },
  userActions: { flexDirection: 'row', gap: 8 },
  logoutBtn: { backgroundColor: '#2D1B36', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  logoutBtnText: { color: '#A0A0A0', fontWeight: 'bold', fontSize: 12 },
  deleteUserBtn: { backgroundColor: 'rgba(255, 0, 85, 0.2)', borderWidth: 1, borderColor: '#FF0055', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  deleteUserBtnText: { color: '#FF0055', fontWeight: 'bold', fontSize: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1429',
    borderWidth: 1.5,
    borderColor: '#00F0FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    minHeight: 48,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  loader: { flex: 1 },
  listContainer: { paddingBottom: 16 },
  emptyText: { color: '#A0A0A0', textAlign: 'center', marginTop: 40, fontSize: 15 },
  card: {
    backgroundColor: '#150F24',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#291E43',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', flex: 1, marginRight: 8 },
  avgBadge: { backgroundColor: 'rgba(255, 215, 0, 0.15)', borderWidth: 1, borderColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  avgBadgeText: { color: '#FFD700', fontWeight: 'bold', fontSize: 12 },
  tagGenero: { alignSelf: 'flex-start', backgroundColor: 'rgba(0, 240, 255, 0.12)', borderColor: '#00F0FF', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6, marginBottom: 12 },
  tagGeneroText: { color: '#00F0FF', fontSize: 12, fontWeight: 'bold' },
  sectionSubtitle: { color: '#A0A0A0', fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  reviewItem: { backgroundColor: '#1C152E', borderRadius: 8, padding: 10, marginBottom: 8 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  authorText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  reviewStars: { color: '#FFD700', fontSize: 13 },
  reviewMeta: { color: '#8E82A6', fontSize: 11, marginBottom: 4 },
  reviewComment: { color: '#D0C8E0', fontSize: 13, fontStyle: 'italic', marginBottom: 6 },
  reviewActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, borderWidth: 1 },
  editBtn: { borderColor: '#00F0FF', backgroundColor: 'rgba(0, 240, 255, 0.1)' },
  editBtnText: { color: '#00F0FF', fontSize: 11, fontWeight: 'bold' },
  deleteBtn: { borderColor: '#FF0055', backgroundColor: 'rgba(255, 0, 85, 0.1)' },
  deleteBtnText: { color: '#FF0055', fontSize: 11, fontWeight: 'bold' },
  addButton: { backgroundColor: '#FF0055', borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
  addButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
});
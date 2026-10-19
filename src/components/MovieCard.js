import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MovieCard({ movie, onEdit, onDelete }) {
  const stars = '★'.repeat(Math.min(Math.max(Math.round(movie.nota || 1), 1), 5));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{movie.titulo}</Text>
        <Text style={styles.stars}>{stars}</Text>
      </View>

      <View style={styles.tagContainer}>
        <Text style={styles.tag}>{movie.genero}</Text>
        <Text style={[styles.tag, styles.platformTag]}>{movie.plataforma}</Text>
      </View>

      <Text style={styles.details}>Assistido em: <Text style={styles.value}>{movie.dataAssistido}</Text></Text>

      {movie.descricao ? (
        <Text style={styles.review} numberOfLines={2}>
          "{movie.descricao}"
        </Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => onEdit(movie)}>
          <Text style={styles.btnTextEdit}>EDITAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => onDelete(movie.id)}>
          <Text style={styles.btnTextDelete}>EXCLUIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#19122B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2D1B4E',
    shadowColor: '#9D00FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  stars: {
    fontSize: 16,
    color: '#FFD700',
    letterSpacing: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#271947',
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00F0FF44',
  },
  platformTag: {
    color: '#FF007F',
    borderColor: '#FF007F44',
  },
  details: {
    fontSize: 13,
    color: '#A092B7',
  },
  value: {
    color: '#E0D0FF',
    fontWeight: '600',
  },
  review: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#D0C2EB',
    marginTop: 10,
    backgroundColor: '#110B1E',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF007F',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
    gap: 10,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
  },
  editBtn: {
    borderColor: '#00F0FF',
    backgroundColor: '#00F0FF11',
  },
  deleteBtn: {
    borderColor: '#FF0055',
    backgroundColor: '#FF005511',
  },
  btnTextEdit: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  btnTextDelete: {
    color: '#FF0055',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
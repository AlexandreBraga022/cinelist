/**
 * MÓDULO: REQUISIÇÕES E SERVIÇOS DO CINELIST
 * Concentra os métodos de busca, inserção, alteração e deleção de filmes.
 * Garante que todos os campos sejam enviados como String e com o identificador do usuário.
 */
import api from './api';

const TIPO_REGISTRO = 'cinelist_app';

export const getMovies = async () => {
  try {
    const response = await api.get('/dados');
    return response.data.filter((item) => item.tipoRegistro === TIPO_REGISTRO);
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    throw error;
  }
};

export const createMovie = async (movieData) => {
  try {
    const payload = {
      titulo: String(movieData.titulo || ''),
      genero: String(movieData.genero || ''),
      plataforma: String(movieData.plataforma || ''),
      nota: String(movieData.nota || ''),
      dataAssistido: String(movieData.dataAssistido || ''),
      descricao: String(movieData.descricao || ''),
      usuario: String(movieData.usuario || 'Anônimo'),
      tipoRegistro: TIPO_REGISTRO,
    };

    const response = await api.post('/dados', payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar filme:', error);
    throw error;
  }
};

export const updateMovie = async (id, movieData) => {
  try {
    const payload = {
      titulo: String(movieData.titulo || ''),
      genero: String(movieData.genero || ''),
      plataforma: String(movieData.plataforma || ''),
      nota: String(movieData.nota || ''),
      dataAssistido: String(movieData.dataAssistido || ''),
      descricao: String(movieData.descricao || ''),
      usuario: String(movieData.usuario || 'Anônimo'),
      tipoRegistro: TIPO_REGISTRO,
    };

    const response = await api.put(`/dados/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar filme:', error);
    throw error;
  }
};

export const deleteMovie = async (id) => {
  try {
    const response = await api.delete(`/dados/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir filme:', error);
    throw error;
  }
};
export const validateMovieForm = (data) => {
  const errors = {};

  if (!data.titulo || data.titulo.trim().length < 2) {
    errors.titulo = 'Digite um título válido (mín. 2 caracteres).';
  }

  if (!data.genero || data.genero.trim() === '') {
    errors.genero = 'Selecione ou digite um gênero.';
  }

  if (!data.plataforma || data.plataforma.trim() === '') {
    errors.plataforma = 'Informe o local/streaming onde assistiu.';
  }

  const notaNum = parseFloat(data.nota);
  if (isNaN(notaNum) || notaNum < 1 || notaNum > 5) {
    errors.nota = 'Insira uma nota entre 1 e 5.';
  }

  if (!data.dataAssistido || !/^\d{4}-\d{2}-\d{2}$/.test(data.dataAssistido)) {
    errors.dataAssistido = 'Data no formato AAAA-MM-DD (ex: 2026-10-20).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
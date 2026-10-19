/**
 * MÓDULO: GERENCIAMENTO DE SESSÃO DO USUÁRIO (AUTH CONTEXT)
 * Responsável por armazenar o nome do usuário logado na memória da aplicação
 * e disponibilizar as funções de login e logout para todas as telas.
 */
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Realiza o login guardando o nome do usuário
  const login = (username) => {
    if (username.trim()) {
      setUser({ name: username.trim() });
      return true;
    }
    return false;
  };

  // Encerra a sessão
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
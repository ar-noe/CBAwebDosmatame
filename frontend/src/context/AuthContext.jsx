import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Función para testing 
  const loginTestUser = (role) => {
    const testUser = {
      id: 1,
      email: 'test@example.com',
      role: role, // 'admin' o 'docente'
      name: role === 'admin' ? 'Administrador' : 'Profesor'
    };
    setUser(testUser);
    localStorage.setItem('user', JSON.stringify(testUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      loginTestUser // ← NO OLVIDES EXPORTARLA
    }}>
      {children}
    </AuthContext.Provider>
  );
};
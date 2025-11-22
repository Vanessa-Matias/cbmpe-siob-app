// contexts/UserContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface User {
  nome: string;
  cargo: string;
  matricula: string;
  email: string;
  telefone: string;
  unidadeAtuacao: string;
}

interface UserContextData {
  user: User;
  updateUser: (updatedUser: Partial<User>) => void;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({
    nome: 'Sargento Agnes Ribeiro',
    cargo: 'Chefe de Guarnição',
    matricula: '20240002',
    email: 'agnesleticia@gmail.com',
    telefone: '(81) 98765-4321',
    unidadeAtuacao: 'Grupamento de Bombeiros da Região Metropolitana do Recife',
  });

  const updateUser = (updatedUser: Partial<User>) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUser,
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextData => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export default UserContext;
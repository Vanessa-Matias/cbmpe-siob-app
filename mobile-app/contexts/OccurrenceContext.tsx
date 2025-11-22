// contexts/OccurrenceContext.tsx - VERSÃO CORRIGIDA
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface Occurrence {
  id: string;
  tipo: string;
  local: string;
  descricao: string;
  data: string;
  status: string;
  prioridade: 'Baixa' | 'Média' | 'Alta';
}

interface OccurrenceContextData {
  ocorrencias: Occurrence[]; // ✅ AGORA CHAMADO DE 'ocorrencias'
  dashboardData: {
    stats: {
      total: number;
      today: number;
      pending: number;
      inProgress: number;
      completed: number;
    };
    occurrencesByType: {
      name: string;
      count: number;
      max: number;
      color: string;
    }[];
    occurrencesByRegion: {
      name: string;
      count: number;
      max: number;
      color: string;
    }[];
  };
  loading: boolean;
  lastUpdate: Date;
  addOccurrence: (occurrence: Occurrence) => void;
  updateOccurrence: (id: string, updatedOccurrence: Partial<Occurrence>) => void;
  deleteOccurrence: (id: string) => void;
  refreshOccurrences: () => Promise<void>;
}

const OccurrenceContext = createContext<OccurrenceContextData>({} as OccurrenceContextData);

interface OccurrenceProviderProps {
  children: ReactNode;
}

export const OccurrenceProvider: React.FC<OccurrenceProviderProps> = ({ children }) => {
  const [ocorrencias, setOcorrencias] = useState<Occurrence[]>([]); // ✅ AGORA 'ocorrencias'
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Dados mockados para demonstração
  const mockOcorrencias: Occurrence[] = [
    {
      id: '1',
      tipo: 'Incêndio',
      local: 'Av. Boa Vista, 123',
      descricao: 'Incêndio em residência de dois andares',
      data: '2024-01-15 14:30',
      status: 'Em andamento',
      prioridade: 'Alta'
    },
    {
      id: '2',
      tipo: 'Salvamento',
      local: 'Praia de Boa Viagem',
      descricao: 'Pessoa em situação de afogamento',
      data: '2024-01-15 10:15',
      status: 'Concluído',
      prioridade: 'Alta'
    },
    {
      id: '3',
      tipo: 'Acidente',
      local: 'BR-101, km 45',
      descricao: 'Acidente entre caminhão e carro de passeio',
      data: '2024-01-14 16:45',
      status: 'Pendente',
      prioridade: 'Média'
    }
  ];

  const mockDashboardData = {
    stats: {
      total: 3,
      today: 2,
      pending: 1,
      inProgress: 1,
      completed: 1
    },
    occurrencesByType: [
      { name: 'Incêndio', count: 1, max: 20, color: '#ff69b4' },
      { name: 'Salvamento', count: 1, max: 20, color: '#32CD32' },
      { name: 'Afogamento', count: 0, max: 20, color: '#FFD700' },
      { name: 'Deslizamento', count: 0, max: 20, color: '#6495ed' },
      { name: 'Outros', count: 1, max: 20, color: '#ffa500' },
    ],
    occurrencesByRegion: [
      { name: 'Recife', count: 1, max: 10, color: '#AE1A16' },
      { name: 'CabuGá', count: 0, max: 10, color: '#AE1A16' },
      { name: 'Boa Vista', count: 1, max: 10, color: '#FF8C00' },
      { name: 'Av. Agamenon', count: 0, max: 10, color: '#AE1A16' },
      { name: 'Madalena', count: 1, max: 10, color: '#AE1A16' },
      { name: 'Tamarineira', count: 0, max: 10, color: '#FF8C00' },
    ]
  };

  // Inicializa com dados mockados
  useEffect(() => {
    setOcorrencias(mockOcorrencias);
  }, []);

  const addOccurrence = (occurrence: Occurrence) => {
    setOcorrencias(prev => [...prev, occurrence]);
    setLastUpdate(new Date());
  };

  const updateOccurrence = (id: string, updatedOccurrence: Partial<Occurrence>) => {
    setOcorrencias(prev =>
      prev.map(occ => occ.id === id ? { ...occ, ...updatedOccurrence } : occ)
    );
    setLastUpdate(new Date());
  };

  const deleteOccurrence = (id: string) => {
    setOcorrencias(prev => prev.filter(occ => occ.id !== id));
    setLastUpdate(new Date());
  };

  const refreshOccurrences = async (): Promise<void> => {
    setLoading(true);
    // Simula uma requisição à API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setLoading(false);
  };

  return (
    <OccurrenceContext.Provider value={{
      ocorrencias, // ✅ AGORA RETORNA 'ocorrencias'
      dashboardData: mockDashboardData,
      loading,
      lastUpdate,
      addOccurrence,
      updateOccurrence,
      deleteOccurrence,
      refreshOccurrences
    }}>
      {children}
    </OccurrenceContext.Provider>
  );
};

export const useOccurrences = (): OccurrenceContextData => {
  const context = useContext(OccurrenceContext);

  if (!context) {
    throw new Error('useOccurrences must be used within a OccurrenceProvider');
  }

  return context;
};

export default OccurrenceContext;
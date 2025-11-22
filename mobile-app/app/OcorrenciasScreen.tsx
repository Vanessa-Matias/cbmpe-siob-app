// OcorrenciasScreen.tsx - VERSÃO COM NAVEGAÇÃO PARA EDIÇÃO
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import SidebarMenu from '../components/ui/SidebarMenu';
import { useOccurrences } from '../contexts/OccurrenceContext';

const SIOB_COLORS = {
  primary: '#AE1A16',
  white: '#FFFFFF',
  text: '#212529',
  background: '#f8f9fa',
  cardBg: '#FFFFFF',
  border: '#dee2e6',
  cardLaranjaPadrao: '#FF8C00',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
};

// Componente para ícone de prioridade
const PrioridadeIcon = ({ prioridade }: { prioridade: 'Baixa' | 'Média' | 'Alta' }) => {
  let iconName: 'arrow-downward' | 'remove' | 'arrow-upward' = 'remove';
  let color = SIOB_COLORS.success;

  if (prioridade === 'Alta') {
    iconName = 'arrow-upward';
    color = SIOB_COLORS.primary;
  } else if (prioridade === 'Média') {
    iconName = 'remove';
    color = SIOB_COLORS.warning;
  } else if (prioridade === 'Baixa') {
    iconName = 'arrow-downward';
    color = SIOB_COLORS.success;
  }

  return (
    <View style={styles.prioridadeContainer}>
      <MaterialIcons name={iconName} size={16} color={color} />
      <Text style={[styles.prioridadeText, { color }]}>{prioridade}</Text>
    </View>
  );
};

// Componente para badge de status
const StatusBadge = ({ status }: { status: string }) => {
  let backgroundColor = SIOB_COLORS.warning;

  if (status === 'Concluído') backgroundColor = SIOB_COLORS.success;
  if (status === 'Pendente') backgroundColor = SIOB_COLORS.cardLaranjaPadrao;

  return (
    <View style={[styles.statusBadge, { backgroundColor }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

export default function OcorrenciasScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // ✅ USA O CONTEXTO
  const { ocorrencias, refreshOccurrences, loading } = useOccurrences();

  console.log('📱 OcorrenciasScreen - Recebendo', ocorrencias.length, 'ocorrências');
  console.log('📋 Lista completa:', ocorrencias);

  // ✅ FUNÇÃO PARA ABRIR EDIÇÃO DA OCORRÊNCIA
  const handleEditOcorrencia = (ocorrencia: any) => {
    console.log('📱 Editando ocorrência:', ocorrencia.id);

    // Navega para a NovaOcorrenciaScreen em modo de edição
    router.push({
      pathname: '/NovaOcorrenciaScreen',
      params: {
        modoEdicao: 'true',
        ocorrenciaId: ocorrencia.id,
        ocorrenciaData: JSON.stringify(ocorrencia) // Passa os dados da ocorrência
      }
    });
  };

  const filteredOcorrencias = ocorrencias.filter(ocorrencia => {
    const matchesSearch = ocorrencia.tipo.toLowerCase().includes(searchText.toLowerCase()) ||
      ocorrencia.local.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || ocorrencia.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const onRefresh = async () => {
    console.log('🔄 Atualizando ocorrências...');
    await refreshOccurrences();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={SIOB_COLORS.primary} barStyle="light-content" />
      <SidebarMenu isVisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuButton}>
            <MaterialIcons name="menu" size={24} color={SIOB_COLORS.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Ocorrências</Text>

          <TouchableOpacity
            style={styles.novaOcorrenciaButton}
            onPress={() => router.push('/NovaOcorrenciaScreen')}
          >
            <MaterialIcons name="add" size={20} color={SIOB_COLORS.white} />
            <Text style={styles.novaOcorrenciaText}>Nova Ocorrência</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={[SIOB_COLORS.primary]}
              tintColor={SIOB_COLORS.primary}
            />
          }
        >
          {/* DEBUG INFO */}
          <View style={styles.debugSection}>
            <Text style={styles.debugText}>
              📊 Ocorrências carregadas: {ocorrencias.length}
            </Text>
            <Text style={styles.debugText}>
              🔍 Ocorrências filtradas: {filteredOcorrencias.length}
            </Text>
          </View>

          {/* Barra de Pesquisa */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar ocorrências..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
            </View>

            {/* Filtros */}
            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Filtrar por status:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {['Todos', 'Em andamento', 'Pendente', 'Concluído'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[styles.filterButton, filterStatus === status && styles.filterButtonActive]}
                    onPress={() => setFilterStatus(status)}
                  >
                    <Text style={[styles.filterButtonText, filterStatus === status && styles.filterButtonTextActive]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Lista de Ocorrências */}
          <View style={styles.ocorrenciasList}>
            {filteredOcorrencias.map((ocorrencia) => (
              // ✅ ENVOLVE O CARD COM TOUCHABLEOPACITY PARA CLICAR E EDITAR
              <TouchableOpacity
                key={ocorrencia.id}
                onPress={() => handleEditOcorrencia(ocorrencia)}
                activeOpacity={0.7}
              >
                <View style={styles.ocorrenciaCard}>
                  {/* Cabeçalho com tipo, status e prioridade */}
                  <View style={styles.ocorrenciaHeader}>
                    <View style={styles.ocorrenciaTipoContainer}>
                      <MaterialIcons name="warning" size={18} color={SIOB_COLORS.primary} />
                      <Text style={styles.ocorrenciaTipo}>{ocorrencia.tipo}</Text>
                    </View>
                    <View style={styles.headerBadges}>
                      <StatusBadge status={ocorrencia.status} />
                      <PrioridadeIcon prioridade={ocorrencia.prioridade} />
                    </View>
                  </View>

                  {/* Informações da ocorrência */}
                  <View style={styles.ocorrenciaContent}>
                    <Text style={styles.ocorrenciaLocal}>{ocorrencia.local}</Text>
                    <Text style={styles.ocorrenciaDescricao}>{ocorrencia.descricao}</Text>

                    <View style={styles.ocorrenciaFooter}>
                      <Text style={styles.ocorrenciaData}>{ocorrencia.data}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {filteredOcorrencias.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>Nenhuma ocorrência encontrada</Text>
              <Text style={styles.emptyStateSubtext}>
                Total no contexto: {ocorrencias.length} ocorrências
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SIOB_COLORS.background,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    backgroundColor: SIOB_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SIOB_COLORS.white,
  },
  novaOcorrenciaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  novaOcorrenciaText: {
    color: SIOB_COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  debugSection: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: SIOB_COLORS.primary,
  },
  debugText: {
    fontSize: 12,
    color: '#1565c0',
    fontWeight: '500',
    marginBottom: 4,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SIOB_COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: SIOB_COLORS.text,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: SIOB_COLORS.text,
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: SIOB_COLORS.white,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: SIOB_COLORS.primary,
    borderColor: SIOB_COLORS.primary,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: SIOB_COLORS.text,
  },
  filterButtonTextActive: {
    color: SIOB_COLORS.white,
  },
  ocorrenciasList: {
    gap: 16,
  },
  ocorrenciaCard: {
    backgroundColor: SIOB_COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
    overflow: 'hidden',
  },
  ocorrenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    backgroundColor: '#f8f9fa',
  },
  ocorrenciaTipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ocorrenciaTipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
    marginLeft: 8,
  },
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prioridadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prioridadeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  ocorrenciaContent: {
    padding: 16,
    paddingTop: 0,
  },
  ocorrenciaLocal: {
    fontSize: 14,
    color: SIOB_COLORS.text,
    marginBottom: 4,
    fontWeight: '500',
  },
  ocorrenciaDescricao: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  ocorrenciaFooter: {
    borderTopWidth: 1,
    borderTopColor: SIOB_COLORS.border,
    paddingTop: 12,
  },
  ocorrenciaData: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: SIOB_COLORS.white,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
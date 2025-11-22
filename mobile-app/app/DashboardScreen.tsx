// DashboardScreen.tsx - VERSÃO COM MAPA
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  cinzaClaro: '#e9ecef',
  chartPink: '#ff69b4',
  chartGreen: '#32CD32',
  chartYellow: '#FFD700',
  chartBlue: '#6495ed',
  chartOrange: '#ffa500',
};

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 45) / 2;

const SummaryCard = ({
  title,
  value,
  color,
  subIcon
}: {
  title: string;
  value: number;
  color: string;
  subIcon: keyof typeof MaterialCommunityIcons.glyphMap;
}) => (
  <View style={[styles.summaryCard, { backgroundColor: color }]}>
    <View style={styles.summaryTop}>
      <Text style={styles.summaryValue}>{value}</Text>
      <MaterialCommunityIcons name={subIcon} size={24} color={SIOB_COLORS.white} />
    </View>
    <Text style={styles.summaryTitle}>{title}</Text>
  </View>
);

// Componente para as barras de ocorrências por tipo
const TipoBar = ({ name, count, max, color }: { name: string; count: number; max: number; color: string }) => (
  <View style={styles.tipoBarContainer}>
    <View style={styles.tipoBarHeader}>
      <Text style={styles.tipoBarLabel}>{name}</Text>
      <Text style={styles.tipoBarCount}>{count}/{max}</Text>
    </View>
    <View style={styles.tipoProgressBarWrapper}>
      <View
        style={[
          styles.tipoProgressBar,
          {
            width: `${(count / max) * 100}%`,
            backgroundColor: color
          }
        ]}
      />
    </View>
    <Text style={styles.tipoPercentage}>{((count / max) * 100).toFixed(0)}%</Text>
  </View>
);

export default function DashboardScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  // ✅ USA O CONTEXTO - MAS SE FALHAR, USA VALORES PADRÃO
  let dashboardData;
  let refreshOccurrences = () => Promise.resolve();
  let loading = false;
  let lastUpdate = new Date();

  try {
    const context = useOccurrences();
    dashboardData = context.dashboardData;
    refreshOccurrences = context.refreshOccurrences;
    loading = context.loading;
    lastUpdate = context.lastUpdate;
  } catch (error) {
    console.log('⚠️ DashboardScreen: Contexto não disponível, usando dados padrão');
    // Dados padrão caso o contexto não esteja disponível
    dashboardData = {
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
  }

  const dashboardCards = [
    {
      title: 'Ocorrências Hoje',
      value: dashboardData.stats.today,
      color: SIOB_COLORS.cardLaranjaPadrao,
      subIcon: 'alert' as const
    },
    {
      title: 'Em andamento',
      value: dashboardData.stats.inProgress,
      color: SIOB_COLORS.cardLaranjaPadrao,
      subIcon: 'history' as const
    },
    {
      title: 'Pendente',
      value: dashboardData.stats.pending,
      color: SIOB_COLORS.cardLaranjaPadrao,
      subIcon: 'clock' as const
    },
    {
      title: 'Concluído',
      value: dashboardData.stats.completed,
      color: SIOB_COLORS.cardLaranjaPadrao,
      subIcon: 'check-circle' as const
    },
  ];

  const ocorrenciasPorTipo = dashboardData.occurrencesByType.length > 0
    ? dashboardData.occurrencesByType
    : [
      { name: 'Incêndio', count: 0, max: 20, color: SIOB_COLORS.chartPink },
      { name: 'Salvamento', count: 0, max: 20, color: SIOB_COLORS.chartGreen },
      { name: 'Afogamento', count: 0, max: 20, color: SIOB_COLORS.chartYellow },
      { name: 'Deslizamento', count: 0, max: 20, color: SIOB_COLORS.chartBlue },
      { name: 'Outros', count: 0, max: 20, color: SIOB_COLORS.chartOrange },
    ];

  const regionalData = dashboardData.occurrencesByRegion.length > 0
    ? dashboardData.occurrencesByRegion
    : [
      { name: 'Recife', count: 0, max: 10, color: SIOB_COLORS.primary },
      { name: 'CabuGá', count: 0, max: 10, color: SIOB_COLORS.primary },
      { name: 'Boa Vista', count: 0, max: 10, color: SIOB_COLORS.cardLaranjaPadrao },
      { name: 'Av. Agamenon', count: 0, max: 10, color: SIOB_COLORS.primary },
      { name: 'Madalena', count: 0, max: 10, color: SIOB_COLORS.primary },
      { name: 'Tamarineira', count: 0, max: 10, color: SIOB_COLORS.cardLaranjaPadrao },
    ];

  const onRefresh = async () => {
    await refreshOccurrences();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER COM BOTÃO MENU */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          >
            <MaterialIcons name="menu" size={28} color={SIOB_COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={[SIOB_COLORS.primary]}
              tintColor={SIOB_COLORS.primary}
            />
          }
        >
          {/* CARDS DE RESUMO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visão Geral</Text>
            <View style={styles.cardsGrid}>
              {dashboardCards.map((card, index) => (
                <SummaryCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  color={card.color}
                  subIcon={card.subIcon}
                />
              ))}
            </View>
          </View>

          {/* BARRAS DE OCORRÊNCIAS POR TIPO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ocorrências por Tipo</Text>
            <View style={styles.tipoBarsContainer}>
              {ocorrenciasPorTipo.map((tipo, index) => (
                <TipoBar
                  key={index}
                  name={tipo.name}
                  count={tipo.count}
                  max={tipo.max}
                  color={tipo.color}
                />
              ))}
            </View>
          </View>

          {/* BARRAS DE PROGRESSO POR REGIÃO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ocorrências por Região</Text>
            <View style={styles.barsContainer}>
              {regionalData.map((data, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barHeader}>
                    <Text style={styles.barLabel}>{data.name}</Text>
                    <Text style={styles.barCount}>{data.count}/{data.max}</Text>
                  </View>
                  <View style={styles.progressBarWrapper}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${(data.count / data.max) * 100}%`,
                          backgroundColor: data.color
                        }
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* MAPA REAL COM OPENSTREETMAP */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mapa de Ocorrências</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                  latitude: -8.0476, // Coordenadas do Recife
                  longitude: -34.8770,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
                scrollEnabled={true}
                zoomEnabled={true}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <UrlTile
                  urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
                  flipY={false}
                />
              </MapView>
              <Text style={styles.mapText}>
                Mapa em integração{"\n"}
                Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* MENU LATERAL */}
        <SidebarMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SIOB_COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: SIOB_COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SIOB_COLORS.white,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 33,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
    marginBottom: 15,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'space-between',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SIOB_COLORS.white
  },
  summaryTitle: {
    fontSize: 14,
    color: SIOB_COLORS.white,
    marginTop: 8,
    fontWeight: '500',
  },
  // ESTILOS PARA AS BARRAS DE TIPO
  tipoBarsContainer: {
    backgroundColor: SIOB_COLORS.cardBg,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tipoBarContainer: {
    marginBottom: 16,
  },
  tipoBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipoBarLabel: {
    fontSize: 14,
    color: SIOB_COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  tipoBarCount: {
    fontSize: 12,
    color: SIOB_COLORS.text,
    fontWeight: 'bold',
  },
  tipoProgressBarWrapper: {
    backgroundColor: SIOB_COLORS.cinzaClaro,
    borderRadius: 5,
    height: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  tipoProgressBar: {
    height: '100%',
    borderRadius: 5,
  },
  tipoPercentage: {
    fontSize: 11,
    color: SIOB_COLORS.text,
    fontWeight: '500',
    textAlign: 'right',
  },
  // ESTILOS PARA AS BARRAS DE REGIÃO
  barsContainer: {
    backgroundColor: SIOB_COLORS.cardBg,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  barContainer: {
    marginBottom: 15,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 14,
    color: SIOB_COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  barCount: {
    fontSize: 12,
    color: SIOB_COLORS.text,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  progressBarWrapper: {
    backgroundColor: SIOB_COLORS.cinzaClaro,
    borderRadius: 5,
    height: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  // ESTILOS DO MAPA
  mapContainer: {
    backgroundColor: SIOB_COLORS.cardBg,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  map: {
    height: 200,
    width: '100%',
    borderRadius: 8,
    marginBottom: 10,
  },
  mapText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
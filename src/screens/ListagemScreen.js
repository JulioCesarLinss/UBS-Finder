import React, { useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import UBSCard from '../components/UBSCard';
import EmptyState from '../components/EmptyState';
import { useUBSData } from '../hooks/useUBSData';
import { useLocalizacao } from '../hooks/useLocalizacao';
import { COLORS } from '../constants/colors';

const ACESSO_RAPIDO = [
  {
    id: 'emergencia',
    label: 'Emergência',
    sub: '24h disponível',
    icone: 'pulse',
    cor: COLORS.tipoUrgencia,
    tipo: 'Urgência',
  },
  {
    id: 'vacinacao',
    label: 'Vacinação',
    sub: 'Postos disponíveis',
    icone: 'medical',
    cor: '#38B000',
    servico: 'Vacinação',
  },
  {
    id: 'odontologia',
    label: 'Odontologia',
    sub: 'Saúde bucal',
    icone: 'happy-outline',
    cor: '#2A9D8F',
    servico: 'Odontologia',
  },
  {
    id: 'favoritos',
    label: 'Favoritos',
    sub: 'Suas UBS salvas',
    icone: 'heart',
    cor: '#4BB8E4',
    navFavoritos: true,
  },
];

export default function ListagemScreen({ navigation }) {
  const { localizacao, cidade, carregando: carregandoGPS } = useLocalizacao();
  const {
    busca, setBusca,
    filtroTipo, setFiltroTipo,
    filtroServico, setFiltroServico,
    resultado,
    statusDados,
    erroApi,
    recarregar,
    totalDados,
  } = useUBSData(localizacao);

  const listRef = useRef(null);

  const handleFiltroTipo = (tipo) => {
    setFiltroTipo(tipo);
    setFiltroServico(null);
  };

  const handleAcessoRapido = (item) => {
    if (item.navFavoritos) {
      navigation.navigate('Favoritos');
      return;
    }
    if (item.tipo) {
      setFiltroTipo(filtroTipo === item.tipo ? null : item.tipo);
      setFiltroServico(null);
    }
    if (item.servico) {
      setFiltroServico(filtroServico === item.servico ? null : item.servico);
      setFiltroTipo(null);
    }
    listRef.current?.scrollToOffset({ offset: 420, animated: true });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        ref={listRef}
        data={resultado}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <UBSCard
            item={item}
            onPress={() => navigation.navigate('Detalhes', { ubs: item })}
          />
        )}
        ListHeaderComponent={
          <ListHeader
            busca={busca}
            setBusca={setBusca}
            filtroTipo={filtroTipo}
            setFiltroTipo={handleFiltroTipo}
            filtroServico={filtroServico}
            onAcessoRapido={handleAcessoRapido}
            cidade={cidade}
            carregandoGPS={carregandoGPS}
            statusDados={statusDados}
            erroApi={erroApi}
            recarregar={recarregar}
            totalDados={totalDados}
            totalResultados={resultado.length}
          />
        }
        ListEmptyComponent={
          statusDados === 'loading' ? null : (
            <EmptyState mensagem="Nenhuma unidade encontrada para essa busca." />
          )
        }
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}

// ─── Subcomponente de cabeçalho ──────────────────────────────────────────────

function ListHeader({
  busca, setBusca,
  filtroTipo, setFiltroTipo,
  filtroServico, onAcessoRapido,
  cidade, carregandoGPS,
  statusDados, erroApi, recarregar, totalDados,
  totalResultados,
}) {
  return (
    <View>
      {/* Cabeçalho azul */}
      <View style={styles.header}>
        <View style={styles.headerEsquerda}>
          <Ionicons name="location" size={20} color={COLORS.white} />
          <View style={styles.headerTextos}>
            <Text style={styles.headerSub}>Localização atual</Text>
            {carregandoGPS ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.headerLocal}>{cidade}</Text>
            )}
          </View>
        </View>
      </View>

      {/* SearchBar sobreposta ao header */}
      <View style={styles.searchWrapper}>
        <SearchBar value={busca} onChangeText={setBusca} />
      </View>

      {/* Banner de status da fonte de dados */}
      <FonteBanner
        statusDados={statusDados}
        erroApi={erroApi}
        recarregar={recarregar}
        totalDados={totalDados}
      />

      {/* Acesso Rápido */}
      <Text style={styles.secaoTitulo}>Acesso Rápido</Text>
      <View style={styles.grid}>
        {ACESSO_RAPIDO.map((item) => {
          const ativo =
            !item.navFavoritos &&
            ((item.tipo && filtroTipo === item.tipo) ||
              (item.servico && filtroServico === item.servico));
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, ativo && styles.cardAtivo]}
              onPress={() => onAcessoRapido(item)}
              activeOpacity={0.82}
              accessibilityLabel={item.label}
            >
              <View style={[styles.cardIcone, { backgroundColor: item.cor }]}>
                <Ionicons name={item.icone} size={26} color={COLORS.white} />
              </View>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Título da lista + filtros */}
      <Text style={styles.secaoTitulo}>Unidades de Saúde</Text>
      <FilterBar ativo={filtroTipo} onChange={setFiltroTipo} />
      <Text style={styles.contador}>
        {totalResultados} {totalResultados === 1 ? 'unidade encontrada' : 'unidades encontradas'}
      </Text>
    </View>
  );
}

// ─── Banner que indica a origem dos dados ────────────────────────────────────

function FonteBanner({ statusDados, erroApi, recarregar, totalDados }) {
  if (statusDados === 'idle') return null;

  if (statusDados === 'loading') {
    return (
      <View style={[styles.banner, styles.bannerInfo]}>
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 8 }} />
        <Text style={styles.bannerTexto}>Buscando unidades próximas (CNES/DATASUS)…</Text>
      </View>
    );
  }

  if (statusDados === 'api') {
    return (
      <View style={[styles.banner, styles.bannerSucesso]}>
        <Ionicons name="checkmark-circle" size={16} color="#38B000" />
        <Text style={[styles.bannerTexto, { color: '#2A7A00' }]}>
          {totalDados} unidades reais (CNES/DATASUS)
        </Text>
      </View>
    );
  }

  // statusDados === 'local' — fallback silencioso, não exibe aviso
  return null;
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  lista: {
    paddingBottom: 24,
    flexGrow: 1,
  },

  /* Header */
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTextos: {
    gap: 1,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
  },
  headerLocal: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#38B000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  /* SearchBar */
  searchWrapper: {
    marginTop: -20,
    marginHorizontal: 16,
    marginBottom: 8,
  },

  /* Banner de status */
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  bannerInfo: {
    backgroundColor: COLORS.primaryLight,
  },
  bannerSucesso: {
    backgroundColor: '#ECFCE4',
  },
  bannerAviso: {
    backgroundColor: '#FEF3C7',
  },
  bannerTexto: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  bannerBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
  },
  bannerBotaoTexto: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },

  contador: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },

  /* Seções */
  secaoTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },

  /* Grid de acesso rápido */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
  },
  card: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  cardAtivo: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cardIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});

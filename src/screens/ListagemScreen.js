import React, { useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import UBSCard from '../components/UBSCard';
import EmptyState from '../components/EmptyState';
import { useUBSFiltro } from '../hooks/useUBSFiltro';
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
    cor: '#4BB8E8',
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
  } = useUBSFiltro(localizacao);
  const listRef = useRef(null);

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

  const handleFiltroTipo = (tipo) => {
    setFiltroTipo(tipo);
    setFiltroServico(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        ref={listRef}
        data={resultado}
        keyExtractor={(item) => item.id}
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
          />
        }
        ListEmptyComponent={
          <EmptyState mensagem="Nenhuma unidade encontrada para essa busca." />
        }
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}

function ListHeader({ busca, setBusca, filtroTipo, setFiltroTipo, filtroServico, onAcessoRapido, cidade, carregandoGPS }) {
  return (
    <View>
      {/* Header azul */}
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
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>U</Text>
        </View>
      </View>

      {/* SearchBar sobreposta ao header */}
      <View style={styles.searchWrapper}>
        <SearchBar value={busca} onChangeText={setBusca} />
      </View>

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
    </View>
  );
}

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

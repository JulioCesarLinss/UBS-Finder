import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritos } from '../hooks/useFavoritos';
import { openGoogleMaps } from '../utils/maps';
import ServicosBadge from '../components/ServicosBadge';
import { COLORS } from '../constants/colors';
import { TIPO_CORES } from '../constants/tipos';

export default function DetalhesScreen({ route }) {
  const { ubs } = route.params;
  const { isFavorito, carregarFavoritos, toggleFavorito } = useFavoritos(ubs.id);

  const compartilhar = async () => {
    await Share.share({
      message: `🏥 ${ubs.no_fantasia}\n📍 ${ubs.ds_endereco} — ${ubs.no_bairro}\n⏰ ${ubs.ds_horario}\n\nEncontrado pelo UBS Finder`,
    });
  };

  const corTipo = TIPO_CORES[ubs.tp_unidade] || COLORS.primary;

  useEffect(() => {
    carregarFavoritos();
  }, [carregarFavoritos]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Cabeçalho */}
        <View style={[styles.cabecalho, { borderLeftColor: corTipo }]}>
          <View style={[styles.tipoBadge, { backgroundColor: corTipo }]}>
            <Text style={styles.tipoTexto}>{ubs.tp_unidade}</Text>
          </View>
          <Text style={styles.nome}>{ubs.no_fantasia}</Text>
          <View style={styles.bairroLinha}>
            <Ionicons name="location" size={16} color={corTipo} />
            <Text style={[styles.bairro, { color: corTipo }]}>{ubs.no_bairro}</Text>
          </View>
        </View>

        {/* Informações */}
        <View style={styles.secao}>
          <InfoLinha
            icone="map-outline"
            label="Endereço"
            valor={ubs.ds_endereco + ' — ' + ubs.no_bairro}
          />
          <InfoLinha
            icone="time-outline"
            label="Horário de Funcionamento"
            valor={ubs.ds_horario}
          />
          {ubs.telefone ? (
            <InfoLinha
              icone="call-outline"
              label="Telefone"
              valor={ubs.telefone}
            />
          ) : null}
        </View>

        {/* Serviços */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Serviços Disponíveis</Text>
          <View style={styles.servicosContainer}>
            {ubs.servicos.map((s) => (
              <ServicosBadge key={s} nome={s} />
            ))}
          </View>
        </View>

        {/* Botões de ação */}
        <View style={styles.botoes}>
          <TouchableOpacity
            style={[styles.botao, styles.botaoPrimario]}
            onPress={() => openGoogleMaps(ubs.latitude, ubs.longitude, ubs.no_fantasia)}
            activeOpacity={0.85}
            accessibilityLabel="Abrir localização no Google Maps"
          >
            <Ionicons name="map" size={20} color={COLORS.white} />
            <Text style={styles.botaoTextoPrimario}>Abrir no Maps</Text>
          </TouchableOpacity>

          <View style={styles.botoesLinha}>
            <TouchableOpacity
              style={[styles.botao, styles.botaoSecundario, isFavorito && styles.botaoFavoritoAtivo, { flex: 1 }]}
              onPress={() => toggleFavorito(ubs)}
              activeOpacity={0.85}
              accessibilityLabel={isFavorito ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Ionicons
                name={isFavorito ? 'star' : 'star-outline'}
                size={20}
                color={isFavorito ? COLORS.white : COLORS.primary}
              />
              <Text style={[styles.botaoTextoSecundario, isFavorito && styles.botaoTextoBranco]}>
                {isFavorito ? 'Salvo' : 'Favoritar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, styles.botaoSecundario, { flex: 1 }]}
              onPress={compartilhar}
              activeOpacity={0.85}
              accessibilityLabel="Compartilhar esta unidade"
            >
              <Ionicons name="share-social-outline" size={20} color={COLORS.primary} />
              <Text style={styles.botaoTextoSecundario}>Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoLinha({ icone, label, valor }) {
  return (
    <View style={styles.infoLinha}>
      <Ionicons name={icone} size={22} color={COLORS.primary} style={styles.infoIcone} />
      <View style={styles.infoTextos}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValor}>{valor}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
  cabecalho: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 5,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tipoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tipoTexto: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  nome: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 28,
  },
  bairroLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bairro: {
    fontSize: 14,
    fontWeight: '600',
  },
  secao: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcone: {
    marginTop: 2,
  },
  infoTextos: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValor: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  servicosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  botoes: {
    gap: 12,
    marginTop: 4,
  },
  botoesLinha: {
    flexDirection: 'row',
    gap: 12,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    gap: 10,
  },
  botaoPrimario: {
    backgroundColor: COLORS.primary,
  },
  botaoSecundario: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  botaoFavoritoAtivo: {
    backgroundColor: '#F4A261',
    borderColor: '#F4A261',
  },
  botaoTextoPrimario: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  botaoTextoSecundario: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  botaoTextoBranco: {
    color: COLORS.white,
  },
});

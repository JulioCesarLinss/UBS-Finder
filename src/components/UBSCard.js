import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { TIPO_CORES } from '../constants/tipos';
import { formatarDistancia } from '../utils/distancia';

export default function UBSCard({ item, onPress }) {
  const corTipo = TIPO_CORES[item.tp_unidade] || COLORS.primary;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel={`Ver detalhes de ${item.no_fantasia}`}
    >
      <View style={[styles.strip, { backgroundColor: corTipo }]} />
      <View style={styles.conteudo}>
        <View style={styles.cabecalho}>
          <Text style={styles.nome} numberOfLines={2}>
            {item.no_fantasia}
          </Text>
          <View style={[styles.badge, { backgroundColor: corTipo }]}>
            <Text style={styles.badgeTexto}>{item.tp_unidade}</Text>
          </View>
        </View>
        <View style={styles.linha}>
          <Ionicons name="location-outline" size={15} color={COLORS.textSecondary} />
          <Text style={styles.info} numberOfLines={1}>
            {item.ds_endereco} — {item.no_bairro}
          </Text>
        </View>
        <View style={styles.rodape}>
          <View style={styles.linha}>
            <Ionicons name="time-outline" size={15} color={COLORS.textSecondary} />
            <Text style={styles.info} numberOfLines={1}>
              {item.ds_horario}
            </Text>
          </View>
          {item.distanciaKm !== undefined && (
            <View style={styles.distanciaTag}>
              <Ionicons name="navigate-outline" size={13} color={COLORS.primary} />
              <Text style={styles.distanciaTexto}>
                {formatarDistancia(item.distanciaKm)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  strip: {
    width: 5,
  },
  conteudo: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  nome: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeTexto: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  info: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  distanciaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  distanciaTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

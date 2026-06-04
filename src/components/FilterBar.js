import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { TIPOS_FILTRO } from '../constants/tipos';

export default function FilterBar({ ativo, onChange }) {
  const handlePress = (tipo) => {
    if (tipo === 'Todos') {
      onChange(null);
    } else {
      onChange(ativo === tipo ? null : tipo);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {TIPOS_FILTRO.map((tipo) => {
        const isAtivo = tipo === 'Todos' ? ativo === null : ativo === tipo;
        return (
          <TouchableOpacity
            key={tipo}
            style={[styles.pill, isAtivo && styles.pillAtivo]}
            onPress={() => handlePress(tipo)}
            activeOpacity={0.8}
            accessibilityLabel={`Filtrar por ${tipo}`}
            accessibilityState={{ selected: isAtivo }}
          >
            <Text style={[styles.texto, isAtivo && styles.textoAtivo]}>{tipo}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 36,
    justifyContent: 'center',
  },
  pillAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  texto: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  textoAtivo: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

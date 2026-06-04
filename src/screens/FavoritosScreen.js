import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import UBSCard from '../components/UBSCard';
import EmptyState from '../components/EmptyState';
import { useFavoritos } from '../hooks/useFavoritos';
import { COLORS } from '../constants/colors';

export default function FavoritosScreen({ navigation }) {
  const { favoritos, carregarFavoritos } = useFavoritos();

  useFocusEffect(
    React.useCallback(() => {
      carregarFavoritos();
    }, [carregarFavoritos])
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UBSCard
            item={item}
            onPress={() => navigation.navigate('DetalhesFav', { ubs: item })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            mensagem={
              'Você ainda não salvou nenhuma unidade.\n\nToque em uma UBS e pressione "Salvar Favorito".'
            }
          />
        }
        contentContainerStyle={styles.lista}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  lista: {
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
});

import { useState, useCallback } from 'react';
import { getFavoritos, salvarFavorito, removerFavorito } from '../utils/storage';

export function useFavoritos(ubsId) {
  const [favoritos, setFavoritos] = useState([]);
  const [isFavorito, setIsFavorito] = useState(false);

  const carregarFavoritos = useCallback(async () => {
    const lista = await getFavoritos();
    setFavoritos(lista);
    if (ubsId) {
      setIsFavorito(lista.some((f) => f.id === ubsId));
    }
  }, [ubsId]);

  const toggleFavorito = useCallback(
    async (ubs) => {
      if (isFavorito) {
        await removerFavorito(ubs.id);
      } else {
        await salvarFavorito(ubs);
      }
      await carregarFavoritos();
    },
    [isFavorito, carregarFavoritos]
  );

  return { favoritos, isFavorito, carregarFavoritos, toggleFavorito };
}

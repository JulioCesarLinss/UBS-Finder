import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export function useLocalizacao() {
  const [localizacao, setLocalizacao] = useState(null);
  const [cidade, setCidade] = useState('Recife, PE');
  const [carregando, setCarregando] = useState(true);
  const [permissaoNegada, setPermissaoNegada] = useState(false);

  useEffect(() => {
    async function obter() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissaoNegada(true);
        setCarregando(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocalizacao(pos.coords);

      try {
        const [end] = await Location.reverseGeocodeAsync(pos.coords);
        if (end) {
          const nome = end.city || end.district || end.subregion || 'Recife';
          const estado = end.region || 'PE';
          setCidade(`${nome}, ${estado}`);
        }
      } catch {
        // fallback para "Recife, PE"
      }

      setCarregando(false);
    }

    obter();
  }, []);

  return { localizacao, cidade, carregando, permissaoNegada };
}

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const ESTADOS = {
  'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM',
  'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF',
  'Espírito Santo': 'ES', 'Goiás': 'GO', 'Maranhão': 'MA',
  'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS', 'Minas Gerais': 'MG',
  'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR', 'Pernambuco': 'PE',
  'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR',
  'Santa Catarina': 'SC', 'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO',
};

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
        accuracy: Location.Accuracy.High,
      });

      setLocalizacao(pos.coords);

      try {
        const [end] = await Location.reverseGeocodeAsync(pos.coords);
        if (end) {
          const bairro = end.district || end.subregion || end.neighborhood;
          const cidade = end.city || 'Recife';
          const siglaEstado = ESTADOS[end.region] || end.region || 'PE';
          const nome = bairro ? `${bairro}, ${cidade}` : `${cidade}, ${siglaEstado}`;
          setCidade(nome);
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

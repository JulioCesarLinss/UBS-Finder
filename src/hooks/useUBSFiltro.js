import { useState, useEffect } from 'react';
import dados from '../data/ubs.json';
import { calcularDistanciaKm } from '../utils/distancia';

export function useUBSFiltro(localizacao) {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [resultado, setResultado] = useState(dados);

  useEffect(() => {
    let lista = [...dados];

    if (filtroTipo) {
      lista = lista.filter((u) => u.tp_unidade === filtroTipo);
    }

    if (busca.trim().length > 0) {
      const termo = busca.toLowerCase();
      lista = lista.filter(
        (u) =>
          u.no_fantasia.toLowerCase().includes(termo) ||
          u.no_bairro.toLowerCase().includes(termo)
      );
    }

    if (localizacao) {
      lista = lista
        .map((u) => ({
          ...u,
          distanciaKm: calcularDistanciaKm(
            localizacao.latitude,
            localizacao.longitude,
            u.latitude,
            u.longitude
          ),
        }))
        .sort((a, b) => a.distanciaKm - b.distanciaKm);
    }

    setResultado(lista);
  }, [busca, filtroTipo, localizacao]);

  return { busca, setBusca, filtroTipo, setFiltroTipo, resultado };
}

/**
 * useUBSData
 *
 * Orquestra os dados de UBS:
 *  1. Tenta buscar da API TCU (dados reais do CNES) quando há localização.
 *  2. Se a API falhar ou não houver GPS, usa os dados locais (ubs.json).
 *  3. Aplica filtros de busca, tipo e serviço sobre o resultado.
 *
 * Estados de origem dos dados:
 *   'idle'       - ainda aguardando localização
 *   'loading'    - buscando na API
 *   'api'        - usando dados da API (reais)
 *   'local'      - usando dados locais (fallback)
 *   'error'      - erro irrecuperável (não deve acontecer, fallback cobre)
 */

import { useState, useEffect, useCallback } from 'react';
import dadosLocais from '../data/ubs.json';
import { buscarEstabelecimentosProximos } from '../services/cnesApi';
import { calcularDistanciaKm } from '../utils/distancia';

export function useUBSData(localizacao) {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [filtroServico, setFiltroServico] = useState(null);

  const [dadosBase, setDadosBase] = useState([]);
  const [statusDados, setStatusDados] = useState('idle'); // 'idle' | 'loading' | 'api' | 'local'
  const [erroApi, setErroApi] = useState(null);

  const [resultado, setResultado] = useState([]);

  // ── 1. Carregar dados (API ou local) quando a localização mudar ──────────
  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      if (!localizacao) {
        // Sem GPS: usa local para não bloquear o usuário
        setDadosBase(dadosLocais);
        setStatusDados('local');
        return;
      }

      setStatusDados('loading');
      setErroApi(null);

      try {
        const dados = await buscarEstabelecimentosProximos(
          localizacao.latitude,
          localizacao.longitude,
          10 // 10 km de raio
        );

        if (cancelado) return;

        if (dados.length > 0) {
          setDadosBase(dados);
          setStatusDados('api');
        } else {
          // API respondeu mas sem resultados → fallback local
          setDadosBase(dadosLocais);
          setStatusDados('local');
          setErroApi('Nenhum resultado da API. Exibindo dados locais.');
        }
      } catch (err) {
        if (cancelado) return;

        // Qualquer falha de rede → fallback silencioso
        setDadosBase(dadosLocais);
        setStatusDados('local');
        setErroApi(
          err.message === 'timeout'
            ? 'API demorou demais. Exibindo dados locais.'
            : 'Sem conexão com a API. Exibindo dados locais.'
        );
      }
    }

    carregar();

    return () => {
      cancelado = true;
    };
  }, [localizacao?.latitude, localizacao?.longitude]);

  // ── 2. Aplicar filtros sempre que dados ou filtros mudarem ────────────────
  useEffect(() => {
    let lista = [...dadosBase];

    if (filtroTipo) {
      lista = lista.filter((u) => u.tp_unidade === filtroTipo);
    }

    if (filtroServico) {
      lista = lista.filter(
        (u) => Array.isArray(u.servicos) && u.servicos.includes(filtroServico)
      );
    }

    if (busca.trim().length > 0) {
      const termo = busca.toLowerCase();
      lista = lista.filter(
        (u) =>
          (u.no_fantasia || '').toLowerCase().includes(termo) ||
          (u.no_bairro || '').toLowerCase().includes(termo)
      );
    }

    // Ordenar por distância se tiver GPS
    if (localizacao) {
      lista = lista
        .map((u) => ({
          ...u,
          distanciaKm:
            u.distanciaKm !== undefined
              ? u.distanciaKm
              : calcularDistanciaKm(
                  localizacao.latitude,
                  localizacao.longitude,
                  u.latitude,
                  u.longitude
                ),
        }))
        .sort((a, b) => a.distanciaKm - b.distanciaKm);
    }

    setResultado(lista);
  }, [dadosBase, busca, filtroTipo, filtroServico, localizacao]);

  // ── 3. Retry manual ──────────────────────────────────────────────────────
  const recarregar = useCallback(async () => {
    if (!localizacao) return;

    setStatusDados('loading');
    setErroApi(null);

    try {
      const dados = await buscarEstabelecimentosProximos(
        localizacao.latitude,
        localizacao.longitude,
        10
      );

      if (dados.length > 0) {
        setDadosBase(dados);
        setStatusDados('api');
      } else {
        setDadosBase(dadosLocais);
        setStatusDados('local');
        setErroApi('Nenhum resultado da API. Exibindo dados locais.');
      }
    } catch (err) {
      setDadosBase(dadosLocais);
      setStatusDados('local');
      setErroApi('Falha ao buscar. Exibindo dados locais.');
    }
  }, [localizacao]);

  return {
    busca, setBusca,
    filtroTipo, setFiltroTipo,
    filtroServico, setFiltroServico,
    resultado,
    statusDados,
    erroApi,
    recarregar,
    totalDados: dadosBase.length,
  };
}

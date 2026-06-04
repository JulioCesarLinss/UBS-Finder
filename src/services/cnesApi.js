/**
 * Serviço de busca de estabelecimentos de saúde via API do TCU/AppCívico.
 * Fonte: CNES - Cadastro Nacional de Estabelecimentos de Saúde (DATASUS)
 * Endpoint: http://mobile-aceite.tcu.gov.br/mapa-da-saude/rest/estabelecimentos
 *
 * Parâmetros de busca por geolocalização:
 *   latitude, longitude, raio (km), pagina (0-based)
 *   categoria: "posto de saude" | "urgencia" | "hospital" | "clinica" ...
 *
 * Campos relevantes retornados:
 *   codCnes, nomeFantasia, tipoUnidade, categoriaUnidade
 *   endereco { logradouro, numero, bairro, cidade, uf, cep }
 *   turnoAtendimento, vinculoSus, lat, long, telefone
 */

const BASE_URL = 'https://mobile-aceite.tcu.gov.br/mapa-da-saude/rest/estabelecimentos';

// Timeout de 8s para não deixar o usuário esperando
const TIMEOUT_MS = 8000;

// Categorias que o app exibe, mapeadas para os valores aceitos pela API
const CATEGORIAS_API = [
  'posto de saude',
  'urgencia',
  'hospital',
  'clinica',
  'consultorio',
];

/**
 * Normaliza um registro da API TCU para o formato interno do app.
 */
function normalizarEstabelecimento(item) {
  const end = item.endereco || {};
  const logradouro = [end.logradouro, end.numero].filter(Boolean).join(', ');
  const bairro = end.bairro || '';

  // Detectar tipo interno a partir de categoriaUnidade / tipoUnidade
  const categoria = (item.categoriaUnidade || '').toLowerCase();
  const tipo = (item.tipoUnidade || '').toLowerCase();
  let tp_unidade = 'Posto';

  if (categoria.includes('urgencia') || tipo.includes('upa') || tipo.includes('pronto')) {
    tp_unidade = 'Urgência';
  } else if (categoria.includes('caps') || tipo.includes('caps')) {
    tp_unidade = 'CAPS';
  } else if (
    categoria.includes('posto') ||
    tipo.includes('ubs') ||
    tipo.includes('unidade basica') ||
    tipo.includes('basica')
  ) {
    tp_unidade = 'UBS';
  } else if (
    tipo.includes('posto') ||
    categoria.includes('clinica') ||
    categoria.includes('consultorio')
  ) {
    tp_unidade = 'Posto';
  }

  // Turno → horário legível
  let ds_horario = 'Consulte o estabelecimento';
  const turno = (item.turnoAtendimento || '').toLowerCase();
  if (turno.includes('integral') || turno.includes('24')) {
    ds_horario = '24 horas, todos os dias';
  } else if (turno.includes('manha') || turno.includes('tarde')) {
    ds_horario = 'Segunda a Sexta, 07h às 17h';
  }

  return {
    id: String(item.codCnes || item.codUnidade || Math.random()),
    no_fantasia: item.nomeFantasia || 'Unidade de Saúde',
    ds_endereco: logradouro || 'Endereço não informado',
    no_bairro: bairro || 'Bairro não informado',
    tp_unidade,
    latitude: parseFloat(item.lat) || 0,
    longitude: parseFloat(item.long) || 0,
    ds_horario,
    telefone: item.telefone || null,
    servicos: inferirServicos(tp_unidade, item),
    _fonte: 'api', // marca para debug
  };
}

/**
 * Infere lista de serviços a partir do tipo e dados disponíveis.
 */
function inferirServicos(tp_unidade, item) {
  const base = {
    UBS: ['Vacinação', 'Consulta Clínica', 'Pré-natal'],
    Posto: ['Vacinação', 'Consulta Clínica', 'Curativos'],
    CAPS: ['Saúde Mental', 'Psicologia', 'Grupos Terapêuticos'],
    Urgência: ['Urgência', 'Emergência', 'Observação'],
  };
  return base[tp_unidade] || ['Atendimento Geral'];
}

/**
 * Busca estabelecimentos próximos a uma coordenada.
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} raioKm  - raio de busca em km (padrão 5)
 * @returns {Promise<Array>}  lista normalizada, pode ser vazia
 */
export async function buscarEstabelecimentosProximos(latitude, longitude, raioKm = 5) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resultados = [];

    // Busca em paralelo para as categorias principais
    const promises = CATEGORIAS_API.map(async (categoria) => {
      const url =
        `${BASE_URL}?` +
        `latitude=${latitude}&longitude=${longitude}&raio=${raioKm}` +
        `&categoria=${encodeURIComponent(categoria)}&pagina=0`;

      const res = await fetch(url, { signal: controller.signal });

      if (!res.ok) return [];

      const json = await res.json();
      return Array.isArray(json) ? json : [];
    });

    const respostas = await Promise.allSettled(promises);

    // Consolida e deduplica por codCnes
    const vistos = new Set();
    for (const r of respostas) {
      if (r.status !== 'fulfilled') continue;
      for (const item of r.value) {
        const key = String(item.codCnes || item.codUnidade);
        if (!vistos.has(key)) {
          vistos.add(key);
          // Filtra apenas vinculados ao SUS
          if (item.vinculoSus === 'Sim' || item.vinculoSus == null) {
            resultados.push(normalizarEstabelecimento(item));
          }
        }
      }
    }

    return resultados;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('timeout');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

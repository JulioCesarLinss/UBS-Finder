const fs = require('fs');
const path = require('path');

// Índices 0-based: TP_UNIDADE=28, CO_TURNO_ATENDIMENTO=29, CO_MUNICIPIO_GESTOR=31, NU_LATITUDE=39, NU_LONGITUDE=40
const HEADER = 'CO_UNIDADE;CO_CNES;NU_CNPJ_MANTENEDORA;TP_PFPJ;NIVEL_DEP;NO_RAZAO_SOCIAL;NO_FANTASIA;NO_LOGRADOURO;NU_ENDERECO;NO_COMPLEMENTO;NO_BAIRRO;CO_CEP;CO_REGIAO_SAUDE;CO_MICRO_REGIAO;CO_DISTRITO_SANITARIO;CO_DISTRITO_ADMINISTRATIVO;NU_TELEFONE;NU_FAX;NO_EMAIL;NU_CPF;NU_CNPJ;CO_ATIVIDADE;CO_CLIENTELA;NU_ALVARA;DT_EXPEDICAO;TP_ORGAO_EXPEDIDOR;DT_VAL_LIC_SANI;TP_LIC_SANI;TP_UNIDADE;CO_TURNO_ATENDIMENTO;CO_ESTADO_GESTOR;CO_MUNICIPIO_GESTOR;DT_ATUALIZACAO;CO_USUARIO;CO_CPFDIRETORCLN;REG_DIRETORCLN;ST_ADESAO_FILANTROP;CO_MOTIVO_DESAB;NO_URL;NU_LATITUDE;NU_LONGITUDE;DT_ATU_GEO;NO_USUARIO_GEO;CO_NATUREZA_JUR;TP_ESTAB_SEMPRE_ABERTO;ST_GERACREDITO;ST_CONEXAO_INTERNET;CO_TIPO_UNIDADE;NO_FANTASIA_ABREV;TP_GESTAO;DT_ATUALIZACAO_ORIGEM;CO_TIPO_ESTABELECIMENTO;CO_ATIVIDADE_PRINCIPAL;ST_CONTRATO_FORMALIZADO;CO_TIPO_ABRANGENCIA;ST_COWORKING';

const headers = HEADER.split(';');

const TIPOS = {
  '01': 'Posto', '02': 'UBS', '15': 'UBS',
  '20': 'Urgência', '21': 'Urgência', '73': 'Urgência', '70': 'CAPS',
};

const TURNOS = {
  '01': 'Segunda a Sexta, 07h às 12h',
  '02': 'Segunda a Sexta, 13h às 17h',
  '03': 'Segunda a Sexta, 07h às 17h',
  '04': 'Segunda a Sexta, 07h às 22h',
  '05': 'Horários variados, consulte a unidade',
  '06': '24 horas, todos os dias',
  '07': 'Segunda a Sexta, 18h às 23h',
};

const SERVICOS = {
  UBS:       ['Vacinação', 'Consulta Clínica', 'Pré-natal'],
  Posto:     ['Vacinação', 'Consulta Clínica', 'Curativos'],
  CAPS:      ['Saúde Mental', 'Psicologia', 'Grupos Terapêuticos'],
  'Urgência': ['Urgência', 'Emergência', 'Observação'],
};

function parseLinha(line) {
  return line.split(';').map(v => v.replace(/^"|"$/g, '').trim());
}

const raw = fs.readFileSync(
  path.join(__dirname, 'recife_raw.txt'),
  { encoding: 'latin1' }
).split('\n').filter(l => l.trim());

const resultado = [];

for (const line of raw) {
  const vals = parseLinha(line);

  // Monta objeto com índices fixos do header
  const e = {};
  headers.forEach((h, i) => { e[h] = vals[i] || ''; });

  const tipo = TIPOS[e['TP_UNIDADE']];
  if (!tipo) continue;

  const lat = parseFloat(e['NU_LATITUDE'].replace(',', '.'));
  const lon = parseFloat(e['NU_LONGITUDE'].replace(',', '.'));
  if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) continue;

  const nome = e['NO_FANTASIA'] || e['NO_RAZAO_SOCIAL'];
  if (!nome) continue;

  const endereco = [e['NO_LOGRADOURO'], e['NU_ENDERECO']].filter(Boolean).join(', ');

  resultado.push({
    id: String(resultado.length + 1),
    co_cnes: e['CO_CNES'],
    no_fantasia: nome,
    ds_endereco: endereco || 'Endereço não informado',
    no_bairro: e['NO_BAIRRO'] || '',
    tp_unidade: tipo,
    latitude: lat,
    longitude: lon,
    ds_horario: TURNOS[e['CO_TURNO_ATENDIMENTO']] || 'Consulte a unidade',
    servicos: SERVICOS[tipo] || ['Atendimento Geral'],
  });
}

console.log(`Unidades extraídas: ${resultado.length}`);
resultado.forEach(u => console.log(`  [${u.tp_unidade}] ${u.no_fantasia} — ${u.no_bairro} (${u.latitude}, ${u.longitude})`));

const out = path.join(__dirname, '..', 'src', 'data', 'ubs.json');
fs.writeFileSync(out, JSON.stringify(resultado, null, 2), 'utf8');
console.log(`\n✅ Salvo em src/data/ubs.json`);

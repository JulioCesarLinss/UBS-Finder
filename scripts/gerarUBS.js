const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BASE = path.join(__dirname, '..', 'base_de_dados', 'BASE_DE_DADOS_CNES_202604');

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

async function processar() {
  const filePath = path.join(BASE, 'tbEstabelecimento202604.csv');
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: 'latin1' }),
    crlfDelay: Infinity,
  });

  let headers = null;
  const resultado = [];
  let total = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;

    if (!headers) {
      headers = parseLinha(line);
      continue;
    }

    total++;
    const vals = parseLinha(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = vals[i] || ''; });

    if (row['CO_MUNICIPIO_GESTOR'] !== '261160') continue;
    if (!TIPOS[row['CO_TIPO_UNIDADE']]) continue;
    if (!row['NU_LATITUDE'] || !row['NU_LONGITUDE']) continue;
    if (!row['NO_FANTASIA']) continue;

    const lat = parseFloat(row['NU_LATITUDE'].replace(',', '.'));
    const lon = parseFloat(row['NU_LONGITUDE'].replace(',', '.'));
    if (isNaN(lat) || isNaN(lon)) continue;

    const tp = TIPOS[row['CO_TIPO_UNIDADE']];
    const endereco = [row['NO_LOGRADOURO'], row['NU_ENDERECO']].filter(Boolean).join(', ');

    resultado.push({
      id: String(resultado.length + 1),
      co_cnes: row['CO_CNES'],
      no_fantasia: row['NO_FANTASIA'],
      ds_endereco: endereco || 'Endereço não informado',
      no_bairro: row['NO_BAIRRO'] || '',
      tp_unidade: tp,
      latitude: lat,
      longitude: lon,
      ds_horario: TURNOS[row['CO_TURNO_ATENDIMENTO']] || 'Consulte a unidade',
      servicos: SERVICOS[tp] || ['Atendimento Geral'],
    });
  }

  console.log(`Total processado: ${total} | Recife filtrado: ${resultado.length}`);

  const out = path.join(__dirname, '..', 'src', 'data', 'ubs.json');
  fs.writeFileSync(out, JSON.stringify(resultado, null, 2), 'utf8');

  const porTipo = resultado.reduce((acc, u) => {
    acc[u.tp_unidade] = (acc[u.tp_unidade] || 0) + 1;
    return acc;
  }, {});

  console.log('✅ Salvo em src/data/ubs.json');
  console.log('Por tipo:', porTipo);
}

processar().catch(console.error);

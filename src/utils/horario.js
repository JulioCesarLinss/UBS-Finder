/**
 * Verifica se uma unidade está aberta agora com base no ds_horario.
 * Retorna: true (aberto), false (fechado), null (não foi possível determinar)
 */
export function estaAberto(dsHorario) {
  if (!dsHorario) return null;

  const texto = dsHorario.toLowerCase();

  // Sempre aberto
  if (texto.includes('24') || texto.includes('integral')) return true;

  const agora = new Date();
  const diaSemana = agora.getDay(); // 0=Dom, 1=Seg, ..., 5=Sex, 6=Sab
  const horaAtual = agora.getHours() + agora.getMinutes() / 60;

  // "Segunda a Sexta" → dias 1 a 5
  if (texto.includes('segunda') && texto.includes('sexta')) {
    if (diaSemana === 0 || diaSemana === 6) return false;

    const match = texto.match(/(\d{1,2})h\s*(?:às|as)\s*(\d{1,2})h/);
    if (match) {
      const abertura = parseInt(match[1]);
      const fechamento = parseInt(match[2]);
      return horaAtual >= abertura && horaAtual < fechamento;
    }
  }

  return null;
}

export function labelAberto(dsHorario) {
  const status = estaAberto(dsHorario);
  if (status === true) return { texto: 'Aberto agora', cor: '#38B000' };
  if (status === false) return { texto: 'Fechado', cor: '#E63946' };
  return null;
}

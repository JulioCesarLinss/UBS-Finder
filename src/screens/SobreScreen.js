import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SobreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Cabeçalho do app */}
        <View style={styles.cabecalho}>
          <View style={styles.iconContainer}>
            <Ionicons name="medkit" size={48} color={COLORS.white} />
          </View>
          <Text style={styles.appNome}>UBS Finder</Text>
          <Text style={styles.appVersao}>Versão 1.0.0</Text>
        </View>

        {/* Card SUS */}
        <View style={styles.card}>
          <View style={styles.cardTitulo}>
            <Ionicons name="heart" size={20} color={COLORS.primary} />
            <Text style={styles.tituloSecao}>O que é o SUS?</Text>
          </View>
          <Text style={styles.paragrafo}>
            O Sistema Único de Saúde (SUS) é o sistema de saúde público do Brasil, garantido pela
            Constituição Federal de 1988. Ele oferece atendimento gratuito a todos os cidadãos
            brasileiros, independentemente de renda ou situação social.
          </Text>
          <Text style={styles.paragrafo}>
            A Atenção Básica é a porta de entrada do SUS, oferecida nas Unidades Básicas de Saúde
            (UBS) e postos de saúde. Ela inclui consultas médicas, vacinação, acompanhamento
            pré-natal, saúde bucal, entre outros serviços essenciais.
          </Text>
        </View>

        {/* Card UBS */}
        <View style={styles.card}>
          <View style={styles.cardTitulo}>
            <Ionicons name="business" size={20} color={COLORS.primary} />
            <Text style={styles.tituloSecao}>O que é uma UBS?</Text>
          </View>
          <Text style={styles.paragrafo}>
            A Unidade Básica de Saúde (UBS) é o principal ponto de contato entre a população e o
            SUS. Ela oferece serviços de prevenção, promoção e recuperação da saúde, como
            vacinação, consultas, pré-natal e odontologia.
          </Text>
        </View>

        {/* Card CAPS */}
        <View style={styles.card}>
          <View style={styles.cardTitulo}>
            <Ionicons name="people" size={20} color={COLORS.tipoCAPS} />
            <Text style={[styles.tituloSecao, { color: COLORS.tipoCAPS }]}>O que é o CAPS?</Text>
          </View>
          <Text style={styles.paragrafo}>
            O Centro de Atenção Psicossocial (CAPS) oferece atendimento em saúde mental, incluindo
            tratamento para transtornos psiquiátricos e dependência química. É um serviço
            especializado do SUS voltado ao cuidado integral da saúde mental.
          </Text>
        </View>

        {/* Links */}
        <View style={styles.card}>
          <View style={styles.cardTitulo}>
            <Ionicons name="link" size={20} color={COLORS.primary} />
            <Text style={styles.tituloSecao}>Links Úteis</Text>
          </View>

          <LinkBotao
            icone="globe-outline"
            texto="Portal da Saúde do Recife"
            url="https://www.recife.pe.gov.br/saude"
          />
          <LinkBotao
            icone="document-text-outline"
            texto="Dados CNES / DATASUS"
            url="https://dados.saude.gov.br"
          />
          <LinkBotao
            icone="phone-portrait-outline"
            texto="e-SUS / Saúde Digital"
            url="https://aps.saude.gov.br"
          />
        </View>

        {/* Rodapé */}
        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>
            Dados: CNES — Cadastro Nacional de Estabelecimentos de Saúde
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LinkBotao({ icone, texto, url }) {
  return (
    <TouchableOpacity
      style={styles.linkBotao}
      onPress={() => Linking.openURL(url)}
      activeOpacity={0.8}
      accessibilityLabel={`Abrir ${texto}`}
    >
      <Ionicons name={icone} size={20} color={COLORS.primary} />
      <Text style={styles.linkTexto}>{texto}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
  cabecalho: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 8,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  appNome: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  appVersao: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
  },
  paragrafo: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 23,
  },
  linkBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  linkTexto: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  rodape: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  rodapeTexto: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

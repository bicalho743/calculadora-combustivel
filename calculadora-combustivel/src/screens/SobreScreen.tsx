// src/screens/SobreScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, StatusBar } from 'react-native';
import { colors, spacing, font, radius } from '../theme';

export function SobreScreen() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={styles.title}>Sobre</Text>
        <Text style={styles.sub}>Calculadora de Combustível</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {[
          {
            title: 'O app',
            text: 'A Calculadora de Combustível foi desenvolvida para facilitar sua vida na hora de abastecer. Calcule qual combustível compensa mais, simule o custo de uma viagem e gerencie o consumo dos seus veículos — tudo de forma rápida e prática.',
          },
          {
            title: 'Funcionalidades',
            text: '• Calculadora Etanol x Gasolina — resultado instantâneo pela regra dos 70%\n• Simulador de Viagem — custo total baseado em distância e consumo\n• Meus Veículos — cadastre seus carros com consumo médio salvo localmente',
          },
          {
            title: 'Política de dados',
            text: 'O app não coleta informações dos usuários para uso próprio ou de terceiros. Os dados dos veículos ficam salvos apenas no seu smartphone e são removidos ao desinstalar o app.',
          },
          {
            title: 'Desenvolvedor',
            text: 'Desenvolvido pela Coruja Labs.\ncontato: corujalabs@gmail.com',
          },
        ].map(card => (
          <View key={card.title} style={styles.card}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardText}>{card.text}</Text>
          </View>
        ))}

        <Text style={styles.version}>Versão 1.0.0 — Coruja Labs</Text>
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 56,
    paddingBottom: spacing.md, paddingHorizontal: spacing.lg,
  },
  title: { fontSize: font.xl, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.5 },
  sub:   { fontSize: font.sm, color: colors.textMuted, marginTop: 2, letterSpacing: 1, textTransform: 'uppercase' },
  content: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.md },
  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.xl,
    borderWidth: 0.5, borderColor: colors.border, padding: spacing.lg, gap: spacing.sm,
  },
  cardTitle: { fontSize: font.md, fontWeight: '700', color: colors.textPrimary },
  cardText:  { fontSize: font.sm, color: colors.textSecondary, lineHeight: 22 },
  version:   { textAlign: 'center', fontSize: font.xs, color: colors.textMuted, marginTop: spacing.sm },
});

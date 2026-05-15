// src/screens/CalculadoraScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Platform, StatusBar, KeyboardAvoidingView,
} from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { InputField }  from '../components/InputField';
import { ResultBox }   from '../components/ResultBox';
import { colors, spacing, font, radius } from '../theme';

const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-8870942389525455/2956362639';

const THRESHOLD = 0.70;

export function CalculadoraScreen() {
  const [etanol,   setEtanol]   = useState('');
  const [gasolina, setGasolina] = useState('');

  function parse(v: string) {
    const n = parseFloat(v.replace(',', '.'));
    return isNaN(n) || n <= 0 ? 0 : n;
  }

  const result = useMemo(() => {
    const e = parse(etanol);
    const g = parse(gasolina);
    if (!e || !g) return null;
    const ratio      = e / g;
    const pct        = ratio * 100;
    const etanolWins = ratio <= THRESHOLD;
    const diff       = e - g * THRESHOLD;
    const eco50      = diff * 50;
    return { e, g, ratio, pct, etanolWins, diff, eco50 };
  }, [etanol, gasolina]);

  const valid = !!result;
  const winColor = result?.etanolWins ? colors.green : colors.amber;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={styles.title}>Etanol x Gasolina</Text>
        <Text style={styles.sub}>Qual combustível compensa?</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>

          <View style={styles.card}>
            <InputField label="Preço do Etanol" value={etanol} onChange={setEtanol}
                        placeholder="0,00" prefix="R$" accent={colors.green} />
            <InputField label="Preço da Gasolina" value={gasolina} onChange={setGasolina}
                        placeholder="0,00" prefix="R$" accent={colors.amber} />
          </View>

          {valid && result && (
            <>
              <ResultBox
                label="Abasteça com"
                value={result.etanolWins ? 'ETANOL' : 'GASOLINA'}
                color={winColor}
                sub={`Relação: ${result.pct.toFixed(1).replace('.', ',')}% (limite 70%)`}
              />

              <View style={styles.statsGrid}>
                {[
                  { label: 'Relação atual',    value: `${result.pct.toFixed(1).replace('.',',')}%`, color: winColor },
                  { label: 'Limite p/ etanol', value: '70%',                                         color: colors.textSecondary },
                  { label: 'Diferença/litro',  value: `${result.diff >= 0 ? '+' : '−'}R$${Math.abs(result.diff).toFixed(2).replace('.',',')}`, color: winColor },
                  { label: 'Economia 50L',     value: `${result.eco50 <= 0 ? '−' : '+'}R$${Math.abs(result.eco50).toFixed(2).replace('.',',')}`, color: winColor },
                ].map(s => (
                  <View key={s.label} style={styles.statBox}>
                    <Text style={styles.statLabel}>{s.label}</Text>
                    <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  Regra: etanol compensa se custar menos de{' '}
                  <Text style={{ color: colors.green, fontWeight: '700' }}>70%</Text>
                  {' '}do preço da gasolina.
                </Text>
              </View>
            </>
          )}

          {!valid && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>⛽</Text>
              <Text style={styles.emptyText}>Digite os preços acima para calcular</Text>
            </View>
          )}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.adWrap}>
        <BannerAd unitId={BANNER_ID} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </View>
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
    borderWidth: 0.5, borderColor: colors.border,
    padding: spacing.lg, gap: spacing.md,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statBox: {
    width: '47.5%', backgroundColor: colors.bgCard,
    borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border,
    padding: spacing.md, gap: spacing.xs,
  },
  statLabel: { fontSize: font.xs, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: font.lg, fontWeight: '700' },
  tipCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderWidth: 0.5, borderColor: colors.border, padding: spacing.md,
  },
  tipText: { fontSize: font.sm, color: colors.textSecondary, lineHeight: 20, textAlign: 'center' },
  emptyCard: {
    alignItems: 'center', padding: spacing.xxl, gap: spacing.md,
    backgroundColor: colors.bgCard, borderRadius: radius.xl,
    borderWidth: 0.5, borderColor: colors.border,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: font.md, color: colors.textMuted, textAlign: 'center' },
  adWrap: { alignItems: 'center', backgroundColor: colors.bg, paddingBottom: Platform.OS === 'ios' ? 20 : 0 },
});

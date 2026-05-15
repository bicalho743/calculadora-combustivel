// src/screens/ViagemScreen.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Platform, StatusBar, KeyboardAvoidingView, Modal, FlatList,
} from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { InputField } from '../components/InputField';
import { colors, spacing, font, radius } from '../theme';
import { getVehicles, Vehicle } from '../storage/vehicles';

const BANNER_ID = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8870942389525455/2956362639';

function parse(v: string) {
  const n = parseFloat(v.replace(',', '.'));
  return isNaN(n) || n <= 0 ? 0 : n;
}

export function ViagemScreen() {
  const [km,       setKm]       = useState('');
  const [consumo,  setConsumo]  = useState('');
  const [preco,    setPreco]    = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [modal,    setModal]    = useState(false);

  useEffect(() => {
    getVehicles().then(setVehicles);
  }, []);

  // Quando seleciona veículo, preenche consumo médio (gasolina por padrão)
  function selectVehicle(v: Vehicle) {
    setSelected(v);
    setConsumo(v.consumoGasolina.toString());
    setModal(false);
  }

  const result = useMemo(() => {
    const d = parse(km);
    const c = parse(consumo);
    const p = parse(preco);
    if (!d || !c || !p) return null;
    const litros   = d / c;
    const custo    = litros * p;
    const custokm  = p / c;
    return { litros, custo, custokm };
  }, [km, consumo, preco]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={styles.title}>Simulador de Viagem</Text>
        <Text style={styles.sub}>Quanto vou gastar?</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>

          {/* Seletor de veículo */}
          {vehicles.length > 0 && (
            <TouchableOpacity style={styles.vehicleBtn} onPress={() => setModal(true)} activeOpacity={0.8}>
              <Text style={styles.vehicleBtnLabel}>
                {selected ? `🚗  ${selected.nome}` : '🚗  Selecionar meu veículo'}
              </Text>
              <Text style={styles.vehicleBtnArrow}>›</Text>
            </TouchableOpacity>
          )}

          <View style={styles.card}>
            <InputField label="Distância" value={km} onChange={setKm}
                        placeholder="0" suffix="km" accent={colors.blue} />
            <InputField label="Consumo médio" value={consumo} onChange={setConsumo}
                        placeholder="0,0" suffix="km/l" accent={colors.blue} />
            <InputField label="Preço do combustível" value={preco} onChange={setPreco}
                        placeholder="0,00" prefix="R$" accent={colors.blue} />
          </View>

          {result && (
            <>
              <View style={[styles.resultCard, { borderColor: colors.blue }]}>
                <Text style={styles.resultLabel}>Custo total estimado</Text>
                <Text style={[styles.resultValue, { color: colors.blue }]}>
                  R$ {result.custo.toFixed(2).replace('.', ',')}
                </Text>
              </View>

              <View style={styles.statsGrid}>
                {[
                  { label: 'Litros necessários', value: `${result.litros.toFixed(1).replace('.',',')} L` },
                  { label: 'Custo por km',       value: `R$ ${result.custokm.toFixed(3).replace('.',',')}` },
                  { label: 'Distância',           value: `${parse(km).toFixed(0)} km` },
                  { label: 'Consumo médio',       value: `${parse(consumo).toFixed(1).replace('.',',')} km/l` },
                ].map(s => (
                  <View key={s.label} style={styles.statBox}>
                    <Text style={styles.statLabel}>{s.label}</Text>
                    <Text style={[styles.statValue, { color: colors.blue }]}>{s.value}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {!result && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🗺️</Text>
              <Text style={styles.emptyText}>Preencha os campos acima para simular o custo da viagem</Text>
            </View>
          )}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal seleção de veículo */}
      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModal(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Meus Veículos</Text>
            <FlatList
              data={vehicles}
              keyExtractor={v => v.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selectVehicle(item)} activeOpacity={0.8}>
                  <Text style={styles.modalItemName}>{item.nome}</Text>
                  <Text style={styles.modalItemSub}>
                    Etanol: {item.consumoEtanol} km/l  ·  Gasolina: {item.consumoGasolina} km/l
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>

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
  vehicleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderWidth: 0.5, borderColor: colors.blue + '66',
    padding: spacing.md, paddingHorizontal: spacing.lg,
  },
  vehicleBtnLabel: { fontSize: font.md, color: colors.blue, fontWeight: '600' },
  vehicleBtnArrow: { fontSize: 22, color: colors.blue },
  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.xl,
    borderWidth: 0.5, borderColor: colors.border,
    padding: spacing.lg, gap: spacing.md,
  },
  resultCard: {
    borderRadius: radius.xl, borderWidth: 1,
    backgroundColor: colors.blueDim,
    padding: spacing.lg, alignItems: 'center', gap: spacing.xs,
  },
  resultLabel: { fontSize: font.xs, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: colors.textMuted },
  resultValue: { fontSize: font.hero, fontWeight: '900', letterSpacing: -1.5 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statBox: {
    width: '47.5%', backgroundColor: colors.bgCard,
    borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border,
    padding: spacing.md, gap: spacing.xs,
  },
  statLabel: { fontSize: font.xs, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: font.lg, fontWeight: '700' },
  emptyCard: {
    alignItems: 'center', padding: spacing.xxl, gap: spacing.md,
    backgroundColor: colors.bgCard, borderRadius: radius.xl,
    borderWidth: 0.5, borderColor: colors.border,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: font.md, color: colors.textMuted, textAlign: 'center', lineHeight: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: spacing.lg, maxHeight: '60%',
  },
  modalTitle: { fontSize: font.lg, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  modalItem: { paddingVertical: spacing.md },
  modalItemName: { fontSize: font.md, fontWeight: '700', color: colors.textPrimary },
  modalItemSub:  { fontSize: font.sm, color: colors.textSecondary, marginTop: 2 },
  adWrap: { alignItems: 'center', backgroundColor: colors.bg, paddingBottom: Platform.OS === 'ios' ? 20 : 0 },
});

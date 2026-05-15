// src/screens/VeiculosScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Platform, StatusBar, Modal, TextInput, Alert, KeyboardAvoidingView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { getVehicles, saveVehicle, deleteVehicle, updateVehicle, Vehicle } from '../storage/vehicles';
import { colors, spacing, font, radius } from '../theme';

export function VeiculosScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState<Vehicle | null>(null);

  // Formulário
  const [nome,     setNome]     = useState('');
  const [cEtanol,  setCEtanol]  = useState('');
  const [cGas,     setCGas]     = useState('');

  useFocusEffect(useCallback(() => {
    getVehicles().then(setVehicles);
  }, []));

  function openNew() {
    setEditing(null);
    setNome(''); setCEtanol(''); setCGas('');
    setModal(true);
  }

  function openEdit(v: Vehicle) {
    setEditing(v);
    setNome(v.nome);
    setCEtanol(v.consumoEtanol.toString());
    setCGas(v.consumoGasolina.toString());
    setModal(true);
  }

  async function handleSave() {
    const n  = nome.trim();
    const ce = parseFloat(cEtanol.replace(',', '.'));
    const cg = parseFloat(cGas.replace(',', '.'));
    if (!n || isNaN(ce) || ce <= 0 || isNaN(cg) || cg <= 0) {
      Alert.alert('Campos inválidos', 'Preencha todos os campos corretamente.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (editing) {
      await updateVehicle(editing.id, { nome: n, consumoEtanol: ce, consumoGasolina: cg });
    } else {
      await saveVehicle({ nome: n, consumoEtanol: ce, consumoGasolina: cg });
    }
    const updated = await getVehicles();
    setVehicles(updated);
    setModal(false);
  }

  async function handleDelete(id: string, nome: string) {
    Alert.alert('Excluir veículo', `Deseja excluir "${nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          await deleteVehicle(id);
          setVehicles(await getVehicles());
        },
      },
    ]);
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={styles.title}>Meus Veículos</Text>
        <Text style={styles.sub}>Consumo médio salvo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {vehicles.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>😔</Text>
            <Text style={styles.emptyTitle}>Nenhum veículo cadastrado</Text>
            <Text style={styles.emptyText}>
              Cadastre seu carro para usar no simulador de viagem com o consumo médio já preenchido.
            </Text>
          </View>
        ) : (
          vehicles.map(v => (
            <View key={v.id} style={styles.vehicleCard}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{v.nome}</Text>
                <View style={styles.consumoRow}>
                  <View style={styles.consumoBadge}>
                    <Text style={[styles.consumoLabel, { color: colors.green }]}>Etanol</Text>
                    <Text style={[styles.consumoVal,   { color: colors.green }]}>{v.consumoEtanol} km/l</Text>
                  </View>
                  <View style={styles.consumoBadge}>
                    <Text style={[styles.consumoLabel, { color: colors.amber }]}>Gasolina</Text>
                    <Text style={[styles.consumoVal,   { color: colors.amber }]}>{v.consumoGasolina} km/l</Text>
                  </View>
                </View>
              </View>
              <View style={styles.vehicleActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(v)} activeOpacity={0.7}>
                  <Text style={styles.actionEdit}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(v.id, v.nome)} activeOpacity={0.7}>
                  <Text style={styles.actionDelete}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openNew} activeOpacity={0.85}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal cadastro/edição */}
      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModal(false)}>
            <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>{editing ? 'Editar Veículo' : 'Novo Veículo'}</Text>

              <Text style={styles.fieldLabel}>Nome do veículo</Text>
              <TextInput style={styles.fieldInput} value={nome} onChangeText={setNome}
                         placeholder="Ex: Gol 2019" placeholderTextColor={colors.textMuted}
                         selectionColor={colors.green} />

              <Text style={styles.fieldLabel}>Consumo com Etanol (km/l)</Text>
              <TextInput style={styles.fieldInput} value={cEtanol} onChangeText={setCEtanol}
                         placeholder="Ex: 9,5" keyboardType="decimal-pad"
                         placeholderTextColor={colors.textMuted} selectionColor={colors.green} />

              <Text style={styles.fieldLabel}>Consumo com Gasolina (km/l)</Text>
              <TextInput style={styles.fieldInput} value={cGas} onChangeText={setCGas}
                         placeholder="Ex: 13,0" keyboardType="decimal-pad"
                         placeholderTextColor={colors.textMuted} selectionColor={colors.green} />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
                <Text style={styles.saveBtnText}>{editing ? 'Salvar alterações' : 'Cadastrar veículo'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
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
  emptyCard: {
    alignItems: 'center', padding: spacing.xxl, gap: spacing.md,
    backgroundColor: colors.bgCard, borderRadius: radius.xl,
    borderWidth: 0.5, borderColor: colors.border, marginTop: spacing.xl,
  },
  emptyIcon:  { fontSize: 52 },
  emptyTitle: { fontSize: font.lg, fontWeight: '700', color: colors.textPrimary },
  emptyText:  { fontSize: font.sm, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  vehicleCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    borderWidth: 0.5, borderColor: colors.border,
    padding: spacing.md, gap: spacing.md,
  },
  vehicleInfo: { flex: 1, gap: spacing.sm },
  vehicleName: { fontSize: font.md, fontWeight: '700', color: colors.textPrimary },
  consumoRow:  { flexDirection: 'row', gap: spacing.sm },
  consumoBadge: {
    backgroundColor: colors.bgInput, borderRadius: radius.sm,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, gap: 2,
  },
  consumoLabel: { fontSize: font.xs, fontWeight: '700', letterSpacing: 0.5 },
  consumoVal:   { fontSize: font.sm, fontWeight: '600' },
  vehicleActions: { gap: spacing.sm },
  actionBtn: {
    width: 36, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.bgInput, borderWidth: 0.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  actionEdit:   { fontSize: 16, color: colors.textSecondary },
  actionDelete: { fontSize: 14, color: colors.red },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: colors.green,
    alignItems: 'center', justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.green, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12,
  },
  fabText: { fontSize: 30, color: '#fff', fontWeight: '300', lineHeight: 34 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#1A1A1A', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.sm,
  },
  modalTitle: { fontSize: font.lg, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  fieldLabel: { fontSize: font.xs, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: spacing.sm },
  fieldInput: {
    backgroundColor: colors.bgInput, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    fontSize: font.md, color: colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: colors.green, borderRadius: radius.md,
    paddingVertical: spacing.md + 2, alignItems: 'center', marginTop: spacing.md,
  },
  saveBtnText: { fontSize: font.md, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
});

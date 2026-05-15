// src/components/InputField.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, font, spacing } from '../theme';

interface Props {
  label:       string;
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
  prefix?:     string;
  suffix?:     string;
  accent?:     string;
}

export function InputField({ label, value, onChange, placeholder, prefix, suffix, accent }: Props) {
  const ac = accent ?? colors.green;
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: ac }]}>{label}</Text>
      <View style={[styles.row, { borderColor: value ? ac + '44' : colors.border }]}>
        {prefix ? <Text style={styles.affix}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder ?? '0'}
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          returnKeyType="done"
          selectionColor={ac}
        />
        {suffix ? <Text style={styles.affix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: {
    fontSize: font.xs, fontWeight: '700',
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md, borderWidth: 1,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1, fontSize: font.lg, fontWeight: '600',
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  affix: {
    fontSize: font.sm, color: colors.textMuted,
    fontWeight: '500',
  },
});

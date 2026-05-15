// src/components/ResultBox.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, font, spacing } from '../theme';

interface Props {
  label:  string;
  value:  string;
  color?: string;
  sub?:   string;
}

export function ResultBox({ label, value, color, sub }: Props) {
  const c = color ?? colors.green;
  return (
    <View style={[styles.box, { borderColor: c, backgroundColor: c + '14' }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: c }]}>{value}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.xl, borderWidth: 1,
    padding: spacing.lg, alignItems: 'center', gap: spacing.xs,
  },
  label: {
    fontSize: font.xs, fontWeight: '700',
    letterSpacing: 2, textTransform: 'uppercase',
    color: colors.textMuted,
  },
  value: {
    fontSize: font.hero, fontWeight: '900', letterSpacing: -1.5,
  },
  sub: {
    fontSize: font.sm, color: colors.textSecondary,
  },
});

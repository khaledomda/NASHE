import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';

/**
 * Modern English NASHE wordmark.
 * Bold geometric letterforms with wide tracking and a violet accent dot.
 * By default the letter/accent colors come from the active theme palette so
 * the mark stays legible in both light and dark mode; pass `tone="light"`
 * only when rendering on a colored/photographic surface.
 */
export function BrandWordmark({
  size = 40,
  tone = 'auto',
  style,
}: {
  /** Font size of the wordmark letters. */
  size?: number;
  /** 'auto' = theme foreground colors; 'light' = white letters for colored surfaces. */
  tone?: 'auto' | 'light';
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useColors();
  const letterColor = tone === 'light' ? '#FFFFFF' : colors.foreground;
  const accentColor = tone === 'light' ? '#CFC7FB' : colors.primary;
  return (
    <View style={[styles.row, style]} accessibilityRole="header" accessibilityLabel="NASHE">
      <Text style={[styles.word, { fontSize: size, color: letterColor }]}>
        NASH
        <Text style={{ color: accentColor }}>E</Text>
      </Text>
      <View
        style={[
          styles.dot,
          {
            width: Math.max(6, size * 0.16),
            height: Math.max(6, size * 0.16),
            borderRadius: size,
            backgroundColor: accentColor,
            marginBottom: size * 0.12,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  word: {
    fontFamily: 'Inter_700Bold',
    fontWeight: '800' as const,
    letterSpacing: 4,
  },
  dot: { marginStart: 4 },
});

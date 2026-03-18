import { BarcodeCreatorView } from 'react-native-barcode-creator';
import { View, Text, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

export function Barcode({
  barcode,
  format,
  children,
}: {
  barcode: string;
  format: any;
  children?: ReactNode;
}) {
  if (barcode == null) {
    return (
      <View style={styles.card}>
        <Text style={styles.barcodeText}> Sin barcode </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <BarcodeCreatorView
        value={barcode}
        background={'#FFFFFF'}
        foregroundColor={'#000000'}
        format={format}
        style={styles.barcode}
      />

      <Text style={styles.barcodeText}>{barcode}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },

  barcode: {
    width: 300,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },

  barcodeText: {
    color: '#94a3b8',
    fontSize: 14,
    letterSpacing: 1,
  },
});

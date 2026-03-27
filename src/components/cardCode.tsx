import { BarcodeCreatorView } from 'react-native-barcode-creator';
import { View, Text, StyleSheet } from 'react-native';

type CardCodeProps = {
  code: string;
  format: any;
};

export function CardCode({ code, format }: CardCodeProps) {
  if (code == null || format == null) {
    return (
      <View style={styles.card}>
        <Text style={styles.codeText}> Sin código </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <BarcodeCreatorView
        value={code}
        background={'#FFFFFF'}
        foregroundColor={'#000000'}
        format={format}
        style={styles.code}
      />
      <Text style={styles.codeText}>{code}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 340,
    maxWidth: 360,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },

  code: {
    width: 300,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },

  codeText: {
    color: '#94a3b8',
    fontSize: 14,
    letterSpacing: 1,
  },

  topContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  bottomContainer: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

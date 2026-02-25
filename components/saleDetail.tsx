import { View, StyleSheet, Pressable, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSaleDetails } from '../hooks/saleDetailsContext';
import { SaleDatail } from '../domain/saleDetails';
import { useTypedRoute } from '../types';
import { addSale } from '../services/repositories';

export function SaleDetail() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useTypedRoute<'SaleDetail'>();
  const { saleDetails, setSaleDetails } = useSaleDetails();

  function getTotal(): number {
    let total = 0;
    saleDetails.forEach((sd) => {
      if (sd.saleId === route.params.saleId) total += sd.subtotal;
    });
    return total;
  }

  const renderItem = ({ item }: { item: SaleDatail }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.productName}>{item.productName}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <Text style={styles.label}>Cantidad</Text>
          <Text style={styles.value}>{item.quantity}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Precio unitario</Text>
          <Text style={styles.value}>${item.price}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>${item.subtotal}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        marginBottom: insets.bottom,
        marginTop: insets.top,
        backgroundColor: 'black',
      }}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Detalle de Venta</Text>
        <View style={{ width: 60 }} />
      </View>
      <FlatList
        data={saleDetails}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {saleDetails.length > 0 && (
        <View style={styles.footer}>
          <Pressable
            style={styles.saveButton}
            onPress={async () => {
              const date = new Date().toISOString();
              try {
                await addSale(route.params.saleId, date, getTotal());
                navigation.goBack();
                setSaleDetails([]);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <Text style={styles.saveButtonText}>Terminar Venta</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backText: {
    color: '#4da6ff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    backgroundColor: '#262626',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  productName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cardBody: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '400',
  },
  value: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginBottom: 0,
  },
  totalLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: '#4da6ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4da6ff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 8,
  },
});

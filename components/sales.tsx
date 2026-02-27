import { View, StyleSheet, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Sale } from '../domain/sale';
import { useEffect, useState } from 'react';
import { getAllSales } from '../services/repositories';

const dateFormater = Intl.DateTimeFormat('es-Es', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export function Sales() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const getSales = async () => {
      try {
        const results = await getAllSales();
        setSales(results);
      } catch (error) {
        console.log(error);
      }
    };
    getSales();
  }, []);

  function formatedDate(iso: string) {
    const date = new Date(iso);
    return dateFormater.format(date);
  }

  const renderItem = ({ item }: { item: Sale }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}> Venta </Text>
        <Text style={[styles.value, { fontSize: 14 }]}> {item.id} </Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <Text style={styles.label}> Fecha </Text>
          <Text style={styles.value}> {formatedDate(item.date)} </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}> Total </Text>
          <Text style={styles.value}> {item.total} </Text>
        </View>
        <View style={styles.row}></View>
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
        <Text style={styles.headerTitle}>Ventas</Text>
        <View style={{ width: 60 }} />
      </View>
      <FlatList
        data={sales}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardHeaderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

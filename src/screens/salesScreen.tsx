import {
  View,
  Text,
  Pressable,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sale } from '../domain/sale';
import { useEffect, useState } from 'react';
import repository from '../services/repositories';
import { useTypedNavigation } from '../types';
import { ensureCurrencyFormat } from '../utils/price';
import { useStyles } from '../hooks/useStyles';
import { AppTheme } from '../theme/themes';
import { Header } from '../components/header';

const dateFormater = Intl.DateTimeFormat('es-Es', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export function SalesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'SalesScreen'>();
  const [sales, setSales] = useState<Sale[]>([]);
  const styles = useStyles(createStyles);

  useEffect(() => {
    const getSales = async () => {
      try {
        const results = await repository.getAllSales();
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
        <Text style={styles.cardTextId}> {item.id} </Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <Text style={styles.label}> Fecha </Text>
          <Text style={styles.value}> {formatedDate(item.date)} </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}> Total </Text>
          <Text style={styles.value}> {ensureCurrencyFormat(item.total)} </Text>
        </View>
        <View style={styles.row}></View>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
        },
      ]}
    >
      <Header title="Ventas" goBack={navigation.goBack}></Header>
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

const createStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.card,
  } satisfies ViewStyle,
  cardHeader: {
    backgroundColor: theme.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  } satisfies ViewStyle,
  cardBody: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  } satisfies ViewStyle,
  label: {
    color: theme.textSecondary,
    fontSize: 14,
    fontWeight: '400',
  } satisfies TextStyle,
  value: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  } satisfies TextStyle,
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  } satisfies ViewStyle,

  cardHeaderText: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  } satisfies TextStyle,
  cardTextId: {
    color: theme.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  } satisfies TextStyle,
});

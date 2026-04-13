import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTypedNavigation } from '../types';
import { useCallback } from 'react';
import { CameraScanner } from './../components/cameraScanner.android';
import repository from '../services/repositories';
import { useSale } from '../hooks/useSale';
import { ensureCurrencyFormat } from '../utils/price';
import { useStyles } from '../hooks/useStyles';
import { AppTheme } from '../theme/themes';
import { Header } from '../components/header';

type ProductItemProps = {
  name: string;
  image: string;
  quantity: number;
  subTotal: string;
  remove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

export const ProductItem = ({
  name,
  image,
  quantity,
  subTotal,
  remove,
  onIncrease,
  onDecrease,
}: ProductItemProps) => {
  const styles = useStyles(createProductItemStyles);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>img</Text>
        )}
      </View>

      <View style={styles.nameContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1} style={styles.subTotal}>
          SubTotal {subTotal}
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={onDecrease} style={styles.button}>
          <Text style={styles.buttonText}>−</Text>
        </Pressable>

        <Text style={styles.quantity}>{quantity}</Text>

        <Pressable onPress={onIncrease} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>

        <View style={{ width: 8 }} />

        <Pressable
          onPress={() => {
            Alert.alert('¿Eliminar producto escaneado?', undefined, [
              {
                text: 'Aceptar',
                onPress: remove,
              },
              {
                text: 'Cancelar',
                style: 'cancel',
              },
            ]);
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
};

const createProductItemStyles = (theme: AppTheme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } satisfies ViewStyle,

  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } satisfies ViewStyle,
  image: {
    width: '100%',
    height: '100%',
  } satisfies ViewStyle,
  imageText: { color: theme.textSecondary, fontSize: 12 },

  nameContainer: {
    flex: 1,
  },
  name: {
    color: theme.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  } satisfies TextStyle,
  subTotal: {
    color: theme.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  } satisfies TextStyle,

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 4,
    gap: 8,
  } satisfies ViewStyle,
  button: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#121821',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
  buttonText: { color: theme.textPrimary, fontSize: 16 },
  quantity: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  } satisfies TextStyle,
});

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'CheckoutScreen'>();
  const { addProduct, getSnapshot, updateQuantity, getTotal, removeProduct } =
    useSale();
  const styles = useStyles(createStyles);

  const onCodeScanned = useCallback(
    async (code: string) => {
      try {
        const product = await repository.fetchProductByCode(code);
        console.log(`Scanned product ${product.name}, Code: ${code}`);
        addProduct(product);
      } catch (error) {
        console.log(error);
      }
    },
    [addProduct]
  );

  const handleFinishSale = async () => {
    const date = new Date().toISOString();
    try {
      await repository.addSale(getSnapshot().saleId.current!, date, getTotal());
      await repository.postSaleDetails(
        getSnapshot().saleDetails.current,
        getSnapshot().saleId.current!
      );
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Header title="Escanear código" goBack={navigation.goBack}></Header>

      <View style={styles.cameraContainer}>
        <CameraScanner
          onCodeScanned={onCodeScanned}
          style={StyleSheet.absoluteFill}
          scanSize={180}
          mode="persistence"
        />
      </View>

      <View style={styles.itemsContainer}>
        {getSnapshot().saleId.current == null && (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#687280', fontSize: 16 }}>
              Sin productos escaneados
            </Text>
          </View>
        )}

        <FlatList
          contentContainerStyle={{ padding: 12 }}
          data={Object.keys(getSnapshot().saleDetails.current)}
          keyExtractor={(item) => item}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => {
            const saleDetail = getSnapshot().saleDetails.current[item];

            return (
              <ProductItem
                name={saleDetail.productName}
                quantity={saleDetail.quantity}
                subTotal={ensureCurrencyFormat(saleDetail.subtotal)}
                image=""
                remove={() => removeProduct(item)}
                onIncrease={() => updateQuantity(item, 1)}
                onDecrease={() => updateQuantity(item, -1)}
              />
            );
          }}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Total {ensureCurrencyFormat(getTotal())}
          </Text>

          {getSnapshot().saleId.current != null && (
            <Pressable onPress={handleFinishSale} style={styles.footerButton}>
              <Text style={styles.footerButtonText}>Finalizar Venta</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  } satisfies ViewStyle,
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: theme.overlay,
  },
  headerButtonText: {
    color: theme.textPrimary,
    fontSize: 14,
  },
  headerTitle: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  } satisfies TextStyle,

  cameraContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.card,
  } satisfies ViewStyle,

  itemsContainer: {
    flex: 1,
    marginTop: 16,
    backgroundColor: theme.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  } satisfies ViewStyle,

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
    backgroundColor: theme.card,
  } satisfies ViewStyle,
  footerText: {
    color: theme.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 14,
  } satisfies TextStyle,
  footerButton: {
    backgroundColor: theme.buttonPrimary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  } satisfies ViewStyle,

  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  } satisfies TextStyle,
});

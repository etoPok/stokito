import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTypedNavigation } from '../types';
import { useCallback } from 'react';
import { CameraScanner } from './../components/cameraScanner.android';
import repository from '../services/repositories';
import { useSale } from '../hooks/useSale';

type ProductItemProps = {
  name: string;
  image: string;
  quantity: number;
  subTotal: number;
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
  return (
    <View style={productItemStyles.container}>
      <View style={productItemStyles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={productItemStyles.image} />
        ) : (
          <Text style={productItemStyles.imageText}>img</Text>
        )}
      </View>

      <View style={productItemStyles.nameContainer}>
        <Text numberOfLines={1} style={productItemStyles.name}>
          {name}
        </Text>
        <Text numberOfLines={1} style={productItemStyles.subTotal}>
          SubTotal {subTotal}
        </Text>
      </View>

      <View style={productItemStyles.controls}>
        <Pressable onPress={onDecrease} style={productItemStyles.button}>
          <Text style={productItemStyles.buttonText}>−</Text>
        </Pressable>

        <Text style={productItemStyles.quantity}>{quantity}</Text>

        <Pressable onPress={onIncrease} style={productItemStyles.button}>
          <Text style={productItemStyles.buttonText}>+</Text>
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
          style={productItemStyles.button}
        >
          <Text style={productItemStyles.buttonText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
};

const productItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#121821',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageText: { color: '#6B7280', fontSize: 12 },

  nameContainer: {
    flex: 1,
  },
  name: {
    color: '#E6EDF3',
    fontSize: 15,
    fontWeight: '500',
  },
  subTotal: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '500',
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 4,
    gap: 8,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#121821',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
  quantity: {
    color: '#E6EDF3',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
});

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'CheckoutScreen'>();
  const { addProduct, getSnapshot, updateQuantity, getTotal, removeProduct } =
    useSale();

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
      style={{
        flex: 1,
        backgroundColor: 'black',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={styles.header}>
        <Pressable onPress={navigation.goBack} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Escanear Código</Text>

        <View style={{ width: 70 }} />
      </View>

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
                subTotal={saleDetail.subtotal}
                image=""
                remove={() => removeProduct(item)}
                onIncrease={() => updateQuantity(item, 1)}
                onDecrease={() => updateQuantity(item, -1)}
              />
            );
          }}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Total {getTotal()}</Text>

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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#121821',
  },
  headerButtonText: { color: '#3B82F6', fontSize: 14 },
  headerTitle: {
    color: '#E6EDF3',
    fontSize: 18,
    fontWeight: '600',
  },

  cameraContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#121821',
  },

  itemsContainer: {
    flex: 1,
    marginTop: 16,
    backgroundColor: '#111111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1F2630',
  },
  footerText: {
    color: '#E6EDF3',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  footerButton: {
    backgroundColor: '#1F3A5F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

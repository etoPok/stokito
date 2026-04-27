import { Button, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardButton } from './../components/cardButton';
import { useProducts } from '../hooks/productContext';
import { useTypedNavigation, useTypedRoute } from '../types';
import { IconButton, Menu } from 'react-native-paper';
import { useState } from 'react';
import { Grid } from '../components/grid';
import { useStyles } from '../hooks/useStyles';
import { AppTheme } from '../theme/themes';
import { Header } from '../components/header';
import { useAppTheme } from '../hooks/useAppTheme';
import { useScreenMode } from '../hooks/usePickerHandler';
import { Product } from '../domain/product';

export function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'ProductsScreen'>();
  const { products } = useProducts();
  const styles = useStyles(createStyles);
  const { theme } = useAppTheme();

  const [visible, setVisible] = useState<boolean>(false);
  const mode = useTypedRoute<'ProductsScreen'>().params ?? { type: 'view' };

  const {
    isViewMode,
    isPickerMode,
    isMultiPick,
    handleItemPress,
    confirmMultiPick,
    cancel,
    selectedItems,
  } = useScreenMode<Product, 'ProductsScreen'>({
    mode,
    navigation,
  });

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom, paddingTop: insets.top },
      ]}
    >
      <Header
        title="Productos"
        goBack={isPickerMode ? cancel : navigation.goBack}
        rightSide={
          isViewMode ? (
            <Menu
              visible={visible}
              onDismiss={() => setVisible(false)}
              anchor={
                <IconButton
                  icon="dots-horizontal"
                  size={24}
                  onPress={() => setVisible(true)}
                  iconColor={theme.textPrimary}
                />
              }
              contentStyle={styles.popupMenuButton}
            >
              <Menu.Item
                onPress={() => {
                  setVisible(false);
                  navigation.navigate('ProductScreen', { product: undefined });
                }}
                title="Agregar Producto"
                titleStyle={styles.popupOptionText}
              />
            </Menu>
          ) : isMultiPick ? (
            <Button
              title={`Confirmar (${selectedItems.length})`}
              onPress={confirmMultiPick}
              disabled={selectedItems.length === 0}
            />
          ) : undefined
        }
      />

      <Grid
        data={products}
        keyExtractor={(item) => item.id!}
        breakpoints={{ xs: 3, sm: 4, md: 4, lg: 5 }}
        renderItem={(item) => (
          <CardButton
            title={item.name}
            imageSource={require('../assets/favicon.png')}
            // selected={isItemSelected(item, (p) => p.id!)}
            onPress={() =>
              isViewMode
                ? navigation.navigate('ProductScreen', { product: item })
                : handleItemPress(item)
            }
          />
        )}
      />
    </View>
  );
}

const createStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  popupMenuButton: {
    backgroundColor: theme.background,
  },
  popupOptionText: {
    color: theme.textPrimary,
  },
});

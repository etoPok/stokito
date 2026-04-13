import { View, Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardButton } from './../components/cardButton';
import { useProducts } from '../hooks/productContext';
import { useTypedNavigation } from '../types';
import { IconButton, Menu } from 'react-native-paper';
import { useState } from 'react';
import { Grid } from '../components/grid';
import { useStyles } from '../hooks/useStyles';
import { AppTheme } from '../theme/themes';
import { Header } from '../components/header';
import { useAppTheme } from '../hooks/useAppTheme';

export function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation<'ProductsScreen'>();
  const { products } = useProducts();
  const styles = useStyles(createStyles);
  const { theme } = useAppTheme();

  const [visible, setVisible] = useState<boolean>(false);

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
      <Header
        title="Productos"
        goBack={navigation.goBack}
        rightSide={
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
        }
      ></Header>

      <Grid
        data={products}
        keyExtractor={(item) => item.id!}
        breakpoints={{ xs: 3, sm: 4, md: 4, lg: 5 }}
        renderItem={(item, _) => (
          <CardButton
            title={item.name}
            imageSource={require('../assets/favicon.png')}
            onPress={() =>
              navigation.navigate('ProductScreen', { product: item })
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

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

export type RootStackParamList = {
  HomeScreen: undefined;
  InventoryScreen: undefined;
  RefundScreen: undefined;
  CheckoutScreen: undefined;
  CreateInventoryProductScreen: undefined;
  CreateProductDefinitionScreen: undefined;
  CreateInventoryScreen: undefined;
  ProductsScreen: undefined;
  ConfirmSaleScreen: { saleId: string };
  SalesScreen: undefined;
};

export type ScreenNavigation<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type ScreenRoute<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

export function useTypedNavigation<T extends keyof RootStackParamList>() {
  return useNavigation<ScreenNavigation<T>>();
}

export function useTypedRoute<T extends keyof RootStackParamList>() {
  return useRoute<ScreenRoute<T>>();
}

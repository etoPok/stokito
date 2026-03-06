import { DefaultValues, FieldValues } from 'react-hook-form';
import {
  RootStackParamList,
  useTypedRoute,
  useTypedNavigation,
  ScreenRoute,
} from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { EntityForm } from './entityForm';
import { FormHeader } from './FormHeader';

type CreateEntityScreenProps<
  T extends FieldValues,
  S extends keyof RootStackParamList,
> = {
  titleNew: string;
  titleView: string;
  resolver: any;

  getDefaultValues: (route: ScreenRoute<S>) => DefaultValues<T>;
  isNew: (route: ScreenRoute<S>) => boolean;

  save: (values: T, route: ScreenRoute<S>) => Promise<void>;

  Fields: React.ComponentType<{ editable: boolean }>;
};

export function createEntityScreen<
  T extends FieldValues,
  S extends keyof RootStackParamList,
>(config: CreateEntityScreenProps<T, S>) {
  return function EntityScreen() {
    const navigation = useTypedNavigation<S>();
    const route = useTypedRoute<S>();
    const insets = useSafeAreaInsets();

    const editable = config.isNew(route);

    const originalValues = useRef(config.getDefaultValues(route));

    async function save(values: T) {
      await config.save(values, route);
      navigation.goBack();
    }

    function onInvalid(errors: any) {
      Alert.alert('Datos inválidos', 'Existen campos sin llenar');
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <EntityForm
          initialValues={originalValues.current}
          editable={editable}
          onValid={save}
          onInvalid={onInvalid}
          resolver={config.resolver}
        >
          <ScrollView>
            <FormHeader
              title={editable ? config.titleNew : config.titleView}
              navigation={navigation}
            />

            <config.Fields editable={editable} />
          </ScrollView>
        </EntityForm>
      </View>
    );
  };
}

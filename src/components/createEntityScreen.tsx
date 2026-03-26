import { DefaultValues, FieldValues } from 'react-hook-form';
import {
  RootStackParamList,
  useTypedRoute,
  useTypedNavigation,
  ScreenRoute,
} from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { EntityForm } from './entityForm';
import { FormHeader } from './formHeader';

type CreateEntityScreenProps<
  T extends FieldValues,
  S extends keyof RootStackParamList,
> = {
  titleNew: string;
  titleView: string;
  resolver: any;

  getDefaultValues: (route: ScreenRoute<S>) => Promise<DefaultValues<T>>;

  isNew: (route: ScreenRoute<S>) => boolean;

  save: (values: T, route: ScreenRoute<S>) => Promise<void>;

  Fields: React.ComponentType<{ editable: boolean; isNew: boolean }>;
};

export function CreateEntityScreen<
  T extends FieldValues,
  S extends keyof RootStackParamList,
>({
  titleNew,
  titleView,
  resolver,
  getDefaultValues,
  isNew,
  save,
  Fields,
}: CreateEntityScreenProps<T, S>) {
  const navigation = useTypedNavigation<S>();
  const route = useTypedRoute<S>();
  const insets = useSafeAreaInsets();

  const editable = isNew(route);

  const [originalValues, setOriginalValues] = useState<DefaultValues<T> | null>(
    null
  );

  useEffect(() => {
    let mounted = true;

    getDefaultValues(route).then((dv) => {
      if (mounted) {
        setOriginalValues(dv);
      }
    });

    return () => {
      mounted = false;
    };
  }, [getDefaultValues, route]);

  const onValid = async (values: T) => {
    await save(values, route);
    navigation.goBack();
  };

  const onInvalid = (errors: any) => {
    Alert.alert('Datos inválidos', 'Existen campos sin llenar');
  };

  if (originalValues == null) return;

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
        initialValues={originalValues}
        editable={editable}
        onValid={onValid}
        onInvalid={onInvalid}
        resolver={resolver}
      >
        <ScrollView>
          <FormHeader
            title={editable ? titleNew : titleView}
            navigation={navigation}
          />

          <Fields editable={editable} isNew={editable} />
        </ScrollView>
      </EntityForm>
    </View>
  );
}

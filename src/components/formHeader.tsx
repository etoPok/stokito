import { StyleSheet, View, Pressable, Text, Alert } from 'react-native';
import { RootStackParamList, ScreenNavigation } from '../types';
import { Menu, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { useEntityForm } from '../hooks/entityFormContext';

type FormHeaderProps<S extends keyof RootStackParamList> = {
  title: string;
  navigation: ScreenNavigation<S>;
};

export function FormHeader<S extends keyof RootStackParamList>({
  title,
  navigation,
}: FormHeaderProps<S>) {
  const {
    submit,
    editableEntity,
    setEditableEntity,
    setDiscardChanges,
    isEdited,
  } = useEntityForm();
  const [visible, setVisible] = useState<boolean>(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={async () => {
            if (!editableEntity || (editableEntity && !isEdited())) {
              navigation.goBack();
              return;
            }
            if (isEdited()) {
              Alert.alert(
                '¿Guardar cambios?',
                'Si no guarda los cambios no podrá recuperarlos',
                [
                  {
                    text: 'Guardar',
                    onPress: async () => {
                      await submit();
                    },
                  },
                  {
                    text: 'Descartar',
                    style: 'cancel',
                    onPress: () => navigation.goBack(),
                  },
                  {
                    text: 'Continuar',
                  },
                ]
              );
            }
          }}
        >
          <Text style={styles.backText}>Volver</Text>
        </Pressable>

        <Text style={styles.headerTitle}>{title}</Text>

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <IconButton icon="dots-horizontal" size={24} onPress={openMenu} />
          }
          contentStyle={{ backgroundColor: 'black' }}
        >
          {editableEntity ? (
            <Menu.Item
              title={'Descartar cambios'}
              titleStyle={{ color: 'white' }}
              onPress={() => {
                setDiscardChanges((prev) => prev + 1);
                setEditableEntity(false);
                closeMenu();
              }}
            />
          ) : (
            <Menu.Item
              title="Editar"
              titleStyle={{ color: 'white' }}
              onPress={() => {
                closeMenu();
                setEditableEntity(true);
              }}
            />
          )}
        </Menu>
      </View>
    </>
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
});

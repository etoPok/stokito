import { Alert } from 'react-native';
import { RootStackParamList, ScreenNavigation } from '../types';
import { Menu, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { useEntityForm } from '../hooks/entityFormContext';
import { Header } from './header';
import { AppTheme } from '../theme/themes';
import { useStyles } from '../hooks/useStyles';

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
  const styles = useStyles(createStyles);

  return (
    <Header
      title={title}
      goBack={() => {
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
      rightSide={
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <IconButton icon="dots-horizontal" size={24} onPress={openMenu} />
          }
          contentStyle={styles.popupMenuButton}
        >
          {editableEntity ? (
            <Menu.Item
              title={'Descartar cambios'}
              titleStyle={styles.popupOptionText}
              onPress={() => {
                setDiscardChanges((prev) => prev + 1);
                setEditableEntity(false);
                closeMenu();
              }}
            />
          ) : (
            <Menu.Item
              title="Editar"
              titleStyle={styles.popupOptionText}
              onPress={() => {
                closeMenu();
                setEditableEntity(true);
              }}
            />
          )}
        </Menu>
      }
    ></Header>
  );
}

const createStyles = (theme: AppTheme) => ({
  popupMenuButton: {
    backgroundColor: theme.background,
  },
  popupOptionText: {
    color: theme.textPrimary,
  },
});

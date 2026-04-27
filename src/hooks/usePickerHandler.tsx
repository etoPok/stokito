import { useState, useCallback, useEffect } from 'react';
import { ScreenMode } from '../types/screenMode';
import { resolvePicker, cancelPicker } from '../services/pickerService';
import { RootStackParamList, ScreenNavigation } from '../types';

interface UseScreenModeOptions<S extends keyof RootStackParamList> {
  mode: ScreenMode;
  navigation: ScreenNavigation<S>;
}

export function useScreenMode<T, S extends keyof RootStackParamList>({
  mode,
  navigation,
}: UseScreenModeOptions<S>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const isViewMode = mode.type === 'view';
  const isSinglePick = mode.type === 'single-pick';
  const isMultiPick = mode.type === 'multi-pick';
  const isPickerMode = isSinglePick || isMultiPick;
  const isItemSelected = (item: T, getId: (i: T) => string) =>
    selectedItems.some((s) => getId(s) === getId(item));

  const getPickerKey = useCallback((): string | null => {
    if (mode.type === 'single-pick' || mode.type === 'multi-pick') {
      return mode.pickerKey;
    }
    return null;
  }, [mode]);

  const cancelIfPending = useCallback(() => {
    const key = getPickerKey();
    if (key) cancelPicker(key);
  }, [getPickerKey]);

  useEffect(() => {
    if (!isPickerMode) return;

    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Se dispara SIEMPRE antes de salir: botón físico, swipe,
      // popToTop, replace, reset — cualquier causa.
      // No bloqueamos la navegación, solo limpiamos.
      cancelIfPending();
    });

    return unsubscribe; // cleanup al desmontar el componente
  }, [navigation, isPickerMode, cancelIfPending]);

  const handleItemPress = useCallback(
    (item: T) => {
      if (isSinglePick) {
        resolvePicker<T>(
          (mode as { type: 'single-pick'; pickerKey: string }).pickerKey,
          item
        );
        navigation.goBack();
        return;
      }

      if (isMultiPick) {
        setSelectedItems((prev) => {
          const alreadyIn = prev.includes(item);
          return alreadyIn ? prev.filter((i) => i !== item) : [...prev, item];
        });
      }
    },
    [mode, isSinglePick, isMultiPick, navigation]
  );

  const confirmMultiPick = useCallback(() => {
    if (!isMultiPick) return;
    resolvePicker<T[]>(
      (mode as { type: 'multi-pick'; pickerKey: string }).pickerKey,
      selectedItems
    );
    navigation.goBack();
  }, [isMultiPick, mode, selectedItems, navigation]);

  const cancel = useCallback(() => {
    if (isSinglePick) {
      cancelPicker(
        (mode as { type: 'single-pick'; pickerKey: string }).pickerKey
      );
    }
    if (isMultiPick) {
      cancelPicker(
        (mode as { type: 'multi-pick'; pickerKey: string }).pickerKey
      );
    }
    navigation.goBack();
  }, [mode, isSinglePick, isMultiPick, navigation]);

  return {
    // State
    selectedItems,
    isPickerMode,
    isViewMode,
    isSinglePick,
    isMultiPick,
    isItemSelected,
    // Actions
    handleItemPress,
    confirmMultiPick,
    cancel,
  };
}

import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  useForm,
  FieldValues,
  SubmitHandler,
  DefaultValues,
  FormProvider,
  SubmitErrorHandler,
} from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EntityFormContext } from '../hooks/entityFormContext';

export type FormFieldsProps = {
  editable: boolean;
};

type EntityFormProps<T extends FieldValues> = {
  initialValues: DefaultValues<T>;
  editable: boolean;
  resolver: any;
  onValid: SubmitHandler<T>;
  onInvalid: SubmitErrorHandler<T>;
  children: React.ReactNode;
};

export function EntityForm<T extends FieldValues>({
  initialValues,
  editable,
  resolver,
  onValid,
  onInvalid,
  children,
}: EntityFormProps<T>) {
  const methods = useForm<T>({
    resolver,
    defaultValues: structuredClone(initialValues),
  });
  const [editableEntity, setEditableEntity] = useState<boolean>(editable);
  const [discardChanges, setDiscardChanges] = useState<number>(0);

  const submit = useCallback(
    () => methods.handleSubmit(onValid, onInvalid),
    [onValid, onInvalid, methods]
  )();

  const isEdited = () =>
    JSON.stringify(initialValues) !== JSON.stringify(methods.getValues());

  useEffect(() => {
    methods.reset(initialValues);
  }, [discardChanges]);

  return (
    <FormProvider {...methods}>
      <EntityFormContext.Provider
        value={{
          submit,
          editableEntity,
          setEditableEntity,
          discardChanges,
          setDiscardChanges,
          isEdited,
        }}
      >
        {children}
        {editableEntity && (
          <View style={styles.footer}>
            <Pressable
              style={styles.saveButton}
              onPress={async () => await submit()}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </Pressable>
          </View>
        )}
      </EntityFormContext.Provider>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  saveButton: {
    backgroundColor: '#4da6ff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

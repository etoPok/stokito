import { createContext, useContext } from 'react';

type EntityFormContextType = {
  submit: () => Promise<void>;
  editableEntity: boolean;
  setEditableEntity: React.Dispatch<React.SetStateAction<boolean>>;
  discardChanges: number;
  setDiscardChanges: React.Dispatch<React.SetStateAction<number>>;
  isEdited: () => boolean;
};

export const EntityFormContext = createContext<EntityFormContextType | null>(
  null
);

export const ExtraFormProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: EntityFormContextType;
}) => {
  return (
    <EntityFormContext.Provider value={value}>
      {children}
    </EntityFormContext.Provider>
  );
};

export const useEntityForm = () => {
  const ctx = useContext(EntityFormContext);
  if (!ctx)
    throw new Error('useExtendedFormContext must be used inside provider');
  return ctx;
};

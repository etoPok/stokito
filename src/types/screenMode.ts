/**
 * Cada variante del modo lleva consigo el tipo exacto que resolverá.
 * El genérico T es lo que la pantalla llamante recibirá al await.
 */
export type ScreenMode =
  | { type: 'view' }
  | { type: 'single-pick'; pickerKey: string }
  | { type: 'multi-pick'; pickerKey: string };

/**
 * Extrae el tipo de retorno según el modo.
 * "view" nunca resuelve nada útil → void.
 * "single-pick" → T
 * "multi-pick" → T[]
 */
export type ModeResult<T, M extends ScreenMode> = M extends { type: 'view' }
  ? void
  : M extends { type: 'single-pick' }
    ? T | null
    : M extends { type: 'multi-pick' }
      ? T[] | null
      : never;

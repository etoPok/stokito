type FieldError = Partial<
  Record<keyof object, { type: string; message: string }>
>;

export type EntityResolver<T> = {
  entityName: string;
  resolver: (
    values: T | T[]
  ) =>
    | Partial<Record<keyof T, { type: string; message: string }>>
    | Partial<Record<keyof T, { type: string; message: string }>>[]
    | { type: string; message: string };
};

export function formatResolverResult(
  result: Record<string, string | undefined>
): FieldError {
  return Object.fromEntries(
    Object.entries(result)
      .filter(([, message]) => message != null)
      .map(([key, message]) => [key, { type: 'manual', message: message! }])
  );
}

export function createResolver<T extends object>(
  entityResolvers: EntityResolver<any>[]
): (values: T) => Promise<any> {
  return async function resolver(values: T) {
    const valueKeys = Object.keys(values) as (keyof T)[];
    const fieldErrors: Partial<Record<string, FieldError | FieldError[]>> = {};

    for (const key of valueKeys) {
      const resolverEntity = entityResolvers.find((r) => r.entityName === key);
      if (!resolverEntity) continue;

      const value = values[key];
      const resolverResult = resolverEntity.resolver(value);

      if (Array.isArray(resolverResult) && resolverResult.length > 0) {
        fieldErrors[resolverEntity.entityName] = resolverResult;
      } else if (value && typeof value === 'object') {
        if (Object.keys(resolverResult).length > 0) {
          fieldErrors[resolverEntity.entityName] = resolverResult;
        }
      }
    }

    return {
      values: Object.keys(fieldErrors).length !== 0 ? {} : values,
      errors: fieldErrors,
    };
  };
}

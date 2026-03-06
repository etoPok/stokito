export function validateRequiredFields<T>(
  obj: T,
  messages: Partial<Record<keyof T, string>>
): Partial<Record<keyof T, string>> {
  const requiredKeys = Object.keys(messages) as (keyof T)[];

  const errors: Partial<Record<keyof T, string>> = {};

  for (const key of requiredKeys) {
    const value = obj[key];

    const isInvalid =
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (typeof value === 'number' && Number.isNaN(value));

    if (isInvalid) {
      errors[key] = messages[key];
    }
  }

  return errors;
}

export function createResolver<T>(
  messages: Partial<Record<keyof T, string>>
): (values: T) => Promise<any> {
  return async function resolver(values: T) {
    const errors = validateRequiredFields(values, messages);
    const fieldErrors: Partial<
      Record<keyof typeof errors, { type: string; message: string }>
    > = {};
    for (const key in errors) {
      if (errors[key]) {
        fieldErrors[key] = { type: 'manual', message: errors[key] };
      }
    }
    return {
      values: Object.keys(errors).length !== 0 ? {} : values,
      errors: fieldErrors,
    };
  };
}

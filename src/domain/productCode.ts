import { EntityResolver } from './resolver';

export type ProductCode = {
  id: string;
  code: string;
  codeType: string;
  isPrimary: boolean;
};

type ProducCodeRequired = Pick<
  ProductCode,
  'id' | 'code' | 'codeType' | 'isPrimary'
>;

const productCodeRequiredFieldMessages: Record<
  keyof ProducCodeRequired,
  string
> = {
  id: 'El ID del códigoo no está definido',
  code: 'El códigoo es un campo requerido',
  codeType: 'El tipo de códigoo es un campo requerido',
  isPrimary: 'La prioridad del códigoo es un campo requerido',
};

export const productCodeResolver: EntityResolver<ProductCode> = {
  entityName: 'productCode',
  resolver: (values: ProductCode | ProductCode[]) => {
    const isEmpty = (value: unknown): boolean =>
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (typeof value === 'number' && Number.isNaN(value));

    type FieldErrors = Partial<
      Record<keyof ProductCode, { type: string; message: string }>
    >;

    if (Array.isArray(values)) {
      if (values.length === 0) {
        return {
          type: 'manual',
          message: 'Debe haber al menos un código por producto',
        };
      }

      const requiredKeys = Object.keys(
        productCodeRequiredFieldMessages
      ) as (keyof typeof productCodeRequiredFieldMessages)[];
      const arrayErrors: FieldErrors[] = [];

      for (const value of values) {
        const errors: FieldErrors = {};

        // check entity
        for (const key of requiredKeys) {
          if (isEmpty(value[key])) {
            errors[key] = {
              type: 'manual',
              message: productCodeRequiredFieldMessages[key],
            };
          }
        }

        if (Object.keys(errors).length > 0) arrayErrors.push(errors);
      }

      return arrayErrors;
    }

    const errors: FieldErrors = {};

    if (values && typeof values === 'object') {
      const requiredKeys = Object.keys(
        productCodeRequiredFieldMessages
      ) as (keyof typeof productCodeRequiredFieldMessages)[];

      for (const key of requiredKeys) {
        if (isEmpty(values[key])) {
          errors[key] = {
            type: 'manual',
            message: productCodeRequiredFieldMessages[key],
          };
        }
      }
    }
    return errors;
  },
};

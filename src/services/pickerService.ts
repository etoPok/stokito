type Resolver<T> = (value: T | null) => void;

const resolvers = new Map<string, Resolver<any>>();

export function createPickerRequest<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    resolvers.set(key, resolve);
  });
}

export function resolvePicker<T>(key: string, value: T | null) {
  const resolver = resolvers.get(key);
  if (resolver) {
    resolver(value);
    resolvers.delete(key);
  }
}

export function cancelPicker(key: string): void {
  resolvePicker(key, null);
}

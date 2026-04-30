export const QueryKeys = {
  products: {
    all: ['products'] as const,
    pages: () => ['products', 'pages'] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  inventoryProducts: {
    all: ['inventoryProducts'] as const,
    pages: () => ['inventoryProducts', 'pages'] as const,
    detail: (id: string) => ['inventoryProducts', 'detail', id] as const,
  },
  inventories: {
    all: ['inventories'] as const,
    pages: () => ['inventories', 'pages'] as const,
    detail: (id: string) => ['inventories', 'detail', id] as const,
  },
} as const;

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { addProductToInventory } from '../services/repoInventoryProduct';
import { Product } from '../domain/product';
import { InventoryProduct } from '../domain/inventoryProduct';
import { QueryKeys } from './queryKeys';

interface AddToInventoryInput {
  productId: string;
  inventoryId: string;
  stock: number;
}

type PagedCache<T> = InfiniteData<{ items: T[]; nextCursor: number | null }>;

export function useAddProductToInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, inventoryId, stock }: AddToInventoryInput) =>
      addProductToInventory(productId, inventoryId, stock),

    onSuccess: async (newInventoryProduct, { productId }) => {
      queryClient.setQueryData<PagedCache<Product>>(
        QueryKeys.products.pages(),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((p) => p.id !== productId),
            })),
          };
        }
      );

      queryClient.setQueryData<PagedCache<InventoryProduct>>(
        QueryKeys.inventoryProducts.pages(),
        (old) => {
          if (!old) return old;
          const [first, ...rest] = old.pages;
          return {
            ...old,
            pages: [
              { ...first, items: [newInventoryProduct, ...first.items] },
              ...rest,
            ],
          };
        }
      );
    },

    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.products.all });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.inventoryProducts.all,
      });
    },
  });
}

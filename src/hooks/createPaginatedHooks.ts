import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';

interface EntityQueryKeys {
  all: readonly string[];
  pages: () => readonly string[];
  detail: (id: string) => readonly string[];
}

interface PaginatedRepo<T, TCreate> {
  getPage: (
    cursor: number,
    limit: number
  ) => Promise<{
    items: T[];
    nextCursor: number | null;
  }>;
  create: (input: TCreate) => Promise<T>;
  remove: (id: string) => Promise<boolean>;
  update: (id: string, changes: Partial<TCreate>) => Promise<T>;
}

const PAGE_SIZE = 20;

export function createPaginatedHooks<T extends { id: string }, TCreate>(
  repo: PaginatedRepo<T, TCreate>,
  keys: EntityQueryKeys // e.g. ['products'] o ['inventoryProducts']
) {
  function useItems() {
    return useInfiniteQuery({
      queryKey: keys.pages(),
      queryFn: async ({ pageParam }) => {
        try {
          const result = await repo.getPage(pageParam, PAGE_SIZE);
          return result;
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      initialPageParam: 0 as number,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      maxPages: 10,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (input: TCreate) => repo.create(input),
      onSuccess: (created) => {
        queryClient.setQueryData(
          keys.pages(),
          (
            old:
              | InfiniteData<{ items: T[]; nextCursor: number | null }>
              | undefined
          ) => {
            if (!old) return old;
            const [first, ...rest] = old.pages;
            return {
              ...old,
              // primer pagina con dato agregado que excede PAGE_SIZE
              pages: [{ ...first, items: [created, ...first.items] }, ...rest],
            };
          }
        );
      },
    });
  }

  function useRemove() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => repo.remove(id),
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: keys.all });
        const snapshot = queryClient.getQueryData(keys.pages());
        queryClient.setQueryData(
          keys.pages(),
          (
            old:
              | InfiniteData<{ items: T[]; nextCursor: number | null }>
              | undefined
          ) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                items: page.items.filter((item) => item.id !== id),
              })),
            };
          }
        );
        return { snapshot };
      },
      onError: (_err, _id, context) => {
        if (context?.snapshot) {
          queryClient.setQueryData(keys.pages(), context.snapshot);
        }
      },
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        id,
        changes,
      }: {
        id: string;
        changes: Partial<TCreate>;
      }) => repo.update(id, changes),
      onSuccess: (_result, { id }) => {
        queryClient.setQueryData(
          keys.pages(),
          (
            old:
              | InfiniteData<{ items: T[]; nextCursor: number | null }>
              | undefined
          ) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                items: page.items.map((item) =>
                  item.id === id ? { ...item, ..._result } : item
                ),
              })),
            };
          }
        );
      },
    });
  }

  return { useItems, useCreate, useRemove, useUpdate };
}

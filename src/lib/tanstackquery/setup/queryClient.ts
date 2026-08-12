import { handleApiError } from "@/lib/errorHandler";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 30 * 1000,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => handleApiError(error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => handleApiError(error),
  }),
});

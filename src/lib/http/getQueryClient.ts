import { isServer, QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined = undefined

export default function getQueryClient() {
  function makeQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000
        }
      }
    })
  }

  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
  }
}
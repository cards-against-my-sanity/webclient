'use client';

import { GameServerProvider } from "@/lib/socket/context";
import UserProvider from "@/lib/context/user.context";
import getQueryClient from "@/lib/http/getQueryClient";
import { store } from "@/lib/store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import { Provider } from 'react-redux'

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Provider store={store}>
          <GameServerProvider>
            {children}
          </GameServerProvider>
        </Provider>
      </UserProvider>
    </QueryClientProvider>
  )
}
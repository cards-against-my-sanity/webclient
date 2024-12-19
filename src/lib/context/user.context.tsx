import { createContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, refreshAccessToken } from "../http/authLib";
import User from "@/types/User";

export const UserContext = createContext<{ user: User | null, loading: boolean, error: boolean }>({ user: null, loading: false, error: false })

export default function UserProvider({ children } : { children: ReactNode }) {
  const { data: user, ...userQuery } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      await refreshAccessToken()
      const user = await getCurrentUser()
      return user ?? null
    },
    staleTime: Infinity,
    retry: false
  })

  return (
    <UserContext.Provider value={{ user: user ?? null, loading: userQuery.isLoading, error: userQuery.isError }}>
      {children}
    </UserContext.Provider>
  )
}
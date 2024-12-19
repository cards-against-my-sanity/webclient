'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import useCurrentUser from "@/lib/hook/useCurrentUser"
import { logOut } from "@/lib/http/authLib"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

export default function ProfileDropdown() {
  const router = useRouter()
  const { user, loading } = useCurrentUser()

  const queryClient = useQueryClient()
  const logOutMutation = useMutation({
    mutationFn: logOut,
    onSuccess: async () => {
      queryClient.setQueryData(['currentUser'], null)
      router.refresh()
    }
  })

  let fallback: ReactNode
  if (user) {
    if (loading) {
      fallback = <span>...</span>
    } else {
      fallback = <span>{user.nickname[0]}</span>
    }
  } else {
    fallback = <span>G</span>
  }

  let items: ReactNode
  if (user) {
    items = <>
        <DropdownMenuLabel>{user.nickname}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button onClick={() => logOutMutation.mutate()}>Log out</button>
        </DropdownMenuItem>
      </>
  } else {
    items = <>
        <DropdownMenuItem asChild>
          <Link href="/auth/login">Log in</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/auth/signup">Sign up</Link>
        </DropdownMenuItem>
      </>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { Client, IFrame } from '@stomp/stompjs'
import { toast } from "sonner";
import useCurrentUser from "../hook/useCurrentUser";
import { useAppDispatch } from "../store/store";
import { globalSubscriptions } from "./subscriptions";
import { createStompClient, teardown } from "./client";
import { createSocketActions, SocketActions } from "./actions";

export interface GameServerContextData {
  ready: boolean
  actions: SocketActions | null
}

export const GameServerContext = createContext<GameServerContextData>({
  ready: false,
  actions: null
})

export const GameServerProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch()
  const { user, loading: userLoading } = useCurrentUser()
  const [ready, setReady] = useState<boolean>(false)
  const client = useRef<Client | null>(null)
  const actions = useRef<SocketActions | null>(null)

  useEffect(() => {
    if (userLoading) return

    setReady(false)

    if (!user && client.current) {
      teardown(actions, client)
    }

    (async () => (await createStompClient(
      user,
      (stomp: Client, frame: IFrame) => {
        toast(`Welcome to the gameserver ${frame.headers['user-name']}`)

        actions.current = createSocketActions(stomp)
        client.current = stomp

        globalSubscriptions(user, stomp, actions.current, dispatch)

        setReady(true)
      },
      () => {
        if (user) {
          toast("You have been disconnected from the gameserver")
        }

        teardown(actions, client)
        setReady(false)
      },
      () => {
        toast.error('Connection error', { description: 'Please reload the page to attempt reconnection' })

        teardown(actions, client)
        setReady(false)
      }
    )).activate())()

    return () => teardown(actions, client)
  }, [user, userLoading, dispatch])

  return (
    <GameServerContext.Provider value={{ ready: !userLoading && ready, actions: actions.current }}>
      {children}
    </GameServerContext.Provider>
  )
}
import User from "@/types/User";
import { Client, IFrame, IStompSocket } from "@stomp/stompjs";
import { refreshWebsocketToken } from "../http/authLib";
import Axios from "axios";
import BaseConfig from '@/lib/http/axiosConfig'
import { RefObject } from "react";
import { SocketActions } from "./actions";

const gsClient = Axios.create({
  ...BaseConfig,
  baseURL: process.env.NEXT_PUBLIC_GAME_SERVER_API_BASE
});

export const createStompClient = async (
  user: User | null,
  onConnect: (stomp: Client, frame: IFrame) => void,
  onDisconnect: () => void,
  onError: () => void
): Promise<Client> => {
  console.log('creating stomp client')

  const client = new Client()

  const accessToken = user ? await refreshWebsocketToken() : undefined
  const csrfToken = (await gsClient.get('/csrf')).data.token

  const protocol = accessToken ?
    [...client.stompVersions.protocolVersions(), `Access.${accessToken}`]
    : client.stompVersions.protocolVersions()

    client.webSocketFactory = (): IStompSocket => {
      return new WebSocket(
        process.env.NEXT_PUBLIC_GAME_SERVER_SOCKET,
        protocol
      ) as IStompSocket
    }

    // client.heartbeatIncoming = 5000
    // client.heartbeatOutgoing = 5000

    client.connectHeaders = {
      'X-CSRF-TOKEN': csrfToken
    }

  client.onConnect = (frame: IFrame) => onConnect(client, frame)
  client.onDisconnect = onDisconnect
  client.onStompError = () => onError()
  client.onWebSocketError = () => onError()

  return client
}

export const teardown = (actionRef: RefObject<SocketActions | null>, clientRef: RefObject<Client | null>) => {
  actionRef.current = null
  clientRef.current?.deactivate()
  clientRef.current = null
}
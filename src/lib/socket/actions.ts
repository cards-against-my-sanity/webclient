import JoinGameDto from "@/types/dto/out/socket/JoinGameDto";
import { Client } from "@stomp/stompjs";

export interface SocketActions {
  sendGlobalChat: (message: string) => void,
  sendLocalChat: (gameId: string, message: string) => void,
  requestGameList: () => void,
  createGame: () => void,
  joinGame: (dto: JoinGameDto) => void,
  leaveGame: () => void
}

export const createSocketActions = (stomp: Client) => ({
  sendGlobalChat: (message: string) => {
    stomp.publish({
      destination: '/app/globalChat',
      body: message
    })
  },

  sendLocalChat: (gameId: string, message: string) => {
    stomp.publish({
      destination: `/app/game/${gameId}/chat`,
      body: message
    })
  },

  requestGameList: () => {
    stomp.publish({
      destination: '/app/game/list'
    })
  },
  
  createGame: () => {
    stomp.publish({
      destination: '/app/game/create'
    })
  },

  joinGame: (dto: JoinGameDto) => {
    stomp.publish({
      destination: '/app/game/join',
      body: JSON.stringify(dto)
    })
  },

  leaveGame: () => {
    stomp.publish({
      destination: '/app/game/leave'
    })
  }
})
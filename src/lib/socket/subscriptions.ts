import { Client, StompSubscription } from "@stomp/stompjs";
import { AppDispatch, store } from "../store/store";
import SocketResponse from "@/types/dto/in/SocketResponse";
import { toast } from "sonner";
import { addGame, addGlobalChatMessage, addUser, changeGameState, removeGame, removeUser, setGames, updateGameDecks, updateGameSettings } from "../store/feature/gameBrowserSlice";
import Game from "@/types/Game";
import { refreshWebsocketToken } from "../http/authLib";
import Packet from "@/types/dto/in/Packet";
import ChatPacketPayload from "@/types/dto/in/packet/ChatPacketPayload";
import PacketType from "@/types/dto/in/PacketType";
import SocketResponseType from "@/types/dto/in/SocketResponseType";
import GameCreatedPacketPayload from "@/types/dto/in/packet/GameCreatedPacketPayload";
import GameRemovedPacketPayload from "@/types/dto/in/packet/GameRemovedPacketPayload";
import { addLocalChatMessage, addUserToActiveGame, changeActiveGameState, removeUserFromActiveGame, setActiveGame, setAwaitingDecksAck, setAwaitingSettingsAck, updateActiveGameDecks, updateActiveGameSettings } from "../store/feature/activeGameSlice";
import User from "@/types/User";
import PlayerJoinedGamePacketPayload from "@/types/dto/in/packet/PlayerJoinedGamePacketPayload";
import PlayerLeftGamePacketPayload from "@/types/dto/in/packet/PlayerLeftGamePacketPayload";
import ObserverJoinedGamePacketPayload from "@/types/dto/in/packet/ObserverJoinedGamePacketPayload";
import ObserverLeftGamePacketPayload from "@/types/dto/in/packet/ObserverLeftGamePacketPayload";
import GameStateChangePacketPayload from "@/types/dto/in/packet/GameStateChangePacketPayload";
import { SocketActions } from "./actions";
import GameSettingsUpdatedPacketPayload from "@/types/dto/in/packet/GameSettingsUpdatedPacketPayload";
import GameDecksUpdatedPacketPayload from "@/types/dto/in/packet/GameDecksUpdatedPacketPayload";
import GameState from "@/types/GameState";

export const globalSubscriptions = (user: User | null, stomp: Client, actions: SocketActions, dispatch: AppDispatch) => {
  stomp.subscribe('/topic/gameBrowser', msg => {
    const packet = JSON.parse(msg.body) as Packet<unknown>
    switch (packet.type) {
      case PacketType.CHAT: {
        const { message, sender } = (packet as Packet<ChatPacketPayload>).payload
        dispatch(addGlobalChatMessage({ message: `${sender.nickname}: ${message}` }))
        break
      }
      case PacketType.STATE_CHANGE: {
        const { gameId, state } = (packet as Packet<GameStateChangePacketPayload>).payload
        dispatch(changeGameState({ gameId, state }))
        break
      }
      case PacketType.GAME_CREATED: {
        const { game } = (packet as Packet<GameCreatedPacketPayload>).payload
        dispatch(addGame({ game }))
        break
      }
      case PacketType.GAME_REMOVED: {
        const { gameId } = (packet as Packet<GameRemovedPacketPayload>).payload
        dispatch(removeGame({ gameId }))
        break
      }
      case PacketType.PLAYER_JOINED_GAME: {
        const { gameId, player: user } = (packet as Packet<PlayerJoinedGamePacketPayload>).payload
        dispatch(addUser({ gameId, user, observer: false }))
        break
      }
      case PacketType.PLAYER_LEFT_GAME: {
        const { gameId, playerId: userId } = (packet as Packet<PlayerLeftGamePacketPayload>).payload
        dispatch(removeUser({ gameId, userId, observer: false }))
        break
      }
      case PacketType.OBSERVER_JOINED_GAME: {
        const { gameId, observer: user } = (packet as Packet<ObserverJoinedGamePacketPayload>).payload
        dispatch(addUser({ gameId, user, observer: true }))
        break
      }
      case PacketType.OBSERVER_LEFT_GAME: {
        const { gameId, observerId: userId } = (packet as Packet<ObserverLeftGamePacketPayload>).payload
        dispatch(removeUser({ gameId, userId, observer: true }))
        break
      }
      case PacketType.GAME_SETTINGS_UPDATED: {
        const { gameId, settings } = (packet as Packet<GameSettingsUpdatedPacketPayload>).payload
        dispatch(updateGameSettings({ gameId, settings }))
        break
      }
      case PacketType.GAME_DECKS_UPDATED: {
        const { gameId, decks } = (packet as Packet<GameDecksUpdatedPacketPayload>).payload
        dispatch(updateGameDecks({ gameId, decks }))
        break
      }
    }
  })

  stomp.subscribe('/user/queue/reply', msg => {
    const reply = JSON.parse(msg.body) as SocketResponse<unknown>
    
    if (reply.isError) {
      toast.error(reply.error.title, {
        description: reply.error.message
      })
    }

    switch (reply.type) {
      case SocketResponseType.LIST_GAMES: {
        dispatch(setGames({ games: reply.data as Game[] }))
        break
      }
      case SocketResponseType.CREATE_GAME: {
        const game = reply.data as Game
        dispatch(setActiveGame({ game, subscriptionId: gameSubscription(user!, stomp, actions, dispatch, game.id).id }))
        break
      }
      case SocketResponseType.JOIN_GAME: {
        const game = store.getState().gameBrowser.games.find(game => game.id === (reply.data as string))
        if (!game) break      
        dispatch(setActiveGame({ game, subscriptionId: gameSubscription(user!, stomp, actions, dispatch, game.id).id }))
        break
      }
      case SocketResponseType.UPDATE_SETTINGS: {
        dispatch(setAwaitingSettingsAck(false))
        break
      }
      case SocketResponseType.UPDATE_DECKS: {
        dispatch(setAwaitingDecksAck(false))
        break
      }
    }
  })

  stomp.subscribe('/user/queue/errors', msg => {
    toast.error('Gameserver error', {
      description: msg.body
    })
  })

  if (user) {
    stomp.subscribe('/user/queue/reauthenticate', async () => {
      const newAccessToken = await refreshWebsocketToken()
      if (!newAccessToken) {
        stomp.deactivate()
        return
      }

      stomp.publish({
        destination: '/app/reauthenticate',
        body: newAccessToken
      })
    })
  }
}

export const gameSubscription = (user: User, stomp: Client, actions: SocketActions, dispatch: AppDispatch, gameId: string): StompSubscription => {
  const topic = `/topic/game/${gameId}`

  return stomp.subscribe(topic, msg => {
    const packet = JSON.parse(msg.body) as Packet<unknown>
    switch (packet.type) {
      case PacketType.CHAT: {
        const { message, sender } = (packet as Packet<ChatPacketPayload>).payload
        dispatch(addLocalChatMessage({ message: `${sender.nickname}: ${message}` }))
        break
      }
      case PacketType.STATE_CHANGE: {
        const { state } = (packet as Packet<GameStateChangePacketPayload>).payload
        dispatch(changeActiveGameState({ state }))
        if (state === GameState.ABANDONED && store.getState().activeGame.game?.hostId !== user.id) {
          actions.leaveGame()
        }
        break
      }
      case PacketType.PLAYER_JOINED_GAME: {
        const { player: user } = (packet as Packet<PlayerJoinedGamePacketPayload>).payload
        dispatch(addUserToActiveGame({ user, observer: false }))
        break
      }
      case PacketType.PLAYER_LEFT_GAME: {
        const { playerId: userId } = (packet as Packet<PlayerLeftGamePacketPayload>).payload
        dispatch(removeUserFromActiveGame({ userId, observer: false }))
        break
      }
      case PacketType.OBSERVER_JOINED_GAME: {
        const { observer: user } = (packet as Packet<ObserverJoinedGamePacketPayload>).payload
        dispatch(addUserToActiveGame({ user, observer: true }))
        break
      }
      case PacketType.OBSERVER_LEFT_GAME: {
        const { observerId: userId } = (packet as Packet<ObserverLeftGamePacketPayload>).payload
        dispatch(removeUserFromActiveGame({ userId, observer: true }))
        break
      }
      case PacketType.GAME_SETTINGS_UPDATED: {
        const { settings } = (packet as Packet<GameSettingsUpdatedPacketPayload>).payload
        dispatch(updateActiveGameSettings({ settings }))
        break
      }
      case PacketType.GAME_DECKS_UPDATED: {
        const { decks } = (packet as Packet<GameDecksUpdatedPacketPayload>).payload
        dispatch(updateActiveGameDecks({ decks }))
        break
      }
    }
  })
}
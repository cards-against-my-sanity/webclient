import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Game from "@/types/Game";
import { RootState } from "../store";
import Player from "@/types/Player";
import Observer from "@/types/Observer";
import { produce } from "immer";
import GameState from "@/types/GameState";

export interface GameBrowserState {
  chat: string[]
  games: Game[]
}

const initialState: GameBrowserState = {
  chat: [],
  games: []
}

export const gameBrowserSlice = createSlice({
  name: 'gameBrowser',
  initialState,
  reducers: {
    addGlobalChatMessage: (state, action: PayloadAction<{ message: string }>) => {
      state.chat = produce(state.chat, draft => {
        draft.unshift(action.payload.message)
      })
    },
    setGames: (state, action: PayloadAction<{ games: Game[] }>) => {
      state.games = produce(state.games, draft => {
        draft.length = 0
        draft.push(...action.payload.games)
      })
    },
    addGame: (state, action: PayloadAction<{ game: Game }>) => {
      state.games = produce(state.games, draft => {
        draft.push(action.payload.game)
      })
    },
    removeGame: (state, action: PayloadAction<{ gameId: string }>) => {
      state.games = produce(state.games, draft => {
        const idx = draft.findIndex(g => g.id === action.payload.gameId)
        if (idx === -1) return

        draft.splice(idx, 1)
      })
    },
    changeGameState: (state, action: PayloadAction<{ gameId: string, state: GameState }>) => {
      state.games = produce(state.games, draft => {
        const { gameId, state } = action.payload

        const game = draft.find(g => g.id === gameId)
        if (!game) return

        game.state = state
      })
    },
    addUser: (state, action: PayloadAction<{ gameId: string, user: Player | Observer, observer: boolean }>) => {
      state.games = produce(state.games, draft => {
        const { gameId, user, observer } = action.payload

        const game = draft.find(g => g.id === gameId)
        if (!game) return

        if (observer) {
          game.observers.push(user as Observer)
        } else {
          game.players.push(user as Player)
        }
      })
    },
    removeUser: (state, action: PayloadAction<{ gameId: string, userId: string, observer: boolean }>) => {
      state.games = produce(state.games, draft => {
        const { gameId, userId, observer } = action.payload

        const game = draft.find(g => g.id === gameId)
        if (!game) return

        const target = observer ? game.observers : game.players

        const idx = target.findIndex(u => u.id === userId)
        if (idx === -1) return

        target.splice(idx, 1)
      })
    }
  }
})

export const { addGlobalChatMessage, setGames, addGame, removeGame, changeGameState, addUser, removeUser } = gameBrowserSlice.actions

export const selectGlobalChatMessages = (state: RootState): string[] => state.gameBrowser.chat

export const selectGames = (state: RootState): Game[] => state.gameBrowser.games

export default gameBrowserSlice.reducer
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Game from "@/types/Game";
import { RootState } from "../store";
import GameState from "@/types/GameState";
import Player from "@/types/Player";
import { produce } from "immer";
import Observer from "@/types/Observer";

export interface ActiveGameState {
  game: Game | null,
  subscriptionId: string | null,
  chat: string[]
}

const initialState: ActiveGameState = {
  game: null,
  subscriptionId: null,
  chat: []
}

export const activeGameSlice = createSlice({
  name: 'activeGame',
  initialState,
  reducers: {
    setActiveGame: (state, action: PayloadAction<{ game: Game, subscriptionId: string }>) => {
      const { game, subscriptionId } = action.payload
      state.game = game
      state.subscriptionId = subscriptionId
      state.chat = []
    },
    clearActiveGame: (state) => {
      state.game = null
      state.subscriptionId = null
      state.chat = []
    },
    addLocalChatMessage: (state, action: PayloadAction<{ message: string }>) => {
      if (!state.chat) return
      state.chat = produce(state.chat, draft => {
        draft.unshift(action.payload.message)
      })
    },
    changeActiveGameState: (state, action: PayloadAction<{ state: GameState }>) => {
      if (!state.game) return

      state.game = produce(state.game, draft => {
        draft.state = action.payload.state
      })
    },
    addUserToActiveGame: (state, action: PayloadAction<{ user: Player | Observer, observer: boolean }>) => {
      if (!state.game) return

      console.log('game existed, we are le here!')

      const { user, observer } = action.payload
      state.game = produce(state.game, draft => {
        if (observer) {
          draft.observers.push(user as Observer)
        } else {
          console.log('adding player to draft')
          console.log(user as Player)
          draft.players.push(user as Player)
        }
      })
    },
    removeUserFromActiveGame: (state, action: PayloadAction<{ userId: string, observer: boolean}>) => {
      if (!state.game) return
      
      const { userId, observer } = action.payload

      state.game = produce(state.game, draft => {
        const target = observer ? draft.observers : draft.players
        
        const idx = target.findIndex(u => u.id === userId)
        if (idx === -1) return
        
        target.splice(idx, 1)
      })
    }
  }
})

export const { setActiveGame, clearActiveGame, addLocalChatMessage, changeActiveGameState, addUserToActiveGame, removeUserFromActiveGame } = activeGameSlice.actions

export const selectLocalChatMessages = (state: RootState): string[] => state.activeGame.chat

export const selectActiveGame = (state: RootState): Game | null => state.activeGame.game

export default activeGameSlice.reducer
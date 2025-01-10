import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Game from "@/types/Game";
import { RootState } from "../store";
import GameState from "@/types/GameState";
import Player from "@/types/Player";
import { produce } from "immer";
import Observer from "@/types/Observer";
import GameSettings from "@/types/GameSettings";
import DeckWithCards from "@/types/DeckWithCards";

export interface ActiveGameState {
  game: Game | null,
  subscriptionId: string | null,
  awaitingSettingsAck: boolean,
  awaitingDecksAck: boolean,
  chat: string[]
}

const initialState: ActiveGameState = {
  game: null,
  subscriptionId: null,
  awaitingSettingsAck: false,
  awaitingDecksAck: false,
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
      state.awaitingSettingsAck = false
      state.chat = []
    },
    clearActiveGame: (state) => {
      state.game = null
      state.subscriptionId = null
      state.awaitingSettingsAck = false
      state.chat = []
    },
    setAwaitingSettingsAck: (state, action: PayloadAction<boolean>) => {
      state.awaitingSettingsAck = action.payload
    },
    setAwaitingDecksAck: (state, action: PayloadAction<boolean>) => {
      state.awaitingDecksAck = action.payload
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

      const { user, observer } = action.payload
      state.game = produce(state.game, draft => {
        if (observer) {
          draft.observers.push(user as Observer)
        } else {
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
    },
    updateActiveGameSettings: (state, action: PayloadAction<{ settings: GameSettings }>) => {
      if (!state.game) return
      state.game = produce(state.game, draft => {
        draft.settings = action.payload.settings
      })
    },
    updateActiveGameDecks: (state, action: PayloadAction<{ decks: DeckWithCards[] }>) => {
      if (!state.game) return
      state.game = produce(state.game, draft => {
        draft.decks = action.payload.decks
      })
    }
  }
})

export const { setActiveGame, clearActiveGame, setAwaitingSettingsAck, setAwaitingDecksAck, addLocalChatMessage, changeActiveGameState, addUserToActiveGame, removeUserFromActiveGame, updateActiveGameSettings, updateActiveGameDecks } = activeGameSlice.actions

export const selectLocalChatMessages = (state: RootState): string[] => state.activeGame.chat

export const selectAwaitingSettingsAck = (state: RootState): boolean => state.activeGame.awaitingSettingsAck

export const selectAwaitingDecksAck = (state: RootState): boolean => state.activeGame.awaitingDecksAck

export const selectActiveGame = (state: RootState): Game | null => state.activeGame.game

export default activeGameSlice.reducer
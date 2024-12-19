import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import gameBrowserReducer from './feature/gameBrowserSlice'
import activeGameReducer from './feature/activeGameSlice'

const rootReducer = combineReducers({
  gameBrowser: gameBrowserReducer,
  activeGame: activeGameReducer
})

export const store = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
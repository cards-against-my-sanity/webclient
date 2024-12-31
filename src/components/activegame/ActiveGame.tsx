'use client'

import Game from "@/types/Game"
import { Button } from "../ui/button"
import { useContext } from "react"
import { GameServerContext } from "@/lib/socket/context"
import GameSettingsPanel from "./GameSettingsPanel"
import GameSettings from "@/types/GameSettings"
import { useAppDispatch } from "@/lib/store/store"
import { updateActiveGameAwaitingSettingsAck } from "@/lib/store/feature/activeGameSlice"

export interface ActiveGameProps {
  game: Game
}

export default function ActiveGame({ game }: ActiveGameProps) {
  const { ready, actions } = useContext(GameServerContext)

  const dispatch = useAppDispatch()

  function handleUpdateSettings(settings: Partial<GameSettings>) {
    actions?.updateSettings(game.id, settings)
    dispatch(updateActiveGameAwaitingSettingsAck({ awaitingSettingsAck: true }))
  }

  return (
    <>
      <GameSettingsPanel settings={game.settings} onUpdateSettings={handleUpdateSettings} />
      <Button onClick={() => actions?.leaveGame()} disabled={!ready}>Leave game</Button>
      <p>{JSON.stringify(game)}</p>
    </>
  )
}
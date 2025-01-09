'use client'

import Game from "@/types/Game"
import { Button } from "../ui/button"
import { ReactNode, useContext } from "react"
import { GameServerContext } from "@/lib/socket/context"
import GameState from "@/types/GameState"
import LobbyScreen from "./state/lobby/LobbyScreen"
import Chatbox from "../chatbox/chatbox"

export interface ActiveGameProps {
  game: Game
}

export default function ActiveGame({ game }: ActiveGameProps) {
  const { ready, actions } = useContext(GameServerContext)
  const notImplemented = <p>Not implemented</p>

  let component: ReactNode
  switch (game.state) {
    case GameState.LOBBY:
      component = <LobbyScreen game={game} />
      break
    case GameState.PLAYING:
    case GameState.JUDGING:
    case GameState.WIN:
      component = notImplemented
      break
  }

  return (
    <div className="h-full flex flex-col">
      <Button onClick={() => actions?.leaveGame()} disabled={!ready}>Leave game</Button>
      {component}
      <Chatbox />
    </div>
  )
}
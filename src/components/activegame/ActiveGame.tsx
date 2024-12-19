'use client'

import Game from "@/types/Game"
import { Button } from "../ui/button"
import { useContext } from "react"
import { GameServerContext } from "@/lib/socket/context"

export interface ActiveGameProps {
  game: Game
}

export default function ActiveGame({ game }: ActiveGameProps) {
  const { ready, actions } = useContext(GameServerContext)

  return (
    <>
      <Button onClick={() => actions?.leaveGame()} disabled={!ready}>Leave game</Button>
      <p>{JSON.stringify(game)}</p>
    </>
  )
}
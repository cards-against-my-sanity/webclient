'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import useCurrentUser from "@/lib/hook/useCurrentUser"
import { GameServerContext } from "@/lib/socket/context"
import { useAppSelector } from "@/lib/store/store"
import GameState from "@/types/GameState"
import { useContext, useEffect } from "react"

export default function GameBrowser() {
  const { user } = useCurrentUser()
  const { ready, actions } = useContext(GameServerContext)
  const games = useAppSelector(state => state.gameBrowser.games)

  useEffect(() => {
    if (!ready) return
    actions?.requestGameList()
  }, [ready, actions])

  function doJoinGame(gameId: string, asObserver: boolean) {
    actions?.joinGame({
      gameId,
      asObserver
    })
  }

  return (
    <div>
      <Button onClick={() => actions?.createGame()} disabled={!ready}>
        {ready ? 'Create game' : 'Connecting...'}
      </Button>
      <div className="grid grid-cols-3 gap-4">
        {games.filter(g => g.state !== GameState.ABANDONED).map(game => (
          <Card key={game.id}>
            <CardHeader>
              <CardTitle>{game.players.find(p => p.id === game.hostId)?.nickname}&apos;s game</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{game.players.length} players</p>
              <p>{game.observers.length} observers</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => doJoinGame(game.id, false)} disabled={!!!user}>Join</Button>
              <Button onClick={() => doJoinGame(game.id, true)} disabled={!!!user}>Observe</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
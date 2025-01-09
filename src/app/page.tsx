'use client'

import ActiveGame from "@/components/activegame/ActiveGame";
import GameBrowser from "@/components/lobby/gamebrowser/GameBrowser";
import { useAppSelector } from "@/lib/store/store";

export default function Home() {
  const activeGame = useAppSelector(state => state.activeGame.game)

  return (
    <>
      {activeGame ? <ActiveGame game={activeGame} /> : <GameBrowser />}
    </>
  );
}

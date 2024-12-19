import GameState from "@/types/GameState";

export default interface GameStateChangePacketPayload {
  gameId: string,
  state: GameState
}
import GameSettings from "./GameSettings";
import GameState from "./GameState";
import Observer from "./Observer";
import Player from "./Player";

export default interface Game {
  id: string,
  hostId: string,
  settings: GameSettings,
  state: GameState,
  players: Player[],
  observers: Observer[]
}
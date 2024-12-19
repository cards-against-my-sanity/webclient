import PlayerState from "./PlayerState";
import Role from "./Role";

export default interface Player {
  id: string,
  nickname: string,
  roles: Role[],
  state: PlayerState,
  score: number,
  needsToPlay: boolean
}
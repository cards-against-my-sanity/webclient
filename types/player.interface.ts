import { PlayerState } from "./player-state.enum";

export default interface PlayerType {
    id: string;
    nickname: string;
    state: PlayerState;
    score: number;
}
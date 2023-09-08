import { DeckType } from "./deck.interface";
import { GameState } from "./game-state.enum";
import { UserType } from "./user.interface";

export interface GameType {
    id: string;
    
    host: {
        id: string;
        nickname: string;
    };

    decks: DeckType[];

    state: GameState;

    settings: {
        maxPlayers: number;
        maxSpectators: number;
        maxScore: number;
    };

    players: { id: string, nickname: string }[];

    spectators: { id: string, nickname: string }[];

    roundNumber: number;
}
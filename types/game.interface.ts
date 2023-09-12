import { DeckType } from "./deck.interface";
import { GameSettings } from "./game-settings.interface";
import { GameState } from "./game-state.enum";
import PlayerType from "./player.interface";
import SpectatorType from "./spectator.interface";

export interface GameType {
    id: string;
    
    host: {
        id: string;
        nickname: string;
    };

    decks: DeckType[];

    state: GameState;

    settings: GameSettings;

    players: PlayerType[];

    spectators: SpectatorType[];

    roundNumber: number;
}
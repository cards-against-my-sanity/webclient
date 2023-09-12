export interface GameSettings {
    maxPlayers: number;
    maxSpectators: number;
    maxScore: number;
    roundIntermissionSeconds: number;
    gameWinIntermissionSeconds: number;
    allowPlayersToJoinMidGame: boolean;
    hasPassword: boolean;
}
export default interface GameSettings {
  maxPlayers: number;
  maxObservers: number;
  maxScore: number;   
  roundIntermissionTimer: number;
  gameWinIntermissionTimer: number;
  playingTimer: number;
  judgingTimer: number;
  allowPlayersToJoinMidGame: boolean;
}
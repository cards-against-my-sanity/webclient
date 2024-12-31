import GameSettings from "@/types/GameSettings";

export default interface GameSettingsUpdatedPacketPayload {
  gameId: string,
  settings: GameSettings
}
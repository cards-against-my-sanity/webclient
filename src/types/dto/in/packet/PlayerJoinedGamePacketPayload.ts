import Player from "@/types/Player";

export default interface PlayerJoinedGamePacketPayload {
  gameId: string,
  player: Player
}
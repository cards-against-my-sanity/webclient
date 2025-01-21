import Deck from "@/types/Deck";

export default interface GameDecksUpdatedPacketPayload {
  gameId: string,
  decks: Deck[]
}
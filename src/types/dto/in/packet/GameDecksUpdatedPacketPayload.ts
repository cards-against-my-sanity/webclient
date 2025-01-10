import DeckWithCards from "@/types/DeckWithCards";

export default interface GameDecksUpdatedPacketPayload {
  gameId: string,
  decks: DeckWithCards[]
}
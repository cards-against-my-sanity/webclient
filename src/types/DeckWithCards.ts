import BlackCard from "./BlackCard";
import Deck from "./Deck";
import WhiteCard from "./WhiteCard";

export default interface DeckWithCards {
  deck: Deck,
  blackCards: BlackCard[],
  whiteCards: WhiteCard[]
}
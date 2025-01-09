import BlackCard from "./BlackCard";
import WhiteCard from "./WhiteCard";

export default interface Deck {
  id: string,
  name: string,
  description: string,
  weight: number,
  blackCards: BlackCard[],
  whiteCards: WhiteCard[]
}
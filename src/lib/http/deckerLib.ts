import Axios from "axios";
import BaseConfig from './axiosConfig'
import Deck from "@/types/Deck";
import DeckWithCards from "@/types/DeckWithCards";

export const deckerClient = Axios.create({
  ...BaseConfig,
  baseURL: process.env.NEXT_PUBLIC_DECKER_API_BASE
})

export async function getDecks(): Promise<Deck[]> {
  return (await deckerClient.get<Deck[]>('/decks')).data
}

export async function getDecksWithCards(ids: string[]): Promise<DeckWithCards[]> {
  return (await deckerClient.get<DeckWithCards[]>('/decks', {
    params: {
      id: ids
    },
    paramsSerializer: {
      indexes: null
    }
  })).data
}

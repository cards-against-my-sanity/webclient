import Axios from "axios";
import BaseConfig from './axiosConfig'
import Deck from "@/types/Deck";

export const deckerClient = Axios.create({
  ...BaseConfig,
  baseURL: process.env.NEXT_PUBLIC_DECKER_API_BASE
})

export async function getDecks(): Promise<Deck[]> {
  return (await deckerClient.get<Deck[]>('/decks')).data
}

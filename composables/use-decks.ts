import { DeckType } from "~/types/deck.interface";

export const useDecks = () => {
    const fetch = $fetch.create({ baseURL: useRuntimeConfig().public.apiBase });

    async function fetchDecks(): Promise<DeckType[]|null> {
        try {
            return fetch<DeckType[]>("decks");
        } catch (err) {
            return null;
        }
    }

    async function fetchOneDeck(id: string): Promise<DeckType|null> {
        try {
            return fetch<DeckType>(`decks/${id}`);
        } catch (err) {
            return null;
        }
    }

    return { fetchDecks, fetchOneDeck };
};
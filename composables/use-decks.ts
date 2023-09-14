import IDeck from "~/shared-types/deck/deck.interface";

export const useDecks = () => {
    const fetch = $fetch.create({ baseURL: useRuntimeConfig().public.apiBase });

    async function fetchDecks(): Promise<IDeck[]|null> {
        try {
            return fetch<IDeck[]>("decks");
        } catch (err) {
            return null;
        }
    }

    async function fetchOneDeck(id: string): Promise<IDeck|null> {
        try {
            return fetch<IDeck>(`decks/${id}`);
        } catch (err) {
            return null;
        }
    }

    return { fetchDecks, fetchOneDeck };
};
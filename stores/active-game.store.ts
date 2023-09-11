import { defineStore } from "pinia";
import { ChatMessage } from "~/types/chat-message.interface";
import { DeckType } from "~/types/deck.interface";
import { GameSettings } from "~/types/game-settings.interface";
import { GameState } from "~/types/game-state.enum";
import { GameType } from "~/types/game.interface";
import { PlayerState } from "~/types/player-state.enum";
import { useUserStore } from "./user.store";
import { WhiteCard } from "~/types/white-card.interface";
import { BlackCard } from "~/types/black-card.interface";

export const useActiveGameStore = defineStore('active-game', () => {
    const userStore = useUserStore();

    const game = ref<GameType | null>(null);
    const exists = computed(() => game.value !== null);
    const chats = ref<ChatMessage[]>([]);
    const hand = ref<WhiteCard[]>([]);
    const blackCard = ref<BlackCard | null>(null);
    const myState = ref<PlayerState>(PlayerState.Player);
    const iAmTheHost = computed(() => exists.value ? game.value!.host.id === userStore.user!.id : false);
    const iAmASpectator = ref<boolean>(false);
    const iAmTheJudge = computed(() => myState.value === PlayerState.Judge);
    const cardsBeingJudged = ref<WhiteCard[][]>([]);

    function addPlayer(player: {id: string, nickname: string}) {
        if (!exists.value) {
            return;
        }

        game.value!.players.push(player);
    }

    function removePlayer(userId: string) {
        if (!exists.value) {
            return;
        }

        game.value!.players = game.value!.players.filter(p => p.id !== userId);
    }

    function addSpectator(spectator: {id: string, nickname: string}) {
        if (!exists.value) {
            return;
        }

        game.value!.spectators.push(spectator);
    }

    function removeSpectator(userId: string) {
        if (!exists.value) {
            return;
        }

        game.value!.spectators = game.value!.spectators.filter(s => s.id !== userId);
    }

    function incrementRound() {
        if (!exists.value) {
            return;
        }

        game.value!.roundNumber++;
    }

    function setDecks(decks: DeckType[]) {
        if (!exists.value) {
            return;
        }

        game.value!.decks = decks;
    }

    function setSettings(settings: GameSettings) {
        if (!exists.value) {
            return;
        }

        game.value!.settings = settings;
    }

    function setState(state: GameState) {
        if (!exists.value) {
            return;
        }

        game.value!.state = state;
    }

    function addChat(chat: ChatMessage) {
        chats.value.push(chat);
    }

    function discardCards(cards: string[]) {
        hand.value = hand.value.filter(c => !cards.includes(c.id));
    }

    function reset() {
        game.value = null;
        chats.value.length = 0;
        hand.value.length = 0;
        blackCard.value = null;
        myState.value = PlayerState.Player;
        iAmASpectator.value = false;
    }

    return {
        game,
        exists,
        chats,
        hand,
        blackCard,
        myState,
        iAmTheHost,
        iAmASpectator,
        iAmTheJudge,
        cardsBeingJudged,
        addPlayer,
        removePlayer,
        addSpectator,
        removeSpectator,
        incrementRound,
        setDecks,
        setSettings,
        setState,
        addChat,
        discardCards,
        reset
    }
})
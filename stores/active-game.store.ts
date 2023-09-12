import { defineStore } from "pinia";
import { Message } from "~/types/message.interface";
import { DeckType } from "~/types/deck.interface";
import { GameSettings } from "~/types/game-settings.interface";
import { GameState } from "~/types/game-state.enum";
import { GameType } from "~/types/game.interface";
import { PlayerState } from "~/types/player-state.enum";
import { useUserStore } from "./user.store";
import { WhiteCard } from "~/types/white-card.interface";
import { BlackCard } from "~/types/black-card.interface";
import PlayerType from "~/types/player.interface";
import SpectatorType from "~/types/spectator.interface";
import dayjs from 'dayjs';

export const useActiveGameStore = defineStore('active-game', () => {
    const userStore = useUserStore();

    const game = ref<GameType | null>(null);
    const exists = computed(() => game.value !== null);
    const chats = ref<Partial<Message>[]>([]);
    const hand = ref<WhiteCard[]>([]);
    const blackCard = ref<BlackCard | null>(null);
    const iAmTheHost = computed(() => exists.value ? game.value!.host.id === userStore.user!.id : false);
    const iAmASpectator = computed(() => exists.value ? game.value!.spectators.findIndex(s => s.id === userStore.user!.id) !== -1 : false);
    const iAmTheJudge = computed(() => exists.value ? game.value!.players.find(p => p.id === userStore.user!.id)!.state : false);
    const cardsBeingJudged = ref<WhiteCard[][]>([]);

    function addPlayer(player: PlayerType) {
        if (!exists.value) {
            return;
        }

        game.value!.players.push(player);
    }

    function getPlayerById(id: string) {
        return game.value!.players.find(p => p.id === id);
    }

    function removePlayer(userId: string) {
        if (!exists.value) {
            return;
        }

        game.value!.players = game.value!.players.filter(p => p.id !== userId);
    }

    function resetPlayerStates() {
        game.value!.players.forEach(p => p.state = PlayerState.Player);
    }

    function setPlayerState(userId: string, state: PlayerState) {
        const player = game.value!.players.find(p => p.id === userId);
        if (player) {
            player.state = state;
        }
    }

    function addSpectator(spectator: SpectatorType) {
        if (!exists.value) {
            return;
        }

        game.value!.spectators.push(spectator);
    }

    function getSpectatorById(id: string) {
        return game.value!.spectators.find(s => s.id === id);
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

    function addChat(chat: Partial<Message>) {
        chats.value.push({
            ...chat,
            received: dayjs().format('h:mm:ss A')
        });
    }

    function discardCards(cards: string[]) {
        hand.value = hand.value.filter(c => !cards.includes(c.id));
    }

    function resetGameData() {
        game.value!.roundNumber = 0;
        game.value!.players.forEach(p => {
            p.state = PlayerState.Player;
            p.score = 0;
        });

        hand.value.length = 0;
        blackCard.value = null;
        cardsBeingJudged.value.length = 0;
    }

    function resetStore() {
        game.value = null;
        chats.value.length = 0;
        hand.value.length = 0;
        blackCard.value = null;
        cardsBeingJudged.value.length = 0;
    }

    return {
        game,
        exists,
        chats,
        hand,
        blackCard,
        iAmTheHost,
        iAmASpectator,
        iAmTheJudge,
        cardsBeingJudged,
        addPlayer,
        getPlayerById,
        removePlayer,
        resetPlayerStates,
        setPlayerState,
        addSpectator,
        getSpectatorById,
        removeSpectator,
        incrementRound,
        setDecks,
        setSettings,
        setState,
        addChat,
        discardCards,
        resetGameData,
        resetStore
    }
})
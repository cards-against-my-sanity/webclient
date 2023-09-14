import { defineStore } from "pinia";
import { useUserStore } from "./user.store";
import IGame from "~/shared-types/game/game.interface";
import IPlayer from "~/shared-types/game/player/player.interface";
import { PlayerState } from "~/shared-types/game/player/player-state.enum";
import ISpectator from "~/shared-types/game/spectator/spectator.interface";
import IDeck from "~/shared-types/deck/deck.interface";
import IGameSettings from "~/shared-types/game/game-settings.interface";
import { GameState } from "~/shared-types/game/game-state.enum";
import { IChatMessage } from "~/shared-types/game/component/message/chat-message.interface";
import IWhiteCard from "~/shared-types/card/white/white-card.interface";
import IBlackCard from "~/shared-types/card/black/black-card.interface";
import ISystemMessage from "~/shared-types/game/component/message/system-message.interface";

export const useActiveGameStore = defineStore('active-game', () => {
    const userStore = useUserStore();

    const game = ref<IGame | null>(null);
    const exists = computed(() => game.value !== null);
    const chats = ref<IChatMessage[]>([]);
    const systemMessages = ref<ISystemMessage[]>([]);
    const hand = ref<IWhiteCard[]>([]);
    const blackCard = ref<IBlackCard | null>(null);
    const iAmTheHost = computed(() => exists.value ? game.value!.host.id === userStore.user!.id : false);
    const iAmASpectator = computed(() => exists.value ? game.value!.spectators.findIndex(s => s.id === userStore.user!.id) !== -1 : false);
    const iAmTheJudge = computed(() => exists.value ? game.value!.players.find(p => p.id === userStore.user!.id)!.state : false);
    const cardsBeingJudged = ref<IWhiteCard[][]>([]);

    function addPlayer(player: IPlayer) {
        if (!exists.value) {
            return;
        }

        game.value!.players.push(player);
    }

    function getPlayerById(id: string): IPlayer | null {
        return game.value!.players.find(p => p.id === id) || null;
    }

    function removePlayer(id: string): void {
        if (!exists.value) {
            return;
        }

        game.value!.players = game.value!.players.filter(p => p.id !== id);
    }

    function resetPlayerStates() {
        game.value!.players.forEach(p => p.state = PlayerState.Player);
    }

    function setPlayerState(id: string, state: PlayerState) {
        const player = game.value!.players.find(p => p.id === id);
        if (player) {
            player.state = state;
        }
    }

    function addSpectator(spectator: ISpectator) {
        if (!exists.value) {
            return;
        }

        game.value!.spectators.push(spectator);
    }

    function getSpectatorById(id: string) {
        return game.value!.spectators.find(s => s.id === id);
    }

    function removeSpectator(id: string) {
        if (!exists.value) {
            return;
        }

        game.value!.spectators = game.value!.spectators.filter(s => s.id !== id);
    }

    function incrementRound() {
        if (!exists.value) {
            return;
        }

        game.value!.roundNumber++;
    }

    function setDecks(decks: IDeck[]) {
        if (!exists.value) {
            return;
        }

        game.value!.decks = decks;
    }

    function setSettings(settings: IGameSettings) {
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

    function addChat(payload: IChatMessage) {
        chats.value.push(payload);
    }

    function addSystemMessage(message: ISystemMessage) {
        systemMessages.value.push(message);
    }

    function addSystemMessageDirectly(content: string) {
        addSystemMessage({
            content,
            context: {
                timestamp: new Date().getTime()
            }
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
        systemMessages,
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
        addSystemMessage,
        addSystemMessageDirectly,
        discardCards,
        resetGameData,
        resetStore
    }
})
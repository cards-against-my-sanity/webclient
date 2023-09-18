import { defineStore } from "pinia";
import { useUserStore } from "./user.store";
import IGame from "~/shared-types/game/game.interface";
import IPlayer from "~/shared-types/game/player/player.interface";
import { PlayerState } from "~/shared-types/game/player/player-state.enum";
import ISpectator from "~/shared-types/game/spectator/spectator.interface";
import IDeck from "~/shared-types/deck/deck.interface";
import IGameSettings from "~/shared-types/game/game-settings.interface";
import { GameState } from "~/shared-types/game/game-state.enum";
import IWhiteCard from "~/shared-types/card/white/white-card.interface";
import IBlackCard from "~/shared-types/card/black/black-card.interface";
import IMessage from "~/shared-types/game/component/message/message.interface";

export const useActiveGameStore = defineStore('active-game', () => {
    const userStore = useUserStore();

    // actual state being kept
    const game = ref<IGame | null>(null);    
    const messages = ref<IMessage[]>([]);
    const hand = ref<IWhiteCard[]>([]);
    const blackCard = ref<IBlackCard | null>(null);
    const cardsBeingJudged = ref<IWhiteCard[][]>([]);
    const winningCards = ref<IWhiteCard[]>([]);
    const timerRef = ref<NodeJS.Timeout|undefined>(undefined);
    const initialTimerValue = ref<number>(0);
    const timerValue = ref<number>(0);

    // values computed from held state
    const exists = computed(() => game.value !== null);
    const player = computed(() => game.value!.players.find(p => p.id === userStore.user!.id));
    const currentJudge = computed(() => game.value!.players.find(p => p.state === PlayerState.Judge));
    const spectator = computed(() => game.value!.spectators.find(s => s.id === userStore.user!.id));
    const isHost = computed(() => exists.value ? game.value!.host.id === userStore.user!.id : false);
    const isSpectator = computed(() => exists.value ? !!spectator : false);
    const isJudge = computed(() => exists.value ? player.value!.state === PlayerState.Judge : false);
    const needToPlay = computed(() => exists.value ? player.value!.needToPlay : false);
    const hasTimer = computed(() => timerRef.value !== undefined);
    const timerPercentLeft = computed(() => hasTimer.value ? Math.ceil((timerValue.value / initialTimerValue.value) * 100) : 0);

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

        // Server removed me (perhaps timer elapsed)
        if (player.value!.id === id) {
            resetStore();
            return;
        }

        game.value!.players = game.value!.players.filter(p => p.id !== id);
    }

    function updatePlayer(id: string, mutator: (player: IPlayer) => void) {
        const player = game.value!.players.find(p => p.id === id);
        if (player) {
            mutator(player);
        }
    }

    function updateEachPlayer(mutator: (player: IPlayer) => void) {
        if (!exists.value) {
            return;
        }

        game.value!.players.forEach(player => mutator(player));
    }

    function resetPlayerStates() {
        updateEachPlayer(player => player.state = PlayerState.Player);
    }

    function resetPlayerScores() {
        updateEachPlayer(player => player.score = 0);
    }

    function incrementPlayerScore(id: string) {
        updatePlayer(id, player => player.score++);
    }

    function setPlayerState(id: string, state: PlayerState) {
        updatePlayer(id, player => player.state = state);
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

    function addMessage(payload: IMessage) {
        messages.value.unshift(payload);
    }

    function addSystemMessageDirectly(content: string) {
        addMessage({
            type: 'system',
            content,
            timestamp: new Date().getTime()
        })
    }

    function discardCards(cards: string[]) {
        hand.value = hand.value.filter(c => !cards.includes(c.id));
    }

    function startTimer(seconds: number) {
        if (timerRef.value !== null) {
            clearTimer();
        }

        initialTimerValue.value = seconds;
        timerValue.value = seconds;
        timerRef.value = setInterval(() => timerValue.value--, 1000);
    }

    function clearTimer() {
        clearTimeout(timerRef.value);
        timerRef.value = undefined;
        initialTimerValue.value = 0;
        timerValue.value = 0;
    }

    function resetGameData() {
        game.value!.state = GameState.Lobby;
        game.value!.roundNumber = 0;

        resetPlayerStates();
        resetPlayerScores();

        hand.value.length = 0;
        blackCard.value = null;
        cardsBeingJudged.value.length = 0;
    }

    function resetStore() {
        game.value = null;
        messages.value.length = 0;
        hand.value.length = 0;
        blackCard.value = null;
        cardsBeingJudged.value.length = 0;
    }

    return {
        game,
        messages,
        hand,
        blackCard,
        cardsBeingJudged,
        winningCards,
        exists,
        player,
        currentJudge,
        spectator,
        isHost,
        isSpectator,
        isJudge,
        needToPlay,
        timerValue,
        initialTimerValue,
        hasTimer,
        timerPercentLeft,
        addPlayer,
        getPlayerById,
        removePlayer,
        updatePlayer,
        updateEachPlayer,
        resetPlayerStates,
        resetPlayerScores,
        incrementPlayerScore,
        setPlayerState,
        addSpectator,
        getSpectatorById,
        removeSpectator,
        incrementRound,
        setDecks,
        setSettings,
        setState,
        addMessage,
        addSystemMessageDirectly,
        discardCards,
        startTimer,
        clearTimer,
        resetGameData,
        resetStore
    }
})
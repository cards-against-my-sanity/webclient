import { defineStore } from "pinia";
import { ChatMessage } from "~/types/chat-message.interface";
import { DeckType } from "~/types/deck.interface";
import { GameSettings } from "~/types/game-settings.interface";
import { GameState } from "~/types/game-state.enum";
import { GameType } from "~/types/game.interface";
import { PlayerState } from "~/types/player-state.enum";

export const useGameStore = defineStore('game', () => {
    const allGames = ref<GameType[]>([]);
    const activeGame = ref<GameType | null>(null);
    const activeGameChats = ref<ChatMessage[]>([]);
    const playerState = ref<PlayerState>(PlayerState.Player);
    const isSpectator = ref<boolean>(false);
    const serverWaitingForInput = ref<boolean>(false);

    function addGame(game: GameType) {
        allGames.value.push(game);
    }

    function updateGame(gameId: string, modifier: (game: GameType) => GameType) {
        const gameIdx = allGames.value.findIndex(g => g.id === gameId);

        if (gameIdx === -1) {
            return;
        }

        allGames.value[gameIdx] = modifier(allGames.value[gameIdx]);
    }

    function removeGame(gameId: string) {
        allGames.value = allGames.value.filter(g => g.id !== gameId);
    }

    function addGamePlayer(gameId: string, player: {id: string, nickname: string}) {
        updateGame(gameId, game => {
            game.players.push(player);
            return game;
        })
    }

    function removeGamePlayer(gameId: string, userId: string) {
        updateGame(gameId, game => {
            game.players = game.players.filter(p => p.id !== userId);
            return game;
        })
    }

    function addGameSpectator(gameId: string, spectator: {id: string, nickname: string}) {
        updateGame(gameId, game => {
            game.spectators.push(spectator);
            return game;
        })
    }

    function removeGameSpectator(gameId: string, userId: string) {
        updateGame(gameId, game => {
            game.spectators = game.spectators.filter(s => s.id !== userId);
            return game;
        })
    }

    function incrementGameRoundNumber(gameId: string) {
        updateGame(gameId, game => {
            game.roundNumber++;
            return game;
        });
    }

    function updateGameDecks(gameId: string, decks: DeckType[]) {
        updateGame(gameId, game => {
            game.decks = decks;
            return game;
        });
    }

    function updateGameSettings(gameId: string, settings: GameSettings) {
        updateGame(gameId, game => {
            game.settings = settings;
            return game;
        })
    }

    function updateGameState(gameId: string, state: GameState) {
        updateGame(gameId, game => {
            game.state = state;
            return game;
        })
    }

    function setActiveGame(game: GameType | null) {
        activeGame.value = game;
    }

    const hasActiveGame = computed(() => activeGame.value !== null);

    function addActiveGameChat(chat: ChatMessage) {
        if (!hasActiveGame.value) {
            return;
        }

        activeGameChats.value.push(chat);
    }

    function clearActiveGameChats() {
        if (!hasActiveGame.value) {
            return;
        }

        activeGameChats.value.length = 0;
    }

    const isPlayer = computed(() => playerState.value === PlayerState.Player);

    const isJudge = computed(() => playerState.value === PlayerState.Judge);

    return { 
        allGames, 
        activeGame, 
        activeGameChats,
        playerState,
        serverWaitingForInput, 
        isSpectator,
        addGame,
        updateGame,
        removeGame,
        addGamePlayer,
        removeGamePlayer,
        addGameSpectator,
        removeGameSpectator,
        incrementGameRoundNumber,
        updateGameDecks,
        updateGameSettings, 
        updateGameState,
        setActiveGame,
        hasActiveGame, 
        addActiveGameChat,
        clearActiveGameChats,
        isPlayer,
        isJudge
    };
});
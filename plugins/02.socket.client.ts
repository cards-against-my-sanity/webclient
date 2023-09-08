import { io } from 'socket.io-client'
import { useGameStore } from '~/stores/game.store';
import { GameType } from '~/types/game.interface';
import { useNuxtApp } from 'nuxt/app';
import { ChatMessage } from '~/types/chat-message.interface';
import { GameState } from '~/types/game-state.enum';
import { useUserStore } from '~/stores/user.store';

export default defineNuxtPlugin(() => {
    const nuxtApp = useNuxtApp();
    const gameStore = useGameStore();
    const userStore = useUserStore();

    const socket = io(useRuntimeConfig().public.ws, { withCredentials: true });

    socket.on('gameNotCreated', () => nuxtApp.$sendErrorNotification("Game not created", "You are already hosting a game."));

    socket.on('gameCreated', (game: GameType) => gameStore.setActiveGame(game));

    socket.on('gameAdded', (game: GameType) => gameStore.addGame(game));

    socket.on('gameNotFound', () => nuxtApp.$sendErrorNotification("Game not found", "Unknown game was specified"))

    socket.on('gameNotStarted', (payload) => nuxtApp.$sendErrorNotification("Game not started", payload.reason))

    socket.on('gameInProgress', () => nuxtApp.$sendErrorNotification("Game already in progress", "You can't do that right now. The game is already in progress."))

    socket.on('deckNotAdded', (payload) => nuxtApp.$sendErrorNotification("Deck not added", payload.reason));

    socket.on('deckAdded', (payload) => {
        if (gameStore.hasActiveGame) {
            gameStore.updateGameDecks(gameStore.activeGame!.id, payload.decks);
        } else {
            gameStore.updateGameDecks(payload.id, payload.decks);
        }
    })

    socket.on('settingsUpdated', (payload) => {
        if (gameStore.hasActiveGame) {
            gameStore.updateGameSettings(gameStore.activeGame!.id, payload.settings);
        } else {
            gameStore.updateGameSettings(payload.id, payload.settings);
        }
    })

    socket.on('gameNotJoined', (payload) => nuxtApp.$sendErrorNotification("Game not joined", payload.reason));

    socket.on('gameJoined', (game: GameType) => {
        gameStore.setActiveGame(game);
        gameStore.isSpectator = false;
    });

    socket.on('gameNotSpectated', (payload) => nuxtApp.$sendErrorNotification("Game not spectated", payload.reason));

    socket.on('gameSpectated', (game: GameType) => {
        gameStore.setActiveGame(game);
        gameStore.isSpectator = true;
    });

    socket.on('complianceImpossible', (payload) => nuxtApp.$sendErrorNotification("Couldn't do that", payload.reason))

    socket.on('gameLeft', async () => {
        gameStore.setActiveGame(null);
        gameStore.clearActiveGameChats();
    });

    socket.on('gameRemoved', (payload: Record<string, any>) => gameStore.removeGame(payload.id));

    socket.on('gameUnspectated', async () => {
        gameStore.setActiveGame(null);
        gameStore.clearActiveGameChats();
    });

    socket.on('chat', (message: ChatMessage) => gameStore.addActiveGameChat(message));

    socket.on('cardsNotPlayed', (payload) => nuxtApp.$sendErrorNotification("Card(s) not played", payload.reason));

    socket.on('cardsPlayed', () => {
        // TODO
    });

    socket.on('cardsNotJudged', (payload) => nuxtApp.$sendErrorNotification("Card(s) not judged", payload.reason));

    socket.on('playerJoined', (payload) => {
        if (gameStore.hasActiveGame) {
            gameStore.activeGame!.players.push({ id: payload.id, nickname: payload.nickname });
        } else {
            gameStore.addGamePlayer(payload.gameId, { id: payload.id, nickname: payload.nickname });
        }
    })

    socket.on('roundNumberIncrement', (payload) => {
        gameStore.incrementGameRoundNumber(payload.gameId);
    });

    socket.on('playerLeft', (payload) => {
        if (gameStore.hasActiveGame) {
            gameStore.activeGame!.players = gameStore.activeGame!.players.filter(p => p.id !== payload.id);
        } else {
            gameStore.removeGamePlayer(payload.gameId, payload.id);
        }
    })

    socket.on('spectatorJoined', (payload) => {
        if (gameStore.hasActiveGame) {
            gameStore.activeGame!.spectators.push({ id: payload.id, nickname: payload.nickname });
        } else {
            gameStore.addGameSpectator(payload.gameId, { id: payload.id, nickname: payload.nickname });
        }
    })

    socket.on('spectatorLeft', (payload) => {
        if (gameStore.hasActiveGame) {
            gameStore.activeGame!.spectators = gameStore.activeGame!.spectators.filter(p => p.id !== payload.id);
        } else {
            gameStore.removeGameSpectator(payload.gameId, payload.id);
        }
    })

    socket.on('beginNextRound', () => gameStore.incrementGameRoundNumber(gameStore.activeGame!.id))

    socket.on('dealCard', () => {})

    socket.on('dealBlackCard', () => {})

    socket.on('roundWinner', () => {}) // TODO: notification state

    socket.on('gameWinner', () => {}) // TODO: notification state

    socket.on('resetWarning', () => {}) // TODO: notification state

    socket.on('illegalStateTransition', () => {}) // TODO: notification state

    socket.on('stateTransition', (payload: Record<string, any>) => {
        if (payload.to === GameState.Abandoned 
            && gameStore.hasActiveGame
            && payload.gameId === gameStore.activeGame!.id
            && userStore.user!.id !== gameStore.activeGame!.host.id
        ) {
            socket.emit('leaveGame', { gameId: gameStore.activeGame!.id });
            nuxtApp.$sendWarningNotificaton("Game closed", "The host left the game, so you were removed.");
        } else if (gameStore.hasActiveGame) {
            gameStore.activeGame!.state = payload.to;
        } else {
            gameStore.updateGameState(payload.id, payload.to);
        }
    });

    socket.on('connectionStatus', () => {})

    socket.on('unauthorized', () => {})

    async function loadGames() {

    }

    return {
        provide: {
            socket
        }
    }
})
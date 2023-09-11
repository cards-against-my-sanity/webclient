import { io } from 'socket.io-client'
import { useGameBrowserStore } from '~/stores/game-browser.store';
import { GameType } from '~/types/game.interface';
import { useNuxtApp } from 'nuxt/app';
import { ChatMessage } from '~/types/chat-message.interface';
import { GameState } from '~/types/game-state.enum';
import { useUserStore } from '~/stores/user.store';
import { useActiveGameStore } from '~/stores/active-game.store';
import { PlayerState } from '~/types/player-state.enum';

export default defineNuxtPlugin(() => {
    const nuxtApp = useNuxtApp();
    const gameBrowserStore = useGameBrowserStore();
    const activeGameStore = useActiveGameStore();
    const userStore = useUserStore();

    const socket = io(useRuntimeConfig().public.ws, { withCredentials: true });

    socket.on('gameNotCreated', () => nuxtApp.$sendErrorNotification("Game not created", "You are already hosting a game."));

    socket.on('gameCreated', (game: GameType) => activeGameStore.game = game);

    socket.on('gameAdded', (game: GameType) => gameBrowserStore.add(game));

    socket.on('gameNotFound', () => nuxtApp.$sendErrorNotification("Game not found", "Unknown game was specified"))

    socket.on('gameNotStarted', (payload) => nuxtApp.$sendErrorNotification("Game not started", payload.reason))

    socket.on('gameInProgress', () => nuxtApp.$sendErrorNotification("Game already in progress", "You can't do that right now. The game is already in progress."))

    socket.on('deckNotAdded', (payload) => nuxtApp.$sendErrorNotification("Deck not added", payload.reason));

    socket.on('deckNotRemoved', (payload) => nuxtApp.$sendErrorNotification("Deck not removed", payload.reason));

    socket.on('decksUpdated', (payload) => {
        if (activeGameStore.exists) {
            activeGameStore.setDecks(payload.decks);
        } else {
            gameBrowserStore.setDecks(payload.id, payload.decks);
        }
    });

    socket.on('maxPlayersTooLow', (payload) => nuxtApp.$sendErrorNotification("Max players too low", payload.reason));
    
    socket.on('maxSpectatorsTooLow', (payload) => nuxtApp.$sendErrorNotification("Max spectators too low", payload.reason));

    socket.on('maxScoreTooLow', (payload) => nuxtApp.$sendErrorNotification("Max score too low", payload.reason));

    socket.on('settingsUpdated', (payload) => {
        if (activeGameStore.exists) {
            activeGameStore.setSettings(payload.settings);
        } else {
            gameBrowserStore.setSettings(payload.id, payload.settings);
        }
    });

    socket.on('gameNotJoined', (payload) => nuxtApp.$sendErrorNotification("Game not joined", payload.reason));

    socket.on('gameJoined', (game: GameType) => {
        activeGameStore.game = game;
        activeGameStore.iAmASpectator = false;
    });

    socket.on('gameNotSpectated', (payload) => nuxtApp.$sendErrorNotification("Game not spectated", payload.reason));

    socket.on('gameSpectated', (game: GameType) => {
        activeGameStore.game = game;
        activeGameStore.iAmASpectator = true;
    });

    socket.on('complianceImpossible', (payload) => nuxtApp.$sendErrorNotification("Couldn't do that", payload.reason))

    socket.on('gameLeft', async () => activeGameStore.reset());

    socket.on('gameRemoved', (payload: Record<string, any>) => gameBrowserStore.remove(payload.id));

    socket.on('gameUnspectated', async () => activeGameStore.reset());

    socket.on('chat', (message: ChatMessage) => activeGameStore.addChat(message));

    socket.on('cardsNotPlayed', (payload) => nuxtApp.$sendErrorNotification("Card(s) not played", payload.reason));

    socket.on('cardsPlayed', (payload) => nuxtApp.$sendSuccessNotification('Cards played!', `${payload.nickname} has played their cards!`));

    socket.on('discardCards', (payload) => activeGameStore.discardCards(payload.cards));

    socket.on('cardsNotJudged', (payload) => nuxtApp.$sendErrorNotification("Card(s) not judged", payload.reason));

    socket.on('playerJoined', (payload) => {
        if (activeGameStore.exists) {
            activeGameStore.addPlayer({ id: payload.id, nickname: payload.nickname });
        } else {
            gameBrowserStore.addPlayer(payload.gameId, { id: payload.id, nickname: payload.nickname });
        }
    });

    socket.on('playerLeft', (payload) => {
        if (activeGameStore.exists) {
            activeGameStore.removePlayer(payload.id);
        } else {
            gameBrowserStore.removePlayer(payload.gameId, payload.id);
        }
    });

    socket.on('spectatorJoined', (payload) => {
        if (activeGameStore.exists) {
            activeGameStore.addSpectator({ id: payload.id, nickname: payload.nickname });
        } else {
            gameBrowserStore.addSpectator(payload.gameId, { id: payload.id, nickname: payload.nickname });
        }
    });

    socket.on('spectatorLeft', (payload) => {
        if (activeGameStore.exists) {
            activeGameStore.removeSpectator(payload.id);
        } else {
            gameBrowserStore.removeSpectator(payload.gameId, payload.id);
        }
    });

    socket.on('roundNumberIncrement', (payload) => {
        gameBrowserStore.incrementRound(payload.gameId);
    });

    socket.on('beginNextRound', (payload) => {
        activeGameStore.incrementRound();

        if (payload.judgeUserId === userStore.user!.id) {
            activeGameStore.myState = PlayerState.Judge;
        } else {
            activeGameStore.myState = PlayerState.Player;
        }
    })

    socket.on('dealCard', (payload) => activeGameStore.hand.push(payload.card));

    socket.on('dealBlackCard', (payload) => activeGameStore.blackCard = payload.card);

    socket.on('roundWinner', (payload) => nuxtApp.$sendSuccessNotification('Round winner!', `${payload.nickname} won that round. One point awarded.`));

    socket.on('gameWinner', (payload) => nuxtApp.$sendSuccessNotification('We have a winner!', `${payload.nickname} won the game.`));
    
    socket.on('resetWarning', (payload) => nuxtApp.$sendWarningNotification('The game will reset!', `The game will reset in ${payload.restInSeconds} seconds.`)) // TODO: notification state

    socket.on('illegalStateTransition', () => nuxtApp.$sendErrorNotification('Oh noes! The game is resetting.', 'The game experienced an illegal state change and is now resetting. Sorry.'));

    socket.on('stateTransition', (payload: Record<string, any>) => {
        if (activeGameStore.exists) {
            const game = activeGameStore.game!;

            if (payload.to === GameState.Abandoned && payload.gameId === game.id && userStore.user!.id !== game.host.id) {
                socket.emit('leaveGame', { gameId: game.id });
                nuxtApp.$sendWarningNotification("Game closed", "The host left the game, so you were removed.");
                return;
            }

            if (payload.to === GameState.Judging) {
                activeGameStore.cardsBeingJudged.push(payload.cardsToJudge);
            } else {
                activeGameStore.cardsBeingJudged.length = 0;
            }

            activeGameStore.setState(payload.to);
            return;
        }

        gameBrowserStore.setState(payload.id, payload.to);
    });

    socket.on('connectionStatus', (payload) => {
        if (payload.type === 'closed') {
            nuxtApp.$sendWarningNotification('Websocket connection closed', payload.message);
        } else {
            nuxtApp.$sendSuccessNotification('Websocket connection established', 'Connection to server established!');
        }
    })

    socket.on('unauthorized', (payload) => nuxtApp.$sendErrorNotification("You can't do that", payload.message));

    return {
        provide: {
            socket
        }
    }
})
import { io } from 'socket.io-client'
import { useGameBrowserStore } from '~/stores/game-browser.store';
import { useNuxtApp } from 'nuxt/app';
import { useUserStore } from '~/stores/user.store';
import { useActiveGameStore } from '~/stores/active-game.store';
import SocketResponse from '~/types/socket-response.interface';
import GameIdPayload from '~/shared-types/game/game-id.payload';
import GameSettingsPayload from '~/shared-types/game/game-settings.payload';
import PartialPlayerPayload from '~/shared-types/game/player/partial-player.payload';
import PlayerPayload from '~/shared-types/game/player/player.payload';
import JudgeIdPayload from '~/shared-types/game/component/judge-id.payload';
import RoundNumberPayload from '~/shared-types/game/component/round-number.payload';
import StateTransitionPayload from '~/shared-types/game/component/state-transition.payload';
import IGame from '~/shared-types/game/game.interface';
import DecksPayload from '~/shared-types/deck/decks.payload';
import IGameSettings from '~/shared-types/game/game-settings.interface';
import { IChatMessage } from '~/shared-types/game/component/message/chat-message.interface';
import CardIdsPayload from '~/shared-types/card/id/card-ids.payload';
import PlayerIdPayload from '~/shared-types/game/player/player-id.payload';
import SpectatorIdPayload from '~/shared-types/game/spectator/spectator-id.payload';
import ISystemMessage from '~/shared-types/game/component/message/system-message.interface';
import SpectatorPayload from '~/shared-types/game/spectator/spectator.payload';
import { PlayerState } from '~/shared-types/game/player/player-state.enum';
import WhiteCardPayload from '~/shared-types/card/white/white-card.payload';
import BlackCardPayload from '~/shared-types/card/black/black-card.payload';
import WhiteCardsPayload from '~/shared-types/card/white/white-cards.payload';
import { GameState } from '~/shared-types/game/game-state.enum';
import WhiteCardsMatrixPayload from '~/shared-types/card/white/white-cards-matrix.payload';

export default defineNuxtPlugin(() => {
    const nuxtApp = useNuxtApp();
    const gameBrowserStore = useGameBrowserStore();
    const activeGameStore = useActiveGameStore();
    const userStore = useUserStore();

    const socket = io(useRuntimeConfig().public.ws, { withCredentials: true });

    const socketOps = {
        listGames: async (): Promise<SocketResponse<IGame[]>> => {
            return socket.emitWithAck('listGames');
        },
        createGame: async (): Promise<SocketResponse<IGame>> => {
            return socket.emitWithAck('createGame');
        },
        startGame: async (): Promise<SocketResponse<null>> => {
            return socket.emitWithAck('startGame');
        },
        stopGame: async (): Promise<SocketResponse<null>> => {
            return socket.emitWithAck('stopGame');
        },
        addDeckToGame: async (deckId: string): Promise<SocketResponse<GameIdPayload & DecksPayload>> => {
            return socket.emitWithAck('addDeckToGame', { deckId });
        },
        removeDeckFromGame: async (deckId: string): Promise<SocketResponse<GameIdPayload & DecksPayload>> => {
            return socket.emitWithAck('removeDeckFromGame', { deckId });
        },
        changeGameSettings: async (settings: Partial<IGameSettings>): Promise<SocketResponse<null>> => {
            return socket.emitWithAck('changeGameSettings', { settings });
        },
        joinGame: async (gameId: string): Promise<SocketResponse<IGame>> => {
            return socket.emitWithAck('joinGame', { gameId })
        },
        spectateGame: async (gameId: string): Promise<SocketResponse<IGame>> => {
            return socket.emitWithAck('spectateGame', { gameId })
        },
        leaveGame: async (): Promise<SocketResponse<null>> => {
            return socket.emitWithAck('leaveGame');
        },
        unspectateGame: async (): Promise<SocketResponse<null>> => {
            return socket.emitWithAck('unspectateGame');
        },
        sendGameChat: async (message: string): Promise<SocketResponse<null>> => {
            return socket.emitWithAck('sendGameChat', { message });
        },
        playCards: async (cardIds: string[]): Promise<SocketResponse<null>> => {
            return socket.emitWithAck('playCards', { cardIds });
        },
        judgeCards: async (cardIds: string[]): Promise<SocketResponse<null>> => {
            return socket.emitWithAck('judgeCards', { cardIds });
        }
    };

    socket.on('gameAdded', (game: IGame) => gameBrowserStore.add(game));

    socket.on('decksUpdated', (payload: GameIdPayload & DecksPayload) => {
        if (activeGameStore.exists) {
            activeGameStore.setDecks(payload.decks);
        } else {
            gameBrowserStore.setDecks(payload.gameId, payload.decks);
        }
    });

    socket.on('settingsUpdated', (payload: GameIdPayload & GameSettingsPayload) => {
        if (activeGameStore.exists) {
            activeGameStore.setSettings(payload.settings);
        } else {
            gameBrowserStore.setSettings(payload.gameId, payload.settings);
        }
    });

    socket.on('chat', (payload: IChatMessage) => activeGameStore.addChat(payload));

    socket.on('systemMessage', (payload: ISystemMessage) => activeGameStore.addSystemMessage(payload));

    // TODO: update player status to show no longer waiting on them to play
    socket.on('cardsPlayed', (payload: CardIdsPayload & PartialPlayerPayload) => nuxtApp.$sendSuccessNotification('Cards played!', `${payload.player.nickname} has played their cards!`));

    socket.on('playerJoined', (payload: GameIdPayload & PlayerPayload) => {
        if (activeGameStore.exists) {
            activeGameStore.addPlayer(payload.player);
            activeGameStore.addSystemMessageDirectly(`${payload.player.nickname} has joined the game`);
        } else {
            gameBrowserStore.addPlayer(payload.gameId, payload.player);
        }
    });

    socket.on('playerLeft', (payload: GameIdPayload & PlayerIdPayload) => {
        if (activeGameStore.exists) {
            activeGameStore.addSystemMessageDirectly(`${activeGameStore.getPlayerById(payload.playerId)!.nickname} has left the game`);
            activeGameStore.removePlayer(payload.playerId);
        } else {
            gameBrowserStore.removePlayer(payload.gameId, payload.playerId);
        }
    });

    socket.on('gameRemoved', (payload: GameIdPayload) => gameBrowserStore.remove(payload.gameId));

    socket.on('spectatorJoined', (payload: GameIdPayload & SpectatorPayload) => {
        if (activeGameStore.exists) {
            activeGameStore.addSpectator(payload.spectator);
            activeGameStore.addSystemMessageDirectly(`${payload.spectator.nickname} has started spectating the game`);
        } else {
            gameBrowserStore.addSpectator(payload.gameId, payload.spectator);
        }
    });

    socket.on('spectatorLeft', (payload: GameIdPayload & SpectatorIdPayload) => {
        if (activeGameStore.exists) {
            activeGameStore.addSystemMessageDirectly(`${activeGameStore.getSpectatorById(payload.spectatorId)!.nickname} has stopped spectating the game`);
            activeGameStore.removeSpectator(payload.spectatorId);
        } else {
            gameBrowserStore.removeSpectator(payload.gameId, payload.spectatorId);
        }
    });

    socket.on('beginNextRound', (payload: GameIdPayload & JudgeIdPayload & RoundNumberPayload) => {
        activeGameStore.incrementRound();
        activeGameStore.resetPlayerStates();
        activeGameStore.setPlayerState(payload.judgeId, PlayerState.Judge);
        activeGameStore.addSystemMessageDirectly(`The next round has begun. This round's judge is ${activeGameStore.getPlayerById(payload.judgeId)!.nickname}.`);
    });

    socket.on('dealCard', (payload: WhiteCardPayload & GameIdPayload & PartialPlayerPayload) => activeGameStore.hand.push(payload.card));

    socket.on('dealBlackCard', (payload: BlackCardPayload & GameIdPayload) => activeGameStore.blackCard = payload.card);

    socket.on('cardsToJudge', (payload: GameIdPayload & WhiteCardsMatrixPayload) => activeGameStore.cardsBeingJudged = payload.matrix);

    // TODO: ??? cheer or something
    socket.on('roundWinner', (payload: GameIdPayload & PartialPlayerPayload & WhiteCardsPayload) => null);

    socket.on('stateTransition', (payload: GameIdPayload & StateTransitionPayload) => {
        if (activeGameStore.exists) {
            const game = activeGameStore.game!;

            if (payload.to === GameState.Abandoned && payload.gameId === game.id && userStore.user!.id !== game.host.id) {
                socket.emit('leaveGame', { gameId: game.id });
                nuxtApp.$sendWarningNotification("Game closed", "The host left the game, so you were removed.");
                return;
            }

            if (payload.to === GameState.Reset) {
                activeGameStore.resetGameData();
            }
  
            activeGameStore.setState(payload.to);
            return;
        }

        gameBrowserStore.setState(payload.gameId, payload.to);
    });

    socket.on('illegalStateTransition', (payload: GameIdPayload & StateTransitionPayload) => nuxtApp.$sendErrorNotification('Oh noes! The game is resetting.', 'The game experienced an illegal state change and is now resetting. Sorry.'));

    socket.on('connectionStatus', (payload) => {
        if (payload.type === 'closed') {
            nuxtApp.$sendWarningNotification('Websocket connection closed', payload.message);
        } else {
            nuxtApp.$sendSuccessNotification('Websocket connection established', 'Connection to server established!');
        }
    });

    socket.on('unauthorized', (payload) => nuxtApp.$sendErrorNotification("You can't do that", payload.message));

    return {
        provide: {
            socket,
            socketOps
        }
    }
})
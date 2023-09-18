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
import PlayerIdPayload from '~/shared-types/game/player/player-id.payload';
import SpectatorIdPayload from '~/shared-types/game/spectator/spectator-id.payload';
import SpectatorPayload from '~/shared-types/game/spectator/spectator.payload';
import { PlayerState } from '~/shared-types/game/player/player-state.enum';
import WhiteCardPayload from '~/shared-types/card/white/white-card.payload';
import BlackCardPayload from '~/shared-types/card/black/black-card.payload';
import WhiteCardsPayload from '~/shared-types/card/white/white-cards.payload';
import { GameState } from '~/shared-types/game/game-state.enum';
import WhiteCardsMatrixPayload from '~/shared-types/card/white/white-cards-matrix.payload';
import ConnectionStatusPayload from '~/shared-types/misc/connection-status.payload';
import UnauthorizedPayload from '~/shared-types/misc/unauthorized.payload';
import IMessage from '~/shared-types/game/component/message/message.interface';
import SecondsPayload from '~/shared-types/game/component/seconds.payload';

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
        addDeckToGame: async (deckId: string): Promise<SocketResponse<null>> => {
            return socket.emitWithAck('addDeckToGame', { deckId });
        },
        removeDeckFromGame: async (deckId: string): Promise<SocketResponse<null>> => {
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

    socket.on('gameAdded', (resp: SocketResponse<IGame>) => {
        gameBrowserStore.add(resp.data!)
    });

    socket.on('decksUpdated', (resp: SocketResponse<GameIdPayload & DecksPayload>) => {
        const { gameId, decks } = resp.data!;
        if (activeGameStore.exists) {
            activeGameStore.setDecks(decks);
        } else {
            gameBrowserStore.setDecks(gameId, decks);
        }
    });

    socket.on('settingsUpdated', (resp: SocketResponse<GameIdPayload & GameSettingsPayload>) => {
        const { gameId, settings } = resp.data!;
        if (activeGameStore.exists) {
            activeGameStore.setSettings(settings);
        } else {
            gameBrowserStore.setSettings(gameId, settings);
        }
    });

    socket.on('chat', (resp: SocketResponse<IMessage>) => {
        activeGameStore.addMessage(resp.data!);
    });

    socket.on('systemMessage', (resp: SocketResponse<IMessage>) => {
        activeGameStore.addMessage(resp.data!);
    });

    socket.on('cardsPlayed', (resp: SocketResponse<PartialPlayerPayload>) => {
        activeGameStore.updatePlayer(resp.data!.player.id!, player => player.needToPlay = false);
    });

    socket.on('playerJoined', (resp: SocketResponse<GameIdPayload & PlayerPayload>) => {
        const { gameId, player } = resp.data!;
        if (activeGameStore.exists) {
            activeGameStore.addPlayer(player);
        } else {
            gameBrowserStore.addPlayer(gameId, player);
        }
    });

    socket.on('playerLeft', (resp: SocketResponse<GameIdPayload & PlayerIdPayload>) => {
        const { gameId, playerId } = resp.data!;
        if (activeGameStore.exists) {
            activeGameStore.removePlayer(playerId);
        } else {
            gameBrowserStore.removePlayer(gameId, playerId);
        }
    });

    socket.on('gameRemoved', (resp: SocketResponse<GameIdPayload>) => {
        gameBrowserStore.remove(resp.data!.gameId);
    });

    socket.on('spectatorJoined', (resp: SocketResponse<GameIdPayload & SpectatorPayload>) => {
        const { gameId, spectator } = resp.data!;
        if (activeGameStore.exists) {
            activeGameStore.addSpectator(spectator);
        } else {
            gameBrowserStore.addSpectator(gameId, spectator);
        }
    });

    socket.on('spectatorLeft', (resp: SocketResponse<GameIdPayload & SpectatorIdPayload>) => {
        const { gameId, spectatorId } = resp.data!;
        if (activeGameStore.exists) {
            activeGameStore.removeSpectator(spectatorId);
        } else {
            gameBrowserStore.removeSpectator(gameId, spectatorId);
        }
    });

    socket.on('beginNextRound', (resp: SocketResponse<GameIdPayload & JudgeIdPayload & RoundNumberPayload>) => {
        const { gameId, judgeId, roundNumber } = resp.data!;
        if (activeGameStore.exists) {
            activeGameStore.incrementRound();
            activeGameStore.resetPlayerStates();
            activeGameStore.setPlayerState(judgeId, PlayerState.Judge);
        } else {
            gameBrowserStore.incrementRound(gameId);
        }
    });

    socket.on('dealCard', (resp: SocketResponse<WhiteCardPayload & GameIdPayload & PartialPlayerPayload>) => {
        activeGameStore.hand.push(resp.data!.card);
    });

    socket.on('dealBlackCard', (resp: SocketResponse<BlackCardPayload & GameIdPayload>) => {
        activeGameStore.blackCard = resp.data!.card;
    });

    socket.on('cardsToJudge', (resp: SocketResponse<GameIdPayload & WhiteCardsMatrixPayload>) => {
        activeGameStore.cardsBeingJudged = resp.data!.matrix;
    });

    socket.on('roundWinner', (resp: SocketResponse<GameIdPayload & PartialPlayerPayload & WhiteCardsPayload>) => {
        activeGameStore.incrementPlayerScore(resp.data!.player.id!);
        activeGameStore.winningCards = resp.data!.cards;
    });
    
    socket.on('startTimer', (resp: SocketResponse<SecondsPayload>) => {
        activeGameStore.startTimer(resp.data!.seconds);
    });

    socket.on('clearTimer', (resp: SocketResponse<null>) => {
        activeGameStore.clearTimer();
    });

    socket.on('stateTransition', async (resp: SocketResponse<GameIdPayload & StateTransitionPayload>) => {
        const { gameId, to } = resp.data!;

        if (activeGameStore.exists) {
            activeGameStore.setState(to);
        } else {
            gameBrowserStore.setState(gameId, to);
        }

        function handleLobby(gameId: string) {

        }
    
        function handleDealing(gameId: string) {
            // TODO: play dealing sound or something fun
        }
    
        function handlePlaying(gameId: string) {
            if (activeGameStore.exists) {
                activeGameStore.updateEachPlayer(player => {
                    player.needToPlay = player.state === PlayerState.Player;
                });
            }
        }
    
        function handleJudging(gameId: string) {
            if (activeGameStore.exists) {
                activeGameStore.updateEachPlayer(player => {
                    player.needToPlay = player.state === PlayerState.Judge;
                });
            }
        }
    
        function handleWin(gameId: string) {
            // TODO: if this client is the winner, play celebration 
            // sound or something fun
        }
    
        function handleReset(gameId: string) {
            if (activeGameStore.exists) {
                activeGameStore.resetGameData();
            }
        }

        async function handleAbandoned(gameId: string) {
            if (activeGameStore.exists) {
                const game = activeGameStore.game!;
                if (gameId === game.id && userStore.user!.id !== game.host.id) {
                    await socketOps.leaveGame();
                    activeGameStore.resetStore();
                    nuxtApp.$sendWarningNotification("Game closed", "The host left the game, so you were removed.");
                    return;
                }
            }
        }

        switch (to) {
            case GameState.Lobby:
                handleLobby(gameId);
                break;
            case GameState.Dealing:
                handleDealing(gameId);
                break;
            case GameState.Playing:
                handlePlaying(gameId);
                break;
            case GameState.Judging:
                handleJudging(gameId);
                break;
            case GameState.Win:
                handleWin(gameId);
                break;
            case GameState.Reset:
                handleReset(gameId);
                break;
            case GameState.Abandoned:
                handleAbandoned(gameId);
                break;
        }
    });
    
    socket.on('illegalStateTransition', (resp: SocketResponse<GameIdPayload & StateTransitionPayload>) => {
        nuxtApp.$sendErrorNotification('Oh noes! The game is resetting.', 'The game experienced an illegal state change and is now resetting. Sorry.');
    });

    socket.on('connectionStatus', (resp: SocketResponse<ConnectionStatusPayload>) => {
        const { status, type, message } = resp.data!;

        if (status === 'closed') {
            nuxtApp.$sendWarningNotification('Websocket connection closed', message || "Unknown reason");
        } else {
            nuxtApp.$sendSuccessNotification('Websocket connection established', 'Connection to server established!');
        }
    });

    socket.on('unauthorized', (resp: SocketResponse<UnauthorizedPayload>) => {
        nuxtApp.$sendErrorNotification("You can't do that", resp.data!.message || "Unknown")
    });

    return {
        provide: {
            socket,
            socketOps
        }
    }
})
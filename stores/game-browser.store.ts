import { defineStore } from "pinia";
import IDeck from "~/shared-types/deck/deck.interface";
import IGameSettings from "~/shared-types/game/game-settings.interface";
import IGame from "~/shared-types/game/game.interface";
import IPlayer from "~/shared-types/game/player/player.interface";
import ISpectator from "~/shared-types/game/spectator/spectator.interface";
import { GameState } from "~/shared-types/game/game-state.enum";

export const useGameBrowserStore = defineStore('game-browser', () => {
    const games = ref<IGame[]>([]);

    function add(game: IGame) {
        games.value.push(game);
    }

    function update(gameId: string, modifier: (game: IGame) => IGame) {
        const gameIdx = games.value.findIndex(g => g.id === gameId);

        if (gameIdx === -1) {
            return;
        }

        games.value[gameIdx] = modifier(games.value[gameIdx]);
    }

    function remove(gameId: string) {
        games.value = games.value.filter(g => g.id !== gameId);
    }

    function addPlayer(gameId: string, player: IPlayer) {
        update(gameId, game => {
            game.players.push(player);
            return game;
        })
    }

    function removePlayer(gameId: string, userId: string) {
        update(gameId, game => {
            game.players = game.players.filter(p => p.id !== userId);
            return game;
        })
    }

    function addSpectator(gameId: string, spectator: ISpectator) {
        update(gameId, game => {
            game.spectators.push(spectator);
            return game;
        })
    }

    function removeSpectator(gameId: string, userId: string) {
        update(gameId, game => {
            game.spectators = game.spectators.filter(s => s.id !== userId);
            return game;
        })
    }

    function incrementRound(gameId: string) {
        update(gameId, game => {
            game.roundNumber++;
            return game;
        });
    }

    function setDecks(gameId: string, decks: IDeck[]) {
        update(gameId, game => {
            game.decks = decks;
            return game;
        });
    }

    function setSettings(gameId: string, settings: IGameSettings) {
        update(gameId, game => {
            game.settings = settings;
            return game;
        })
    }

    function setState(gameId: string, state: GameState) {
        update(gameId, game => {
            game.state = state;
            return game;
        })
    }

    return {
        games,
        add,
        update,
        remove,
        addPlayer,
        removePlayer,
        addSpectator,
        removeSpectator,
        incrementRound,
        setDecks,
        setSettings,
        setState
    };
});
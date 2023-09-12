import { defineStore } from "pinia";
import { DeckType } from "~/types/deck.interface";
import { GameSettings } from "~/types/game-settings.interface";
import { GameState } from "~/types/game-state.enum";
import { GameType } from "~/types/game.interface";
import PlayerType from "~/types/player.interface";
import SpectatorType from "~/types/spectator.interface";

export const useGameBrowserStore = defineStore('game-browser', () => {
    const games = ref<GameType[]>([]);

    function add(game: GameType) {
        games.value.push(game);
    }

    function update(gameId: string, modifier: (game: GameType) => GameType) {
        const gameIdx = games.value.findIndex(g => g.id === gameId);

        if (gameIdx === -1) {
            return;
        }

        games.value[gameIdx] = modifier(games.value[gameIdx]);
    }

    function remove(gameId: string) {
        games.value = games.value.filter(g => g.id !== gameId);
    }

    function addPlayer(gameId: string, player: PlayerType) {
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

    function addSpectator(gameId: string, spectator: SpectatorType) {
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

    function setDecks(gameId: string, decks: DeckType[]) {
        update(gameId, game => {
            game.decks = decks;
            return game;
        });
    }

    function setSettings(gameId: string, settings: GameSettings) {
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
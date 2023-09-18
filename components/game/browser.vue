<script setup lang="ts">
import { GameState } from '~/shared-types/game/game-state.enum';
import { useActiveGameStore } from '~/stores/active-game.store';
import { useGameBrowserStore } from '~/stores/game-browser.store';
import { useModalStore } from '~/stores/modal.store';
import { useUserStore } from '~/stores/user.store';

const nuxtApp = useNuxtApp();
const userStore = useUserStore();
const modalStore = useModalStore();
const gameBrowserStore = useGameBrowserStore();
const activeGameStore = useActiveGameStore();

onMounted(async () => {
    gameBrowserStore.games = (await nuxtApp.$socketOps.listGames()).data!;
});

async function doCreateGame() {
    if (userStore.isAuthenticated) {
        const resp = await nuxtApp.$socketOps.createGame();

        if (resp.status !== "ok") {
            nuxtApp.$sendErrorNotification("Failed to create game.", resp.message!);
        } else {
            activeGameStore.game = resp.data;
        }
    } else {
        modalStore.loginModalOpen = true;
        modalStore.flashMessage = "You need to sign in to create a game! (Sorry, it's quick though.)";
    }
}

async function doJoinGame(gameId: string) {
    if (userStore.isAuthenticated) {
        const resp = await nuxtApp.$socketOps.joinGame(gameId);
        if (resp.status !== "ok") {
            nuxtApp.$sendErrorNotification("Failed to join game.", resp.message!);
        } else {
            activeGameStore.game = resp.data;
        }
    } else {
        modalStore.loginModalOpen = true;
        modalStore.flashMessage = "You need to sign in to join a game! (Sorry, it's quick though.)";
    }
}

async function doSpectateGame(gameId: string) {
    if (userStore.isAuthenticated) {
        const resp = await nuxtApp.$socketOps.spectateGame(gameId);
        if (resp.status !== "ok") {
            nuxtApp.$sendErrorNotification("Failed to spectate game.", resp.message!);
        } else {
            activeGameStore.game = resp.data;
        }
    } else {
        modalStore.loginModalOpen = true;
        modalStore.flashMessage = "You need to sign in to spectate a game! (Sorry, it's quick though.)";
    }
}
</script>

<template>
    <div class="h-full p-4 flex flex-col rounded-md border-2 border-black dark:border-white">
        <div class="flex justify-between items-center">
            <h1 class="text-xl">Game Browser</h1>
            <UiButton @click="doCreateGame">Create a Game</UiButton>
        </div>
        <div v-if="gameBrowserStore.games.length" class="mt-6 grid grid-cols-1 gap-4">
            <div class="relative p-2 border-2 rounded-lg shadow-md border-black text-sm dark:border-white"
                v-for="(game, idx) in gameBrowserStore.games" :key="'game-browser-game-' + idx">
                <h1><span class="font-bold">{{ game.host.nickname }}</span>'s game</h1>
                <div class="absolute text-right top-2 right-2">
                    <p>{{ game.players.length }} / {{ game.settings.maxPlayers }} players</p>
                    <p>{{ game.spectators.length }} / {{ game.settings.maxSpectators }} spectators</p>
                </div>
                <div class="mb-2">
                    <p v-if="game.state === GameState.Lobby">Waiting to start... </p>
                    <p v-else>In progress: {{ game.state }}</p>
                </div>
                <div class="mb-4">
                    <p>Game ends at: {{ game.settings.maxScore }} points</p>
                    <p>Decks in use: {{ game.decks.length === 0 ? 'None yet' : game.decks.map(d => d.name).join(", ") }}</p>
                </div>
                <div class="flex justify-evenly gap-x-2">
                    <UiButton class='w-full' v-if="game.state === GameState.Lobby || game.settings.allowPlayersToJoinMidGame" @click="doJoinGame(game.id)">Join</UiButton>
                    <UiButton class='w-full' @click="doSpectateGame(game.id)">Spectate</UiButton>
                </div>
            </div>
        </div>
        <div v-else class="grow flex flex-col justify-center items-center">
            <p>There are no games to join.</p>
            <UiLink @click="doCreateGame">Why not create one?</UiLink>
        </div>
    </div>
</template>
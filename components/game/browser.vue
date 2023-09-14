<script setup lang="ts">
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
            nuxtApp.$sendErrorNotification("Failed to create game.", resp.message);
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
            nuxtApp.$sendErrorNotification("Failed to join game.", resp.message);
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
            nuxtApp.$sendErrorNotification("Failed to spectate game.", resp.message);
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
    <div class="flex flex-col w-full min-h-[75vh] rounded-md border-2 border-black dark:border-white px-4 py-4">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl">Game Browser</h1>
            <UiButton @click="doCreateGame">Create a Game</UiButton>
        </div>
        <div v-if="gameBrowserStore.games.length" class="mt-6 grid grid-cols-3 gap-4">
            <div class="relative p-4 border-2 border-black dark:border-white" v-for="(game, idx) in gameBrowserStore.games"
                :key="'game-browser-game-' + idx">
                <p class="font-bold">{{ game.host.nickname }}'s game</p>
                <p>{{ game.players.length }} / {{ game.settings.maxPlayers }} players</p>
                <p>{{ game.spectators.length }} / {{ game.settings.maxSpectators }} spectators</p>
                <p>Game ends at: {{ game.settings.maxScore }} points</p>
                <p>Game state: {{ game.state }}</p>
                <p>Decks in use: {{ game.decks.length === 0 ? 'None' : game.decks.map(d => d.name).join(", ") }}</p>
                <div class="flex justify-evenly gap-x-2 mt-4">
                    <UiButton @click="doJoinGame(game.id)">Join</UiButton>
                    <UiButton @click="doSpectateGame(game.id)">Spectate</UiButton>
                </div>
            </div>
        </div>
        <div v-else class="flex-grow flex justify-center items-center">
            <p>There are no games to join. Why not create one?</p>
        </div>
    </div>
</template>
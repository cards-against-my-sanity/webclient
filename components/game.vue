<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '~/stores/game.store';
import { useUserStore } from '~/stores/user.store';
import { GameState } from '~/types/game-state.enum';
import { ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/solid';

const nuxtApp = useNuxtApp();

const gameStore = useGameStore();
const { activeGame } = storeToRefs(gameStore);

const userStore = useUserStore();

const isHost = computed(() => activeGame.value!.host.id === userStore.user!.id);

const availableDecks = await useDecks().fetchDecks();

function leaveGame() {
    nuxtApp.$socket.emit("leaveGame", { gameId: activeGame.value!.id });
}
</script>

<template>
    <div class="flex flex-col">
        <div class="text-center mb-10">
            <h1 class="text-5xl"><span class="font-bold">{{ activeGame!.host.nickname }}</span>'s game</h1>
        </div>
        <div class="grid grid-cols-12 grid-rows-1 gap-4">
            <div class="col-span-2 flex flex-col space-y-4 border-2 border-black dark:border-white p-4 rounded-md">
                <BasicButton @click="leaveGame" class="flex justify-center items-center gap-x-2">
                    <ArrowLeftOnRectangleIcon class="h-6 w-6 inline"></ArrowLeftOnRectangleIcon>
                    Leave Game
                </BasicButton>
                <div>
                    <h2 class="text-2xl">Players ({{ activeGame!.players.length }} / {{ activeGame!.settings.maxPlayers }})</h2>
                </div>
                <ol class="mt-2 mb-2 indent-2 list-decimal list-inside">
                    <li v-for="(player, idx) in activeGame!.players" :key="'player-' + idx" class="text-lg">
                        {{ player.nickname }}
                    </li>
                </ol>
                <template v-if="activeGame!.spectators.length">
                    <div>
                        <h2 class="text-2xl">Spectators ({{ activeGame!.spectators.length }} / {{ activeGame!.settings.maxSpectators }})</h2>
                    </div>
                    <ol class="mt-2 indent-2 list-decimal list-inside">
                        <li v-for="(spectator, idx) in activeGame!.spectators" :key="'spectator-' + idx" class="text-lg">
                            {{ spectator.nickname }}
                        </li>
                    </ol>
                </template>
            </div>
            <div class="col-span-10 text-center border-2 border-black dark:border-white p-4 rounded-md">
                <div v-if="activeGame!.state === GameState.Lobby">
                    <h3 class="text-2xl">Game Settings</h3>

                </div>
            </div>
        </div>
    </div>
</template>
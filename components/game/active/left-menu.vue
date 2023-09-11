<script setup lang="ts">
import { ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/solid';
import { useActiveGameStore } from '~/stores/active-game.store';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);

function leaveGame() {
    nuxtApp.$socket.emit("leaveGame", { gameId: game.value.id });
}
</script>

<template>
    <div class="flex flex-col space-y-4 border-2 border-black dark:border-white p-4 rounded-md">
        <UiButton @click="leaveGame" class="flex justify-center items-center gap-x-2">
            <ArrowLeftOnRectangleIcon class="h-6 w-6 inline"></ArrowLeftOnRectangleIcon>
            Leave Game
        </UiButton>
        <div>
            <h2 class="text-2xl">Players ({{ game.players.length }} / {{ game.settings.maxPlayers }})</h2>
        </div>
        <ol class="mt-2 mb-2 indent-2 list-decimal list-inside">
            <li v-for="(player, idx) in game.players" :key="'player-' + idx" class="text-lg">
                {{ player.nickname }}
            </li>
        </ol>
        <template v-if="game.spectators.length">
            <div>
                <h2 class="text-2xl">Spectators ({{ game.spectators.length }} / {{
                    game.settings.maxSpectators }})</h2>
            </div>
            <ol class="mt-2 indent-2 list-decimal list-inside">
                <li v-for="(spectator, idx) in game.spectators" :key="'spectator-' + idx" class="text-lg">
                    {{ spectator.nickname }}
                </li>
            </ol>
        </template>
    </div>
</template>
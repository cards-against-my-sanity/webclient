<script setup lang="ts">
import { PlayerState } from '~/shared-types/game/player/player-state.enum';
import { useActiveGameStore } from '~/stores/active-game.store';

const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);

const playerStatusLines = computed(() => {
    const players = game.value.players.slice();
    const out: Record<string, string> = {};

    players.forEach(p => {
        const statuses = [];
        
        if (p.id === game.value.host.id) {
            statuses.push('Host');
        }
        
        if (p.state === PlayerState.Judge) {
            statuses.push("Czar");
        }

        out[p.id] = statuses.length ? `(${statuses.join(", ")})` : '';
    });
    
    return out;
});
</script>

<template>
    <div class="flex flex-col space-y-4 border-2 border-black dark:border-white p-4 rounded-md">
        <div>
            <h2 class="text-2xl">Players ({{ game.players.length }} / {{ game.settings.maxPlayers }})</h2>
        </div>
        <ol class="mt-2 mb-2 indent-2 list-decimal list-inside">
            <li v-for="(player, idx) in game.players" :key="'player-' + idx" class="text-lg">
                {{ player.nickname }}
                <span v-if="playerStatusLines[player.id]">{{ playerStatusLines[player.id] }}</span>
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
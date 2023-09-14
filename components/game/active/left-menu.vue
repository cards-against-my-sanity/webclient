<script setup lang="ts">
import { PlayerState } from '~/shared-types/game/player/player-state.enum';
import { useActiveGameStore } from '~/stores/active-game.store';
import { useUserStore } from '~/stores/user.store';

const userStore = useUserStore();
const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);


const playerStatusLines = computed(() => {
    const players = game.value.players.slice();
    const out: Record<string, string> = {};

    players.forEach(p => {
        const statuses = [];
        
        if (p.id === userStore.user!.id) {
            statuses.push("Me");
        }
        
        if (p.id === game.value.host.id) {
            statuses.push('Host');
        }
        
        switch (p.state) {
            case PlayerState.Player:
                statuses.push("Player");
                break;
            case PlayerState.Judge:
                statuses.push("Czar");
                break;
        }

        out[p.id] = statuses.length ? `(${statuses.join(", ")})` : '';
    });
    
    return out;
});
</script>   

<template>
    <div class="flex flex-col w-96 space-y-4 border-2 border-black dark:border-white p-4 rounded-md">
        <div v-for="(player, idx) in game.players" :key="'player-' + idx" class="relative h-16 border-black border-b-2 mt-2 mb-2">
            <p class="font-semibold">{{ player.nickname }}</p>
            <p class="absolute top-1 right-2">{{ playerStatusLines[player.id] }}</p>
            <p class="absolute bottom-1 right-2">Score: {{ player.score }}</p>
        </div>
    </div>
</template>
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
    <div class="h-full w-full space-y-4 text-sm">
        <div v-for="(player, idx) in game.players" :key="'player-' + idx" class="relative h-16 border-b-2 mb-2">
            <p class="absolute top-1 left-1 font-semibold">{{ player.nickname }}</p>
            <p class="absolute top-1 right-1">{{ playerStatusLines[player.id] }}</p>
            <p class="absolute bottom-1 right-1">Score: {{ player.score }}</p>
            <p class="absolute bottom-1 left-1">{{ player.needToPlay ? "Playing" : "Waiting" }}</p>
        </div>
    </div>
</template>
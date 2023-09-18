<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);
const blackCard = computed(() => activeGameStore.blackCard!);
const numPlayersPlayed = computed(() => game.value.players.filter(p => p.id !== activeGameStore.player!.id && !p.needToPlay).length);
</script>

<template>
    <div class="flex flex-col items-center gap-y-2">
        <GameCardBlackCard :card="blackCard" />
        <p class="mt-4 text-xs">You are currently the judge. Please wait for players to play their cards.</p>
    </div>
    <div class="flex overflow-x-auto p-2 py-4 gap-x-4">
        <div v-for="i in numPlayersPlayed" :key="'played-' + i" class="flex gap-x-2">
            <GameCardWhiteCard v-for="j in blackCard.pick" 
                :key="'played-' + i + '-card-' + j" 
                :content="''" />
        </div>
    </div>
</template>
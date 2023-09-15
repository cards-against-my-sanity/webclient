<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
const activeGameStore = useActiveGameStore();
const blackCard = computed(() => activeGameStore.blackCard!);
</script>

<template>
    <div class="col-span-2 flex flex-col items-center gap-y-2">
        <p>This round's black card:</p>
        <GameCardBlackCard :card="blackCard" />
    </div>
    <div class="col-span-8 flex justify-center items-center mb-5">
        <p>White cards played this round:</p>
        <p>// TODO</p>
    </div>
</template>
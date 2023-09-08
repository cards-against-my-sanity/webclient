<script setup lang="ts">
import { useGameStore } from '~/stores/game.store';
const gameStore = useGameStore();
</script>
<template>
    <GameBrowser v-if="!gameStore.hasActiveGame" />
    <Game v-else />
</template> 
<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
const activeGameStore = useActiveGameStore();
</script>

<template>
    <div class="grid grid-cols-10 gap-x-4">
        <GameActiveStatePlayingJudgeView v-if="activeGameStore.isJudge" />
        <GameActiveStatePlayingPlayerView v-else />
    </div>
</template>
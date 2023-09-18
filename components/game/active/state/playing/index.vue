<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
const activeGameStore = useActiveGameStore();
</script>

<template>
    <div class="h-full flex flex-col">
        <GameActiveStatePlayingJudgeView v-if="activeGameStore.isJudge" />
        <GameActiveStatePlayingPlayerView v-else />
    </div>
</template>
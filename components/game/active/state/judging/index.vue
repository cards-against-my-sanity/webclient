<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const activeGameStore = useActiveGameStore();
</script>

<template>
    <div class="h-full flex flex-col">
        <GameActiveStateJudgingJudgeView v-if="activeGameStore.isJudge" />
        <GameActiveStateJudgingPlayerView v-else />
    </div>
</template>